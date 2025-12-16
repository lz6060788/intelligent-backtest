import { useVueFlow } from "@vue-flow/core"
import { useNodesMetaData } from "../../hooks/use-nodes-meta-data"
import { BlockEnum, type GraphNode, type Node } from '@/types';
import { LOOP_PADDING, CUSTOM_LOOP_START_NODE, LOOP_MIN_WIDTH, LOOP_MIN_HEIGHT } from "../_base/node/constant";
import { generateNewNode } from "../../utils/node";
import { useWorkflowInstance } from "../../hooks/use-workflow-instance";

export const useNodeLoopInteractions = (id?: string) => {
  const { instanceId } = useWorkflowInstance(id)
  const store = useVueFlow(instanceId)
  const { nodesMap: nodesMetaDataMap } = useNodesMetaData(instanceId)

  const handleNodeLoopRerender = (nodeId: string) => {
    const {
      nodes,
    } = store

    const currentNode = nodes.value.find(n => n.id === nodeId)!
    const childrenNodes = nodes.value.filter(n => n.parentNode === nodeId)
    let rightNode: GraphNode
    let bottomNode: GraphNode

    console.log('childrenNodes', childrenNodes)
    childrenNodes.forEach((n) => {
      if (rightNode) {
        if ((n.position.x as number) + (n.dimensions.width as number) > (rightNode.position.x as number) + (rightNode.dimensions.width as number))
          rightNode = n
      }
      else {
        rightNode = n
      }
      if (bottomNode) {
        if ((n.position.y as number) + (n.dimensions.height as number) > ((bottomNode.position.y as number) as number) + (bottomNode.dimensions.height as number))
          bottomNode = n
      }
      else {
        bottomNode = n
      }
    })

    const widthShouldExtend = rightNode! && (currentNode.dimensions.width as number) < (rightNode.position.x as number) + (rightNode.dimensions.width as number)
    const heightShouldExtend = bottomNode! && (currentNode.dimensions.height as number) < ((bottomNode.position.y as number) as number) + (bottomNode.dimensions.height as number)


    if (widthShouldExtend || heightShouldExtend) {
      nodes.value.forEach((n) => {
        if (n.id === nodeId) {
          if (widthShouldExtend) {
            const width = Math.max(LOOP_MIN_WIDTH, (rightNode.position.x as number) + (rightNode.dimensions.width as number) + LOOP_PADDING.right)
            n.data.width = width
            n.width = width
          }
          if (heightShouldExtend) {
            const height = Math.max(LOOP_MIN_HEIGHT, (bottomNode.position.y as number) + (bottomNode.dimensions.height as number) + LOOP_PADDING.bottom)
            n.data.height = height
            n.height = height
          }
        }
      })
    }
  }

  const handleNodeLoopChildDrag = (node: GraphNode) => {
    const { nodes } = store

    const restrictPosition: { x?: number; y?: number } = { x: undefined, y: undefined }

    if (node.data!.isInLoop) {
      const parentNode = nodes.value.find(n => n.id === node.parentNode)

      if (parentNode) {
        if (node.position.y < LOOP_PADDING.top)
          restrictPosition.y = LOOP_PADDING.top
        if (node.position.x < LOOP_PADDING.left)
          restrictPosition.x = LOOP_PADDING.left
        if (node.position.x + (node.dimensions.width as number) > (parentNode!.dimensions.width as number) - LOOP_PADDING.right)
          restrictPosition.x = (parentNode!.dimensions.width as number)- LOOP_PADDING.right - (node.dimensions.width as number)
        if (node.position.y + (node.dimensions.height as number) > (parentNode!.dimensions.height as number) - LOOP_PADDING.bottom)
          restrictPosition.y = (parentNode!.dimensions.height as number) - LOOP_PADDING.bottom - (node.dimensions.height as number)
      }
    }

    return {
      restrictPosition,
    }
  }

  const handleNodeLoopChildSizeChange = (nodeId: string) => {
    const { nodes } = store
    const currentNode = nodes.value.find(n => n.id === nodeId)!
    const parentId = currentNode.parentNode

    if (parentId)
      handleNodeLoopRerender(parentId)
  }

  const handleNodeLoopChildrenCopy = (nodeId: string, newNodeId: string) => {
    const { nodes } = store
    const childrenNodes = nodes.value.filter(n => n.parentNode === nodeId && n.type !== CUSTOM_LOOP_START_NODE)

    return childrenNodes.map((child, index) => {
      const childNodeType = child.data.type as BlockEnum
      const {
        defaultValue,
      } = nodesMetaDataMap![childNodeType]
      const nodesWithSameType = nodes.value.filter(node => node.data.type === childNodeType)
      const { newNode } = generateNewNode({
        type: undefined,
        data: {
          ...defaultValue,
          ...child.data,
          selected: false,
          _isBundled: false,
          _connectedSourceHandleIds: [],
          _connectedTargetHandleIds: [],
          title: nodesWithSameType.length > 0 ? `${defaultValue.title} ${nodesWithSameType.length + 1}` : defaultValue.title,
          loop_id: newNodeId,

        },
        position: child.position,
        // positionAbsolute: child.positionAbsolute,
        parentNode: newNodeId,
        extent: child.extent,
        zIndex: child.zIndex,
      })
      newNode.id = `${newNodeId}${newNode.id + index}`
      return newNode
    })
  }

  return {
    handleNodeLoopRerender,
    handleNodeLoopChildDrag,
    handleNodeLoopChildSizeChange,
    handleNodeLoopChildrenCopy,
  }
}
