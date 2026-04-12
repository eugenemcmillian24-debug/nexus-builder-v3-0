import { pgTable, text, integer, serial, timestamp, boolean, jsonb, uniqueIndex } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull(),
  name: text("name"),
  avatarUrl: text("avatar_url"),
  credits: integer("credits").default(0).notNull(),
  plan: text("plan").default("starter").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const builds = pgTable("builds", {
  id: serial("id").primaryKey(),
  userId: text("user_id").references(() => users.id).notNull(),
  prompt: text("prompt").notNull(),
  repoUrl: text("repo_url"),
  deployUrl: text("deploy_url"),
  fileCount: integer("file_count").default(0),
  status: text("status").default("pending").notNull(), // pending|building|complete|error|synced
  blueprint: jsonb("blueprint"),
  creditsUsed: integer("credits_used").default(45).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
});

export const githubRepos = pgTable("github_repos", {
  id: serial("id").primaryKey(),
  userId: text("user_id").references(() => users.id).notNull(),
  owner: text("owner").notNull(),
  repoName: text("repo_name").notNull(),
  repoUrl: text("repo_url").notNull(),
  branch: text("branch").default("main").notNull(),
  webhookId: integer("webhook_id"),
  lastSyncAt: timestamp("last_sync_at"),
  lastCommitSha: text("last_commit_sha"),
  syncDirection: text("sync_direction").default("both").notNull(),
  deploymentId: text("deployment_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => ({
  userRepoIdx: uniqueIndex("user_repo_idx").on(t.userId, t.repoName),
}));

export const generatedFiles = pgTable("generated_files", {
  id: serial("id").primaryKey(),
  buildId: integer("build_id").references(() => builds.id, { onDelete: "cascade" }).notNull(),
  path: text("path").notNull(),
  content: text("content").notNull(),
  sizeBytes: integer("size_bytes").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const creditTx = pgTable("credit_tx", {
  id: serial("id").primaryKey(),
  userId: text("user_id").references(() => users.id).notNull(),
  amount: integer("amount").notNull(),
  type: text("type").notNull(), // purchase|build|refund|bonus
  buildId: integer("build_id"),
  stripeId: text("stripe_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});