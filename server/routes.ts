import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertRoadmapSchema } from "@shared/schema";

export async function registerRoutes(app: Express) {
  app.post("/api/roadmaps", async (req, res) => {
    try {
      const data = insertRoadmapSchema.parse(req.body);
      const roadmap = await storage.createRoadmap(data);
      res.json(roadmap);
    } catch (error) {
      res.status(400).json({ error: "Invalid roadmap data" });
    }
  });

  app.get("/api/roadmaps/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const roadmap = await storage.getRoadmap(id);
    if (!roadmap) {
      res.status(404).json({ error: "Roadmap not found" });
      return;
    }
    res.json(roadmap);
  });

  app.patch("/api/roadmaps/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = insertRoadmapSchema.partial().parse(req.body);
      const roadmap = await storage.updateRoadmap(id, data);
      if (!roadmap) {
        res.status(404).json({ error: "Roadmap not found" });
        return;
      }
      res.json(roadmap);
    } catch (error) {
      res.status(400).json({ error: "Invalid update data" });
    }
  });

  return createServer(app);
}