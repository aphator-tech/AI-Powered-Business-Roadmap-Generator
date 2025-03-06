import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GoalForm } from "@/components/roadmap/goal-form";
import { Flowchart } from "@/components/roadmap/flowchart";
import { analyzeIdea, generateRoadmapNodes } from "@/lib/analysis";
import type { RoadmapNode } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { Brain, TrendingUp, ChartBar, AlertTriangle } from "lucide-react";

export default function Home() {
  const [idea, setIdea] = useState("");
  const [nodes, setNodes] = useState<RoadmapNode[]>([]);
  const [analysis, setAnalysis] = useState<any>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Processing",
      description: "Analyzing your idea..."
    });
    try {
      // Analyze the idea using ML
      const ideaAnalysis = await analyzeIdea(idea);
      setAnalysis(ideaAnalysis);

      // Generate roadmap based on analysis
      const roadmapNodes = generateRoadmapNodes(ideaAnalysis);

      // Save to backend
      const res = await apiRequest("POST", "/api/roadmaps", {
        title: idea,
        nodes: roadmapNodes
      });

      const data = await res.json();
      setNodes(data.nodes);

      toast({
        title: "Analysis Complete",
        description: `Analyzed with ${(ideaAnalysis.confidence * 100).toFixed(1)}% confidence`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to analyze idea. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleNodeUpdate = (updatedNodes: RoadmapNode[]) => {
    setNodes(updatedNodes);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">Strategic Framework Generator</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Advanced ML-powered analysis of your idea's potential
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Describe Your Idea</CardTitle>
              <CardDescription>
                Enter your idea and we'll analyze its potential.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  placeholder="Describe your idea..."
                  className="h-24"
                />
                <Button type="submit" className="w-full">
                  Analyze
                </Button>
              </form>
            </CardContent>
          </Card>

          {analysis && (
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="bg-card">
                <CardHeader className="flex flex-row items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle>Market Analysis</CardTitle>
                    <CardDescription>Based on {analysis.category} sector data</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <dl className="space-y-4">
                    <div>
                      <dt className="text-sm text-muted-foreground">Market Size & Growth</dt>
                      <dd className="text-2xl font-semibold">{analysis.insights.marketSize}</dd>
                      <dd className="text-sm text-muted-foreground">{analysis.insights.growthRate}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-muted-foreground">Success Rate</dt>
                      <dd>{analysis.insights.successRate}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-muted-foreground">Time to Market</dt>
                      <dd>{analysis.insights.timeToMarket}</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>

              <Card className="bg-card">
                <CardHeader className="flex flex-row items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle>Risk Analysis</CardTitle>
                    <CardDescription>Critical factors to consider</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analysis.insights.keyRisks.map((risk: string, i: number) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-primary">•</span>
                        {risk}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          )}

          {nodes.length > 0 && (
            <Card className="bg-card">
              <CardHeader>
                <CardTitle>Strategic Framework</CardTitle>
                <CardDescription>
                  ML-generated roadmap based on historical success patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Flowchart nodes={nodes} onNodeUpdate={handleNodeUpdate} />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}