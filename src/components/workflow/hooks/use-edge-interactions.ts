import type { EdgeMouseEvent, EdgeChange, Connection } from "@vue-flow/core"
import { useVueFlow } from "@vue-flow/core"
import { WorkflowHistoryEvent, useWorkflowHistory } from './use-workflow-history'
import { getNodesConnectedSourceOrTargetHandleIdsMap } from "../utils";
import { useNodesReadOnly } from './use-workflow'
import { useWorkflowInstance } from './use-workflow-instance'
import { BlockEnum, type Edge } from "@/types";
import { CUSTOM_EDGE, LOOP_CHILDREN_Z_INDEX } from "../constant";


export const useEdgeInteractions = (id?: string) => {
  const { instanceId } = useWorkflowInstance(id)
  const store = useVueFlow(instanceId);
  const { saveStateToHistory } = useWorkflowHistory(instanceId)
  const { getNodesReadOnly } = useNodesReadOnly(instanceId)

  const handleEdgeMouseEnter = (e: EdgeMouseEvent) => {
    if (getNodesReadOnly())
      return
    const { edges } = store

    const currentEdge = edges.value.find(edge => edge.id === e.edge.id)!

    currentEdge.data._hovering = true
  }

  const handleEdgeMouseLeave = (e: EdgeMouseEvent) => {
    if (getNodesReadOnly())
      return
    const { edges } = store

    const currentEdge = edges.value.find(edge => edge.id === e.edge.id)!

    currentEdge.data._hovering = false
  }

  const handleEdgeChange = (changes: EdgeChange[]) => {
    if (getNodesReadOnly())
      return
    const { edges } = store

    changes.forEach((change) => {
      if (change.type === 'select')
        edges.value.find(edge => edge.id === change.id)!.selected = change.selected
    })
  }

  const handleEdgeDeleteByDeleteBranch = (nodeId: string, branchId: string) => {
    if (getNodesReadOnly())
      return

    const {
      nodes,
      setNodes,
      edges,
      setEdges,
    } = store
    const edgeWillBeDeleted = edges.value.filter(edge => edge.source === nodeId && edge.sourceHandle === branchId)

    if (!edgeWillBeDeleted.length)
      return

    const nodesConnectedSourceOrTargetHandleIdsMap = getNodesConnectedSourceOrTargetHandleIdsMap(
      edgeWillBeDeleted.map(edge => ({ type: 'remove', edge })),
      nodes.value,
    )
    nodes.value.forEach((node) => {
      if (nodesConnectedSourceOrTargetHandleIdsMap[node.id]) {
        node.data = {
          ...node.data,
          ...nodesConnectedSourceOrTargetHandleIdsMap[node.id],
        }
      }
    })
    const newEdges = edges.value.filter(edge => !edgeWillBeDeleted.find(e => e.id === edge.id))
    setEdges(newEdges)
    // handleSyncWorkflowDraft()
    saveStateToHistory(WorkflowHistoryEvent.EdgeDeleteByDeleteBranch)
  }

  const handleEdgeDelete = (edgeId?: string) => {
    if (getNodesReadOnly())
      return

    const {
      nodes,
      edges,
    } = store
    const currentEdgeIndex = edgeId ? edges.value.findIndex(edge => edge.id === edgeId) : edges.value.findIndex(edge => edge.selected)

    if (currentEdgeIndex < 0)
      return
    const currentEdge = edges.value[currentEdgeIndex]!
    const nodesConnectedSourceOrTargetHandleIdsMap = getNodesConnectedSourceOrTargetHandleIdsMap(
      [
        { type: 'remove', edge: currentEdge },
      ],
      nodes.value,
    )
    nodes.value.forEach((node) => {
      if (nodesConnectedSourceOrTargetHandleIdsMap[node.id]) {
        node.data = {
          ...node.data,
          ...nodesConnectedSourceOrTargetHandleIdsMap[node.id],
        }
      }
    })
    edges.value.splice(currentEdgeIndex, 1)
    // handleSyncWorkflowDraft()
    saveStateToHistory(WorkflowHistoryEvent.EdgeDelete)
  }

  const replaceEdges = (edges: Connection[]) => {
    const { edges: currentEdges, nodes, setEdges } = store

    const newEdges = [] as Edge[]
    edges.forEach((edge) => {
      const { source, sourceHandle = 'source', target, targetHandle = 'target' } = edge
      const targetNode = nodes.value.find(node => node.id === target!)
      const sourceNode = nodes.value.find(node => node.id === source!)

      if (targetNode?.parentNode !== sourceNode?.parentNode) return

      if (
        newEdges.find(
          edge =>
            edge.source === source
            && edge.sourceHandle === sourceHandle
            && edge.target === target
            && edge.targetHandle === targetHandle,
        )
      )
        return

      const parendNode = nodes.value.find(node => node.id === targetNode?.parentNode)
      // const isInIteration
      //   = parendNode && parendNode.data.type === BlockEnum.Iteration
      const isInLoop = !!parendNode && parendNode.data.type === BlockEnum.Loop

      const newEdge = {
        id: `${source}-${sourceHandle}-${target}-${targetHandle}`,
        type: CUSTOM_EDGE,
        source: source!,
        target: target!,
        sourceHandle,
        targetHandle,
        data: {
          sourceType: nodes.value.find(node => node.id === source)!.data.type,
          targetType: nodes.value.find(node => node.id === target)!.data.type,
          // isInIteration,
          // iteration_id: isInIteration ? targetNode?.parentNode : undefined,
          isInLoop,
          loop_id: isInLoop ? targetNode?.parentNode : undefined,
        },
        zIndex: targetNode?.parentNode
          ? LOOP_CHILDREN_Z_INDEX
          : 0,
      }
      newEdges.push(newEdge)
    })

    const nodesConnectedSourceOrTargetHandleIdsMap = getNodesConnectedSourceOrTargetHandleIdsMap(
      [...currentEdges.value.map(edge => ({ type: 'remove', edge })), ...newEdges.map(edge => ({ type: 'add', edge }))],
      nodes.value,
    )
    nodes.value.forEach((node) => {
      if (nodesConnectedSourceOrTargetHandleIdsMap[node.id]) {
        node.data = {
          ...node.data,
          ...nodesConnectedSourceOrTargetHandleIdsMap[node.id],
        }
      }
    })

    setEdges(newEdges)
    saveStateToHistory(WorkflowHistoryEvent.EdgeReplace)
  }

  return {
    handleEdgeMouseEnter,
    handleEdgeMouseLeave,
    handleEdgeChange,
    handleEdgeDeleteByDeleteBranch,
    handleEdgeDelete,
    replaceEdges,
  }
}
