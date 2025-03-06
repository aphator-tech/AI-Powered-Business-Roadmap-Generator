import { type Roadmap, type InsertRoadmap } from "@shared/schema";

export interface IStorage {
  getRoadmap(id: number): Promise<Roadmap | undefined>;
  createRoadmap(roadmap: InsertRoadmap): Promise<Roadmap>;
  updateRoadmap(id: number, roadmap: Partial<InsertRoadmap>): Promise<Roadmap | undefined>;
}

export class MemStorage implements IStorage {
  private roadmaps: Map<number, Roadmap>;
  private currentId: number;

  constructor() {
    this.roadmaps = new Map();
    this.currentId = 1;
  }

  async getRoadmap(id: number): Promise<Roadmap | undefined> {
    return this.roadmaps.get(id);
  }

  async createRoadmap(insertRoadmap: InsertRoadmap): Promise<Roadmap> {
    const id = this.currentId++;
    const roadmap: Roadmap = { ...insertRoadmap, id };
    this.roadmaps.set(id, roadmap);
    return roadmap;
  }

  async updateRoadmap(id: number, update: Partial<InsertRoadmap>): Promise<Roadmap | undefined> {
    const existing = this.roadmaps.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...update };
    this.roadmaps.set(id, updated);
    return updated;
  }
}

export const storage = new MemStorage();
