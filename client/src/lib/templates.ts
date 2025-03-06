import type { RoadmapNode } from "@shared/schema";

type TemplateCategory = "tech" | "service" | "product" | "community";

interface MarketInsight {
  trend: "growing" | "stable" | "declining";
  competition: "high" | "medium" | "low";
  marketSize: string;
  keyMetrics: string[];
}

interface Template {
  title: string;
  category: TemplateCategory;
  nodes: RoadmapNode[];
  insights: MarketInsight;
  keywords: string[];
}

export const roadmapTemplates: Record<string, Template> = {
  "tech": {
    title: "Technology Product Development",
    category: "tech",
    keywords: ["app", "software", "platform", "automation", "ai", "tech", "digital"],
    insights: {
      trend: "growing",
      competition: "high",
      marketSize: "$2.1T (2024)",
      keyMetrics: [
        "User Acquisition Cost: $30-150",
        "Typical MVP Timeline: 3-6 months",
        "Average Success Rate: 20%",
        "Initial Investment: $50K-200K"
      ]
    },
    nodes: [
      { id: "1", text: "Core Technology Stack", parent: null, position: { x: 100, y: 100 } },
      { id: "2", text: "Market-Product Fit", parent: "1", position: { x: 200, y: 150 } },
      { id: "3", text: "Technical Architecture", parent: "1", position: { x: 200, y: 250 } },
      { id: "4", text: "MVP Scope", parent: "1", position: { x: 300, y: 200 } },
      { id: "5", text: "Beta Testing", parent: "4", position: { x: 400, y: 150 } },
      { id: "6", text: "Scaling Strategy", parent: "4", position: { x: 400, y: 250 } }
    ]
  },
  "service": {
    title: "Service Business Development",
    category: "service",
    keywords: ["service", "consulting", "agency", "support", "coaching", "professional"],
    insights: {
      trend: "stable",
      competition: "medium",
      marketSize: "$420B (2024)",
      keyMetrics: [
        "Client Acquisition Cost: $200-500",
        "Time to First Client: 1-3 months",
        "Success Rate: 35%",
        "Initial Investment: $10K-50K"
      ]
    },
    nodes: [
      { id: "1", text: "Service Definition", parent: null, position: { x: 100, y: 100 } },
      { id: "2", text: "Client Persona", parent: "1", position: { x: 200, y: 150 } },
      { id: "3", text: "Delivery Process", parent: "1", position: { x: 200, y: 250 } },
      { id: "4", text: "Pricing Strategy", parent: "1", position: { x: 300, y: 200 } },
      { id: "5", text: "Client Pipeline", parent: "4", position: { x: 400, y: 150 } },
      { id: "6", text: "Service Scaling", parent: "4", position: { x: 400, y: 250 } }
    ]
  }
};

export function determineTemplateType(idea: string): Template {
  const words = idea.toLowerCase().split(" ");

  // Count keyword matches for each template
  const scores = Object.entries(roadmapTemplates).map(([key, template]) => {
    const score = template.keywords.reduce((acc, keyword) => {
      return acc + (words.filter(word => word.includes(keyword)).length);
    }, 0);
    return { key, score };
  });

  // Return the template with highest matching score
  const bestMatch = scores.reduce((a, b) => a.score > b.score ? a : b);
  return roadmapTemplates[bestMatch.key];
}

export const insightSuggestions = [
  "Analyze competitive moat potential",
  "Map core value hypothesis",
  "Identify critical growth vectors",
  "Calculate unit economics model",
  "Design distribution channels",
  "Structure key partnerships",
  "Plan resource allocation",
  "Define success metrics"
];