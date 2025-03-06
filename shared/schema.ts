import { pgTable, text, serial, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const roadmapNodeSchema = z.object({
  id: z.string(),
  text: z.string(),
  parent: z.string().nullable(),
  position: z.object({
    x: z.number(),
    y: z.number()
  }),
  details: z.object({
    description: z.string(),
    requirements: z.array(z.string()),
    timeline: z.string(),
    resources: z.array(z.string()),
    status: z.enum(["not-started", "in-progress", "completed"]).default("not-started")
  })
});

export type RoadmapNode = z.infer<typeof roadmapNodeSchema>;

export const roadmaps = pgTable("roadmaps", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  nodes: jsonb("nodes").$type<RoadmapNode[]>().notNull()
});

export const insertRoadmapSchema = createInsertSchema(roadmaps).extend({
  nodes: z.array(roadmapNodeSchema)
});

export type InsertRoadmap = z.infer<typeof insertRoadmapSchema>;
export type Roadmap = typeof roadmaps.$inferSelect;