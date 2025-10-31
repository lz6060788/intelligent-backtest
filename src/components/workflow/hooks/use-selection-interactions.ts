import type { NodeDragEvent, GraphNode } from "@vue-flow/core"

export const useSelectionInteractions = () => {
  const handleSelectionStart = (e: MouseEvent) => {
    console.log(e)
  }
  
  const handleSelectionDrag = (e: NodeDragEvent) => {
    console.log(e)
  }
  
  const handleSelectionContextMenu = (selectionEvent: {
    event: MouseEvent;
    nodes: GraphNode<any, any, string>[];
  }) => {
    console.log(selectionEvent)
  }

  return {
    handleSelectionStart,
    handleSelectionDrag,
    handleSelectionContextMenu
  }
}
