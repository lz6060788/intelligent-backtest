import { BlockEnum } from '@/types'
import { useNodesReadOnly } from './use-workflow'
import { useWorkflowRefreshDraft, useWorkflowInstance } from '.'
import { useVueFlow } from '@vue-flow/core'
import { transformGraphNodesToNodes } from '../utils/node'
import { transformGraphEdgesToEdges } from '../utils/egde'
import { unref } from 'vue'
import { cloneDeep } from 'lodash-es'

export const useNodesSyncDraft = (id?: string) => {
  const { instance: workflowStore, instanceId } = useWorkflowInstance(id)
  const store = useVueFlow(instanceId)
  const { getNodesReadOnly } = useNodesReadOnly()
  const { handleRefreshWorkflowDraft } = useWorkflowRefreshDraft()

  const getPostParams = () => {
    const {
      nodes,
      edges,
      viewport,
    } = store
    const { x, y, zoom } = viewport.value

    // const appId = workflowStore.

    if (!!nodes.value.length) {
      const hasStartNode = nodes.value.find(node => node.data.type === BlockEnum.Start)

      if (!hasStartNode)
        return

      const producedNodes = cloneDeep(unref(nodes)).map((node) => {
        Object.keys(node.data).forEach((key) => {
          if (key.startsWith('_'))
            delete node.data[key]
        })
        return node
      })
      const producedEdges = cloneDeep(unref(edges).filter(edge => !edge.data?._isTemp)).map((edge) => {
        Object.keys(edge.data).forEach((key) => {
          if (key.startsWith('_'))
            delete edge.data[key]
        })
        return edge
      })
      return {
        url: `/apps/workflows/draft`,
        params: {
          graph: {
            nodes: transformGraphNodesToNodes(producedNodes),
            edges: transformGraphEdgesToEdges(producedEdges),
            viewport: {
              x,
              y,
              zoom,
            },
          },
        },
      }
    }
  }

  const syncWorkflowDraftWhenPageClose = () => {
    if (getNodesReadOnly())
      return
    const postParams = getPostParams()

    if (postParams) {
      navigator.sendBeacon(
        `/apps/workflows/draft`,
        JSON.stringify(postParams.params),
      )
    }
  }

  const doSyncWorkflowDraft = async (
    notRefreshWhenSyncError?: boolean,
    callback?: {
      onSuccess?: () => void
      onError?: () => void
      onSettled?: () => void
    },
  ) => {
    if (getNodesReadOnly())
      return
    const postParams = getPostParams()

    if (postParams) {
      // const {
      //   setSyncWorkflowDraftHash,
      //   setDraftUpdatedAt,
      // } = workflowStore
      try {
        // const res = await syncWorkflowDraft(postParams)
        console.log(postParams)
        localStorage.setItem('workflow_draft', JSON.stringify(postParams.params.graph))
        // setSyncWorkflowDraftHash(res.hash)
        // setDraftUpdatedAt(res.updated_at)
        callback?.onSuccess?.()
      }
      catch (error: any) {
        if (error && error.json && !error.bodyUsed) {
          error.json().then((err: any) => {
            if (err.code === 'draft_workflow_not_sync' && !notRefreshWhenSyncError)
              handleRefreshWorkflowDraft()
          })
        }
        callback?.onError?.()
      }
      finally {
        callback?.onSettled?.()
      }
    }
  }

  return {
    doSyncWorkflowDraft,
    syncWorkflowDraftWhenPageClose,
  }
}
