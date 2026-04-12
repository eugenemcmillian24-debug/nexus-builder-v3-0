import { buildBlueprint } from "./router";

export const getBlueprint = async (prompt: string) => {
  return await buildBlueprint(prompt);
};