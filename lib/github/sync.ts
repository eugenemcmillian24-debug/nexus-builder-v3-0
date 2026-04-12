import { Octokit } from "@octokit/rest";
import { db } from "@/lib/db";
import { githubRepos, generatedFiles } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

const octokit = new Octokit({ auth: process.env.GITHUB_PAT });

export async function pushToGitHub(userId: string, repoName: string, files: { path: string, content: string }[]) {
  const owner = process.env.GITHUB_BOT_USERNAME!;

  // 1. Get or Create Repo
  try {
    await octokit.repos.get({ owner, repo: repoName });
  } catch {
    await octokit.repos.createForAuthenticatedUser({ name: repoName, private: true });
  }

  // 2. Get latest commit
  const { data: ref } = await octokit.git.getRef({ owner, repo: repoName, ref: "heads/main" }).catch(() => ({ data: null as any }));
  const baseTree = ref ? (await octokit.git.getCommit({ owner, repo: repoName, commit_sha: ref.object.sha })).data.tree.sha : undefined;

  // 3. Create Tree
  const tree = await octokit.git.createTree({
    owner,
    repo: repoName,
    base_tree: baseTree,
    tree: files.map(f => ({
      path: f.path,
      mode: "100644",
      type: "blob",
      content: f.content
    }))
  });

  // 4. Create Commit
  const commit = await octokit.git.createCommit({
    owner,
    repo: repoName,
    message: "🚀 Nexus Build: Atomic Sync",
    tree: tree.data.sha,
    parents: ref ? [ref.object.sha] : []
  });

  // 5. Update Ref
  await octokit.git.updateRef({
    owner,
    repo: repoName,
    ref: "heads/main",
    sha: commit.data.sha,
    force: true
  });

  return `https://github.com/\${owner}/\${repoName}`;
}

export async function pullFromGitHub(userId: string, repoName: string) {
  const owner = process.env.GITHUB_BOT_USERNAME!;
  const { data: files } = await octokit.repos.getContent({ owner, repo: repoName, path: "" });

  // Recursive fetch and DB update logic here (simplified for space)
  const repo = await db.query.githubRepos.findFirst({
    where: and(eq(githubRepos.userId, userId), eq(githubRepos.repoName, repoName))
  });

  if (repo) {
    await db.update(githubRepos).set({ lastSyncAt: new Date() }).where(eq(githubRepos.id, repo.id));
  }
}

export async function registerWebhook(owner: string, repo: string) {
  return await octokit.repos.createHook({
    owner,
    repo,
    config: {
      url: `\${process.env.NEXT_PUBLIC_APP_URL}/api/github/webhook`,
      content_type: "json",
      secret: process.env.GITHUB_WEBHOOK_SECRET,
      insecure_ssl: "0"
    },
    events: ["push"]
  });
}