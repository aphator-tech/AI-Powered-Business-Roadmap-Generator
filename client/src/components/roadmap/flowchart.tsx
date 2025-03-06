import { useEffect, useRef, useState } from "react";
import * as go from "gojs";
import type { RoadmapNode } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { exportToPng } from "@/lib/roadmap-utils";
import { Plus, Trash2, Clock, CheckCircle2, FileText, Link } from "lucide-react";

type FlowchartProps = {
  nodes: RoadmapNode[];
  onNodeUpdate: (nodes: RoadmapNode[]) => void;
};

export function Flowchart({ nodes, onNodeUpdate }: FlowchartProps) {
  const diagramRef = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<RoadmapNode | null>(null);

  useEffect(() => {
    if (!diagramRef.current) return;

    const $ = go.GraphObject.make;
    const diagram = $(go.Diagram, diagramRef.current, {
      initialContentAlignment: go.Spot.Center,
      "undoManager.isEnabled": true,
      layout: $(go.TreeLayout, { 
        angle: 90, 
        layerSpacing: 35,
        arrangement: go.TreeLayout.ArrangementHorizontal
      }),
      allowDelete: true,
      allowCopy: false,
      "clickCreatingTool.insertPart": function(loc: go.Point) {
        const newNode = {
          id: Math.random().toString(36).substr(2, 9),
          text: "New Step",
          parent: null,
          position: { x: loc.x, y: loc.y },
          details: {
            description: "Describe this step...",
            requirements: [],
            timeline: "TBD",
            resources: [],
            status: "not-started"
          }
        };
        const updatedNodes = [...nodes, newNode];
        onNodeUpdate(updatedNodes);
        return null;
      }
    });

    diagram.nodeTemplate =
      $(go.Node, "Auto",
        {
          selectionChanged: function(part: go.Part) {
            if (part.isSelected) {
              (part.findObject("SHAPE") as go.Shape).stroke = "hsl(var(--primary))";
              (part.findObject("SHAPE") as go.Shape).strokeWidth = 3;
              setSelectedNode(part.data);
            } else {
              (part.findObject("SHAPE") as go.Shape).stroke = "hsl(var(--primary))";
              (part.findObject("SHAPE") as go.Shape).strokeWidth = 2;
            }
          }
        },
        $(go.Shape, "RoundedRectangle",
          {
            name: "SHAPE",
            fill: "white",
            stroke: "hsl(var(--primary))",
            strokeWidth: 2,
            portId: "",
            fromLinkable: true,
            toLinkable: true
          }),
        $(go.Panel, "Vertical",
          $(go.TextBlock,
            {
              margin: 8,
              font: "14px system-ui, sans-serif",
              editable: true
            },
            new go.Binding("text", "text").makeTwoWay()),
          $(go.TextBlock,
            {
              margin: new go.Margin(0, 8, 8, 8),
              font: "12px system-ui, sans-serif",
              stroke: "hsl(var(--muted-foreground))"
            },
            new go.Binding("text", "details.timeline"))
        )
      );

    diagram.linkTemplate =
      $(go.Link,
        {
          routing: go.Link.Orthogonal,
          corner: 5,
          relinkableFrom: true,
          relinkableTo: true
        },
        $(go.Shape, { strokeWidth: 2, stroke: "hsl(var(--primary))" }),
        $(go.Shape, { toArrow: "Standard", stroke: "hsl(var(--primary))", fill: "hsl(var(--primary))" })
      );

    diagram.model = $(go.GraphLinksModel, {
      nodeDataArray: nodes,
      linkDataArray: nodes
        .filter(node => node.parent)
        .map(node => ({
          from: node.parent,
          to: node.id
        }))
    });

    diagram.addDiagramListener("TextEdited", function(e) {
      const node = e.subject.part?.data;
      if (node) {
        const updatedNodes = nodes.map(n => 
          n.id === node.id ? { ...n, text: node.text } : n
        );
        onNodeUpdate(updatedNodes);
      }
    });

    diagram.addDiagramListener("SelectionDeleted", function(e) {
      const updatedNodes = nodes.filter(node => 
        !e.subject.iterator.any((part: go.Part) => part.data?.id === node.id)
      );
      onNodeUpdate(updatedNodes);
    });

    return () => {
      diagram.div = null;
    };
  }, [nodes, onNodeUpdate]);

  const handleExport = () => {
    exportToPng("roadmap-diagram");
  };

  const handleStatusUpdate = (nodeId: string, status: "not-started" | "in-progress" | "completed") => {
    const updatedNodes = nodes.map(node =>
      node.id === nodeId
        ? { ...node, details: { ...node.details, status } }
        : node
    );
    onNodeUpdate(updatedNodes);
  };

  return (
    <div className="space-y-4">
      <div 
        id="roadmap-diagram" 
        ref={diagramRef} 
        className="w-full h-[500px] border border-border rounded-lg bg-white"
      />
      <div className="flex gap-2 justify-end">
        <Button onClick={() => diagramRef.current?.focus()} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Step
        </Button>
        <Button onClick={handleExport} variant="outline">
          Export as PNG
        </Button>
      </div>

      <Dialog open={!!selectedNode} onOpenChange={() => setSelectedNode(null)}>
        {selectedNode && (
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {selectedNode.text}
                <Badge variant={
                  selectedNode.details.status === "completed" ? "default" :
                  selectedNode.details.status === "in-progress" ? "secondary" : "outline"
                }>
                  {selectedNode.details.status.replace("-", " ")}
                </Badge>
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-6">
              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Description
                </h4>
                <p className="text-sm text-muted-foreground">
                  {selectedNode.details.description}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Requirements
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {selectedNode.details.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Timeline
                </h4>
                <p className="text-sm text-muted-foreground">
                  {selectedNode.details.timeline}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  <Link className="h-4 w-4" />
                  Resources
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {selectedNode.details.resources.map((resource, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      {resource}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-2">
                <Button
                  variant={selectedNode.details.status === "not-started" ? "default" : "outline"}
                  onClick={() => handleStatusUpdate(selectedNode.id, "not-started")}
                >
                  Not Started
                </Button>
                <Button
                  variant={selectedNode.details.status === "in-progress" ? "default" : "outline"}
                  onClick={() => handleStatusUpdate(selectedNode.id, "in-progress")}
                >
                  In Progress
                </Button>
                <Button
                  variant={selectedNode.details.status === "completed" ? "default" : "outline"}
                  onClick={() => handleStatusUpdate(selectedNode.id, "completed")}
                >
                  Completed
                </Button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}