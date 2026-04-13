import { AGENT_PROMPTS, routeToAgent } from "./agents";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function callAI(system: string, user: string, maxTokens = 4096) {
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      model: "llama-3.1-70b-versatile",
      max_tokens: maxTokens,
      temperature: 0.2,
    });
    return completion.choices[0]?.message?.content || "";
  } catch (err) {
    console.error("Groq Failed, falling back to OpenRouter:", err);
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "qwen/qwen3-coder:free",
        messages: [{ role: "system", content: system }, { role: "user", content: user }],
      }),
    });
    const data = await response.json();
    return data.choices[0]?.message?.content || "";
  }
}

export async function buildBlueprint(prompt: string) {
  const system = `You are a Nexus Architect. Return a valid JSON object only. No markdown.
  Structure: { appName, description, suggestedRepoName, files: string[], apiRoutes: string[], dbTables: string[], requiredEnvVars: string[], techStack: string[] }`;
  const res = await callAI(system, `Build blueprint for: ${prompt}`, 2048);
  return JSON.parse(res.replace(/```json|```/g, ""));
}

export async function generateFileContent(path: string, blueprint: any, prompt: string) {
  const agentType = routeToAgent(path);
  const agentPrompt = AGENT_PROMPTS[agentType];

  const system = `${agentPrompt}
  You are writing the full code for: ${path}.
  Overall App Architecture: ${JSON.stringify(blueprint)}.
  User Requirement: ${prompt}.
  Rules: Full file only, no placeholders, strict TypeScript, Next.js 15.`;

  return await callAI(system, `Generate code for ${path}`, 8000);
}
