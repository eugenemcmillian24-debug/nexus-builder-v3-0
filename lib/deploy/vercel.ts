const VERCEL_API = "https://api.vercel.com";
const headers = { Authorization: `Bearer ${process.env.VERCEL_TOKEN}` };

export async function deployToVercel(repoUrl: string, name: string) {
  // 1. Create Project
  const projectRes = await fetch(`${VERCEL_API}/v9/projects`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      name,
      framework: "nextjs",
      gitRepository: { type: "github", repo: repoUrl.replace("https://github.com/", "") }
    })
  });
  const project = await projectRes.json();

  // 2. Trigger Deployment
  const deployRes = await fetch(`${VERCEL_API}/v13/deployments`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      name,
      project: project.id,
      gitSource: { type: "github", ref: "main", repoId: project.link.repoId }
    })
  });

  const deploy = await deployRes.json();
  return { deployUrl: `https://${deploy.alias[0] || deploy.url}`, deploymentId: deploy.id };
}

export async function getDeploymentLogs(deploymentId: string) {
  const res = await fetch(`${VERCEL_API}/v2/deployments/${deploymentId}/events`, { headers });
  return await res.json();
}

export async function setVercelEnvVars(projectId: string, envs: Record<string, string>) {
  for (const [key, value] of Object.entries(envs)) {
    await fetch(`${VERCEL_API}/v9/projects/${projectId}/env`, {
      method: "POST",
      headers,
      body: JSON.stringify({ key, value, type: "plain", target: ["production", "preview", "development"] })
    });
  }
}
