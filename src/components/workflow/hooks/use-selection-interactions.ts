import type { NodeDragEvent, GraphNode } from "@vue-flow/core"
import { useVueFlow } from "@vue-flow/core"
import { useWorkflowInstance } from "./use-workflow-instance"
import { produce } from "immer"

export const useSelectionInteractions = () => {
  const { instanceId } = useWorkflowInstance()
  const store = useVueFlow(instanceId)
  const { instance: workflowStore } = useWorkflowInstance()
  const handleSelectionStart = (e: MouseEvent) => {
    const {
      nodes,
      edges,
      userSelectionRect,
    } = store

    if (!userSelectionRect.value?.width || !userSelectionRect.value?.height) {
      nodes.value.forEach((node) => {
        if (node.data._isBundled)
          node.data._isBundled = false
      })
      edges.value.forEach((edge) => {
        if (edge.data._isBundled)
          edge.data._isBundled = false
      })
    }
  }

  const selectionEnd = (e: MouseEvent) => {
    const {
      nodes,
      edges,
      getSelectedNodes,
      getSelectedEdges,
    } = store

    nodes.value.forEach((node) => {
      const nodeInSelection = getSelectedNodes.value.find(n => n.id === node.id)

      if (nodeInSelection)
        node.data._isBundled = true
      else
        node.data._isBundled = false
    })
    edges.value.forEach((edge) => {
      const edgeInSelection = getSelectedEdges.value.find(e => e.id === edge.id)

      if (edgeInSelection)
        edge.data._isBundled = true
      else
        edge.data._isBundled = false
    })
  }

  const handleSelectionDrag = (e: NodeDragEvent) => {
    const {
      nodes,
    } = store

    workflowStore.setNodeAnimation(false)

    nodes.value.forEach((node) => {
      const dragNode = e.nodes.find(n => n.id === node.id)

      if (dragNode)
        node.position = dragNode.position
    })
  }

  const handleSelectionContextMenu = (e: {
    event: MouseEvent;
    nodes: GraphNode<any, any, string>[];
  }) => {
    const target = e.event.target as HTMLElement
    if (!target.classList.contains('react-flow__nodesselection-rect'))
      return

    e.event.preventDefault()
    const container = document.querySelector('#workflow-container')
    const { x, y } = container!.getBoundingClientRect()
    workflowStore.setSelectionMenu({
      top: e.event.clientY - y,
      left: e.event.clientX - x,
    })
  }

  const handleSelectionCancel = () => {
    const {
      nodes,
      edges,
      removeSelectedElements
    } = store

    removeSelectedElements()

    nodes.value.forEach((node) => {
      if (node.data._isBundled)
        node.data._isBundled = false
    })
    edges.value.forEach((edge) => {
      if (edge.data._isBundled)
        edge.data._isBundled = false
    })
  }

  return {
    handleSelectionStart,
    selectionEnd,
    handleSelectionDrag,
    handleSelectionContextMenu,
    handleSelectionCancel,
  }
}
