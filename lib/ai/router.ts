import { AGENT_PROMPTS, routeToAgent } from "./agents";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function callAI(system: string, user: string, maxTokens = 4096, config?: { model?: string, groqKey?: string, openrouterKey?: string }) {
  const modelId = config?.model || "qwen/qwen-2.5-72b-instruct:free";
  const orKey = config?.openrouterKey || process.env.OPENROUTER_API_KEY;

  // If using a Groq model specifically or if Groq key provided
  if (modelId.includes("llama-3.1-70b-versatile") || config?.groqKey) {
    const apiKey = config?.groqKey || process.env.GROQ_API_KEY;
    const client = new Groq({ apiKey });
    try {
      const completion = await client.chat.completions.create({
        messages: [{ role: "system", content: system }, { role: "user", content: user }],
        model: "llama-3.1-70b-versatile",
        max_tokens: maxTokens,
        temperature: 0.2,
      });
      return completion.choices[0]?.message?.content || "";
    } catch (err) {
      console.error("Groq Failed, falling back to OpenRouter free model");
    }
  }

  // Default to OpenRouter for all free models
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${orKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: modelId,
      messages: [{ role: "system", content: system }, { role: "user", content: user }],
    }),
  });
  const data = await response.json();
  return data.choices[0]?.message?.content || "";
}

export async function buildBlueprint(prompt: string) {
  const system = `You are a Nexus Architect. Return a valid JSON object only. No markdown.
  Structure: { appName, description, suggestedRepoName, files: string[], apiRoutes: string[], dbTables: string[], requiredEnvVars: string[], techStack: string[] }`;
  const res = await callAI(system, `Build blueprint for: ${prompt}`, 2048);
  return JSON.parse(res.replace(/```json|```/g, ""));
}

export async function generateFileContent(path: string, blueprint: any, prompt: string, config?: { model?: string }) {
  const agentType = routeToAgent(path);
  const agentPrompt = AGENT_PROMPTS[agentType];

  const system = `${agentPrompt}
  You are writing the full code for: ${path}.
  Overall App Architecture: ${JSON.stringify(blueprint)}.
  User Requirement: ${prompt}.
  Rules: Full file only, no placeholders, strict TypeScript, Next.js 15.`;

  return await callAI(system, `Generate code for ${path}`, 8000, config);
}
