export function generateScaffoldCommands(appName: string) {
  return [
    "npx create-next-app@latest . --ts --tailwind --eslint --app --src-dir=false --import-alias='@/*'",
    "npm install drizzle-orm @neondatabase/serverless lucide-react clsx tailwind-merge",
    "npm install -D drizzle-kit"
  ];
}

export async function scaffoldProject(blueprint: any) {
  // Returns a list of core configuration files to be generated first
  return [
    { path: "package.json", content: "" },
    { path: "tsconfig.json", content: "" },
    { path: "next.config.js", content: "" },
    { path: "tailwind.config.ts", content: "" },
    { path: "drizzle.config.ts", content: "" },
    { path: "lib/db/index.ts", content: "" },
    { path: "lib/db/schema.ts", content: "" }
  ];
}