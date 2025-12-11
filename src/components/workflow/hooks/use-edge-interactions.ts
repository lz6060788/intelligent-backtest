import type { EdgeMouseEvent, EdgeChange } from "@vue-flow/core"
import { useVueFlow } from "@vue-flow/core"
import { WorkflowHistoryEvent, useWorkflowHistory } from './use-workflow-history'
import { getNodesConnectedSourceOrTargetHandleIdsMap } from "../utils";
import { useNodesReadOnly } from './use-workflow'
import { useWorkflowInstance } from './use-workflow-instance'


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

  const handleEdgeDelete = () => {
    if (getNodesReadOnly())
      return

    const {
      nodes,
      edges,
    } = store
    const currentEdgeIndex = edges.value.findIndex(edge => edge.selected)

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

  return {
    handleEdgeMouseEnter,
    handleEdgeMouseLeave,
    handleEdgeChange,
    handleEdgeDeleteByDeleteBranch,
    handleEdgeDelete
  }
}
