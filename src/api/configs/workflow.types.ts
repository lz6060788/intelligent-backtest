import type { Node,Edge, ViewportTransform } from "@vue-flow/core";

export type WorkflowRunParamsType = {
  id: string;
  inputs: Record<string, unknown>;
  graph: {
    nodes: Node[];
    edges: Edge[];
    viewport: ViewportTransform;
  }
}