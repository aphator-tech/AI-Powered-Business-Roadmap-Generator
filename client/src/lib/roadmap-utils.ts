import html2canvas from "html2canvas";
import type { RoadmapNode } from "@shared/schema";

export async function exportToPng(elementId: string) {
  const element = document.getElementById(elementId);
  if (!element) return;

  const canvas = await html2canvas(element);
  const dataUrl = canvas.toDataURL("image/png");

  const link = document.createElement("a");
  link.download = "roadmap.png";
  link.href = dataUrl;
  link.click();
}

export function generateNodeId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function createNode(text: string, parent: string | null, x: number, y: number): RoadmapNode {
  return {
    id: generateNodeId(),
    text,
    parent,
    position: { x, y },
    details: {
      description: "Add description...",
      requirements: [],
      timeline: "Timeline to be determined",
      resources: [],
      status: "not-started" as const
    }
  };
}