import { produce } from 'immer'
import { useVueFlow } from '@vue-flow/core'
// import { useNodesSyncDraft } from './use-nodes-sync-draft'
// import { useNodesReadOnly } from './use-workflow'

type NodeDataUpdatePayload = {
  id: string
  data: Record<string, any>
}

export const useNodeDataUpdate = () => {
//   const { handleSyncWorkflowDraft } = useNodesSyncDraft()
//   const { getNodesReadOnly } = useNodesReadOnly()

  const handleNodeDataUpdate = ({ id, data }: NodeDataUpdatePayload) => {
    const { nodes } = useVueFlow()
    const node = nodes.value.find(node => node.id === id)
    if (node) {
      node.data = { ...node.data, ...data }
    }
  }

  const handleNodeDataUpdateWithSyncDraft = (payload: NodeDataUpdatePayload) => {
    // if (getNodesReadOnly()) {
    //   return
    // }
    handleNodeDataUpdate(payload)
    // handleSyncWorkflowDraft()
  }

  return {
    handleNodeDataUpdate,
    handleNodeDataUpdateWithSyncDraft,
  }
}