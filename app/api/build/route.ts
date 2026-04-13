import { NextRequest } from "next/server";
import { getUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { users, builds, generatedFiles, creditTx } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import { buildBlueprint, generateFileContent } from "@/lib/ai/router";
import { pushToGitHub } from "@/lib/github/sync";
import { deployToVercel } from "@/lib/deploy/vercel";
import { getDeploymentLogs } from "@/lib/deploy/vercel";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function POST(req: NextRequest) {
  const user = await getUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const { prompt, model } = await req.json();
  const userData = await db.query.users.findFirst({ where: eq(users.id, user.id) });

  if (!userData || userData.credits < 45) {
    return new Response("Insufficient credits", { status: 402 });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: any) => controller.enqueue(encoder.encode(`data: \${JSON.stringify(data)}\n\n`));

      try {
        // 0. Deduct Credits
        await db.update(users).set({ credits: sql`\${users.credits} - 45` }).where(eq(users.id, user.id));
        const [build] = await db.insert(builds).values({ userId: user.id, prompt, status: "building" }).returning();

        // 1. Phase: Blueprint
        send({ type: "phase", phase: "blueprint" });
        send({ type: "log", level: "cmd", text: "Analyzing prompt and architecting nexus..." });
        const blueprint = await buildBlueprint(prompt);
        await db.update(builds).set({ blueprint }).where(eq(builds.id, build.id));
        send({ type: "log", level: "ok", text: `Blueprint generated: \${blueprint.appName}` });

        // 2. Phase: Scaffold
        send({ type: "phase", phase: "scaffold" });
        send({ type: "log", level: "cmd", text: "Scaffolding project structure..." });
        send({ type: "suggestion", commands: ["npm install", "npm run dev"] });

        // 3. Phase: Generate
        send({ type: "phase", phase: "generate" });
        send({ type: "log", level: "info", text: "Dispatching Specialized Agents (Frontend, Backend, DB, Config)..." });

        const files: { path: string, content: string }[] = [];
        const generateTasks = blueprint.files.map(async (path: string) => {
          const start = Date.now();
          const content = await generateFileContent(path, blueprint, prompt, { model });
          const size = Buffer.byteLength(content);

          await db.insert(generatedFiles).values({ buildId: build.id, path, content, sizeBytes: size });

          return { path, content, size, duration: Date.now() - start };
        });

        // Parallel execution with Promise.all
        const results = await Promise.all(generateTasks);

        for (const res of results) {
          files.push({ path: res.path, content: res.content });
          send({
            type: "file",
            path: res.path,
            content: res.content,
            size: `\${(res.size / 1024).toFixed(2)}kb`,
            ms: res.duration
          });
          send({ type: "log", level: "code", text: `[AGENT] Generated \${res.path}` });
        }

        // 3.5 Phase: Documentation
        send({ type: "log", level: "cmd", text: "Generating project documentation (README.md)..." });
        const readmeContent = await generateFileContent("README.md", blueprint, prompt);
        const readmeSize = Buffer.byteLength(readmeContent);
        await db.insert(generatedFiles).values({ buildId: build.id, path: "README.md", content: readmeContent, sizeBytes: readmeSize });
        files.push({ path: "README.md", content: readmeContent });
        send({ type: "file", path: "README.md", content: readmeContent, size: `\${(readmeSize / 1024).toFixed(2)}kb`, ms: 1000 });

        // 4. Phase: GitHub
        send({ type: "phase", phase: "github" });
        send({ type: "log", level: "cmd", text: "Pushing to GitHub..." });
        const repoUrl = await pushToGitHub(user.id, blueprint.suggestedRepoName, files);
        await db.update(builds).set({ repoUrl }).where(eq(builds.id, build.id));
        send({ type: "log", level: "ok", text: `Pushed to \${repoUrl}` });

        // 5. Phase: Deploy
        send({ type: "phase", phase: "deploy" });
        send({ type: "log", level: "cmd", text: "Deploying to Vercel..." });
        const { deployUrl, deploymentId } = await deployToVercel(repoUrl, blueprint.suggestedRepoName);
        send({ type: "log", level: "info", text: `Deployment initialized: \${deploymentId}` });

        // Stream Vercel build logs
        let lastLogId = "";
        let retryCount = 0;
        while (retryCount < 60) { // Polling logs for ~5 mins max
          const events = await getDeploymentLogs(deploymentId);
          const newEvents = events.filter((e: any) => e.id > lastLogId);

          for (const event of newEvents) {
            lastLogId = event.id;
            const logText = event.payload?.text || event.text;
            if (logText) {
              send({ type: "log", level: "info", text: `[VERCEL] \${logText.trim()}` });
            }
          }

          const statusRes = await fetch(`https://api.vercel.com/v13/deployments/\${deploymentId}`, {
            headers: { Authorization: `Bearer \${process.env.VERCEL_TOKEN}` }
          });
          const statusData = await statusRes.json();
          if (statusData.status === "READY" || statusData.status === "ERROR") {
             if (statusData.status === "ERROR") throw new Error("Vercel build failed.");
             break;
          }

          await new Promise(r => setTimeout(r, 5000));
          retryCount++;
        }

        await db.update(builds).set({
          deployUrl,
          status: "complete",
          fileCount: files.length,
          completedAt: new Date()
        }).where(eq(builds.id, build.id));

        send({ type: "done", repoUrl, deployUrl, fileCount: files.length });

        controller.close();
      } catch (err: any) {
        // Refund on error
        await db.update(users).set({ credits: sql`\${users.credits} + 45` }).where(eq(users.id, user.id));
        send({ type: "error", message: err.message });
        controller.close();
      }
    }
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}
