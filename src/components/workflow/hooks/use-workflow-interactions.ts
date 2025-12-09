import { useVueFlow } from '@vue-flow/core'
import {
  CUSTOM_NODE,
  NODE_LAYOUT_HORIZONTAL_PADDING,
  NODE_LAYOUT_VERTICAL_PADDING,
  WORKFLOW_DATA_UPDATE,
} from '../constant'
import type { WorkflowDataUpdater, GraphNode } from '@/types'
import { BlockEnum, ControlMode } from '@/types'
import {
  getLayoutByDagre,
  getLayoutForChildNodes,
  initialEdges,
  initialNodes,
} from '../utils'
import type { LayoutResult } from '../utils'
import {
  useNodesReadOnly,
  useSelectionInteractions,
  useWorkflowReadOnly,
  useWorkflowInstance
} from '../hooks'
import { useEdgesInteractionsWithoutSync } from './use-edges-interactions-without-sync'
import { useNodesInteractionsWithoutSync } from './use-nodes-interactions-without-sync'
// import { useNodesSyncDraft } from './use-nodes-sync-draft'
import { WorkflowHistoryEvent, useWorkflowHistory } from './use-workflow-history'
import { cloneDeep } from 'lodash-es'
import { computed } from 'vue'
// import { useEventEmitterContextContext } from '@/context/event-emitter'

export const useWorkflowInteractions = () => {
  const { instance: workflowStore} = useWorkflowInstance()
  const { handleNodeCancelRunningStatus } = useNodesInteractionsWithoutSync()
  const { handleEdgeCancelRunningStatus } = useEdgesInteractionsWithoutSync()

  const handleCancelDebugAndPreviewPanel = () => {
    workflowStore.setShowDebugAndPreviewPanel(false)
    workflowStore.setWorkflowRunningData(undefined)
    handleNodeCancelRunningStatus()
    handleEdgeCancelRunningStatus()
  }

  return {
    handleCancelDebugAndPreviewPanel,
  }
}

export const useWorkflowMoveMode = () => {
  const { instance: workflowStore} = useWorkflowInstance()
  const { setControlMode } = workflowStore
  const {
    getNodesReadOnly,
  } = useNodesReadOnly()
  const { handleSelectionCancel } = useSelectionInteractions()

  const handleModePointer = () => {
    if (getNodesReadOnly())
      return

    setControlMode(ControlMode.Pointer)
  }

  const handleModeHand = () => {
    if (getNodesReadOnly())
      return

    setControlMode(ControlMode.Hand)
    handleSelectionCancel()
  }

  return {
    handleModePointer,
    handleModeHand,
  }
}

export const useWorkflowOrganize = () => {
  const { instance: workflowStore} = useWorkflowInstance()
  const { instanceId } = useWorkflowInstance()
  const store = useVueFlow(instanceId)
  const { getNodesReadOnly } = useNodesReadOnly()
  const { saveStateToHistory } = useWorkflowHistory()
  // const { handleSyncWorkflowDraft } = useNodesSyncDraft()

  const handleLayout = async () => {
    if (getNodesReadOnly())
      return
    workflowStore.setNodeAnimation(true)
    const { nodes, getNodes, edges, setNodes, setViewport } = store

    const loopAndIterationNodes = nodes.value.filter(
      node => (node.data.type === BlockEnum.Loop)
              && !node.parentNode
              && node.type === CUSTOM_NODE,
    )

    const childLayoutEntries = await Promise.all(
      loopAndIterationNodes.map(async node => [
        node.id,
        await getLayoutForChildNodes(node.id, nodes.value, edges.value),
      ] as const),
    )
    const childLayoutsMap = childLayoutEntries.reduce((acc, [nodeId, layout]) => {
      if (layout)
        acc[nodeId] = layout
      return acc
    }, {} as Record<string, LayoutResult>)

    const containerSizeChanges: Record<string, { width: number, height: number }> = {}

    loopAndIterationNodes.forEach((parentNode) => {
      const childLayout = childLayoutsMap[parentNode.id]
      if (!childLayout) return

      const {
        bounds,
        nodes: layoutNodes,
      } = childLayout

      if (!layoutNodes.size)
        return

      const requiredWidth = (bounds.maxX - bounds.minX) + NODE_LAYOUT_HORIZONTAL_PADDING * 2
      const requiredHeight = (bounds.maxY - bounds.minY) + NODE_LAYOUT_VERTICAL_PADDING * 2

      containerSizeChanges[parentNode.id] = {
        width: Math.max(parentNode.dimensions.width as number || 0, requiredWidth),
        height: Math.max(parentNode.dimensions.height as number || 0, requiredHeight),
      }
    })

    const nodesWithUpdatedSizes = cloneDeep(nodes.value).map((node) => {
      if (node.data.type === BlockEnum.Loop && containerSizeChanges[node.id]) {
        node.width = containerSizeChanges[node.id]?.width || 0
        node.height = containerSizeChanges[node.id]?.height || 0

        if (node.data.type === BlockEnum.Loop) {
          node.data.width = containerSizeChanges[node.id]?.width || 0
          node.data.height = containerSizeChanges[node.id]?.height || 0
        }
      }
      return node
    })

    const layout = await getLayoutByDagre(nodesWithUpdatedSizes, edges.value)

    // Build layer map for vertical alignment - nodes in the same layer should align
    const layerMap = new Map<number, { minY: number; maxHeight: number }>()
    layout.nodes.forEach((layoutInfo) => {
      if (layoutInfo.layer !== undefined) {
        const existing = layerMap.get(layoutInfo.layer)
        const newLayerInfo = {
          minY: existing ? Math.min(existing.minY, layoutInfo.y) : layoutInfo.y,
          maxHeight: existing ? Math.max(existing.maxHeight, layoutInfo.height) : layoutInfo.height,
        }
        layerMap.set(layoutInfo.layer, newLayerInfo)
      }
    })

    const newNodes = nodesWithUpdatedSizes.map((node) => {
      if (!node.parentNode && node.type === CUSTOM_NODE) {
          const layoutInfo = layout.nodes.get(node.id)
          if (!layoutInfo)
            return node

          // Calculate vertical position with layer alignment
          let yPosition = layoutInfo.y
          if (layoutInfo.layer !== undefined) {
            const layerInfo = layerMap.get(layoutInfo.layer)
            if (layerInfo) {
              // Align to the center of the tallest node in this layer
              const layerCenterY = layerInfo.minY + layerInfo.maxHeight / 2
              yPosition = layerCenterY - layoutInfo.height / 2
            }
          }

          node.position = {
            x: layoutInfo.x,
            y: yPosition,
          }
      }

      loopAndIterationNodes.forEach((parentNode) => {
        const childLayout = childLayoutsMap[parentNode.id]
        if (!childLayout)
          return

        const childNodes = nodesWithUpdatedSizes.filter(node => node.parentNode === parentNode.id)
        const {
          bounds,
          nodes: layoutNodes,
        } = childLayout

        childNodes.forEach((childNode) => {
          const layoutInfo = layoutNodes.get(childNode.id)
          if (!layoutInfo)
            return

          childNode.position = {
            x: NODE_LAYOUT_HORIZONTAL_PADDING + (layoutInfo.x - bounds.minX),
            y: NODE_LAYOUT_VERTICAL_PADDING + (layoutInfo.y - bounds.minY),
          }
        })
      })

      return node
    })

    setNodes(newNodes)
    const zoom = 0.7
    setViewport({
      x: 0,
      y: 0,
      zoom,
    })
    saveStateToHistory(WorkflowHistoryEvent.LayoutOrganize)
    // setTimeout(() => {
    //   handleSyncWorkflowDraft()
    // })
  }

  return {
    handleLayout,
  }
}

export const useWorkflowZoom = () => {
  // const { handleSyncWorkflowDraft } = useNodesSyncDraft()
  const { getWorkflowReadOnly } = useWorkflowReadOnly()
  const { instanceId } = useWorkflowInstance()
  const {
    zoomIn,
    zoomOut,
    zoomTo,
    fitView,
  } = useVueFlow(instanceId)

  const handleFitView = () => {
    if (getWorkflowReadOnly())
      return

    fitView()
    // handleSyncWorkflowDraft()
  }

  const handleBackToOriginalSize = () => {
    if (getWorkflowReadOnly())
      return

    zoomTo(1)
    // handleSyncWorkflowDraft()
  }

  const handleSizeToHalf = () => {
    if (getWorkflowReadOnly())
      return

    zoomTo(0.5)
    // handleSyncWorkflowDraft()
  }

  const handleZoomOut = () => {
    if (getWorkflowReadOnly())
      return

    zoomOut()
    // handleSyncWorkflowDraft()
  }

  const handleZoomIn = () => {
    if (getWorkflowReadOnly())
      return

    zoomIn()
    // handleSyncWorkflowDraft()
  }

  return {
    handleFitView,
    handleBackToOriginalSize,
    handleSizeToHalf,
    handleZoomOut,
    handleZoomIn,
  }
}

export const useWorkflowUpdate = () => {
  const { instanceId } = useWorkflowInstance()
  const store = useVueFlow(instanceId)
  // const { eventEmitter } = useEventEmitterContextContext()

  const handleUpdateWorkflowCanvas = (payload: WorkflowDataUpdater) => {
    const {
      nodes,
      edges,
      viewport,
    } = payload
    const { setViewport, setNodes, setEdges } = store
    setNodes(nodes)
    setEdges(edges)
    setViewport(viewport)
  }

  return {
    handleUpdateWorkflowCanvas,
  }
}

export const useWorkflowCanvasMaximize = () => {
  const { instance: workflowStore } = useWorkflowInstance()
  // const { eventEmitter } = useEventEmitterContextContext()

  const maximizeCanvas = computed(() => workflowStore.maximizeCanvas)
  const { setMaximizeCanvas } = workflowStore
  const {
    getNodesReadOnly,
  } = useNodesReadOnly()

  const handleToggleMaximizeCanvas = () => {
    if (getNodesReadOnly())
      return

    setMaximizeCanvas(!maximizeCanvas)
    localStorage.setItem('workflow-canvas-maximize', String(!maximizeCanvas))
    // eventEmitter?.emit({
    //   type: 'workflow-canvas-maximize',
    //   payload: !maximizeCanvas,
    // } as any)
  }

  return {
    handleToggleMaximizeCanvas,
  }
}
