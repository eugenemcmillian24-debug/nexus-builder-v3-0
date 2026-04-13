import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { callAI } from "@/lib/ai/router";
import { routeToAgent, AGENT_PROMPTS } from "@/lib/ai/agents";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { path, content, prompt, blueprint } = await req.json();

  const agentType = routeToAgent(path);
  const agentPrompt = AGENT_PROMPTS[agentType];

  const system = `${agentPrompt}
  You are refining an existing file: ${path}.
  Current Code:
  ${content}

  User Refinement Request: ${prompt}

  Context Blueprint: ${JSON.stringify(blueprint)}

  Rules: Return ONLY the full updated code for this file. No explanations, no markdown blocks.`;

  try {
    const updatedCode = await callAI(system, `Refine the code for ${path} based on: ${prompt}`, 8000);
    return NextResponse.json({ updatedCode: updatedCode.replace(/```[a-z]*
|```/g, "").trim() });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
