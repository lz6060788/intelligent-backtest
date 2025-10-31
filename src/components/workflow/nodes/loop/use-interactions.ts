import { useVueFlow } from "@vue-flow/core"
import { useNodesMetaData } from "../../hooks/use-nodes-meta-data"
import { BlockEnum, type Node } from '@/types';
import { LOOP_PADDING, CUSTOM_LOOP_START_NODE } from "../_base/node/constant";
import { generateNewNode } from "../../utils/node";

export const useNodeLoopInteractions = () => {
  const store = useVueFlow();
  const { nodesMap: nodesMetaDataMap } = useNodesMetaData()

  const handleNodeLoopRerender = (nodeId: string) => {
    const {
      nodes,
    } = store
  
    const currentNode = nodes.value.find(n => n.id === nodeId)!
    const childrenNodes = nodes.value.filter(n => n.parentNode === nodeId)
    let rightNode: Node
    let bottomNode: Node

    childrenNodes.forEach((n) => {
      if (rightNode) {
        if ((n.position.x as number) + (n.width as number) > (rightNode.position.x as number) + (rightNode.width as number))
          rightNode = n
      }
      else {
        rightNode = n
      }
      if (bottomNode) {
        if ((n.position.y as number) + (n.height as number) > ((bottomNode.position.y as number) as number) + (bottomNode.height as number))
          bottomNode = n
      }
      else {
        bottomNode = n
      }
    })

    const widthShouldExtend = rightNode! && (currentNode.width as number) < (rightNode.position.x as number) + (rightNode.width as number)
    const heightShouldExtend = bottomNode! && (currentNode.height as number) < ((bottomNode.position.y as number) as number) + (bottomNode.height as number)

    if (widthShouldExtend || heightShouldExtend) {
      nodes.value.forEach((n) => {
        if (n.id === nodeId) {
          if (widthShouldExtend) {
            n.data.width = (rightNode.position.x as number) + (rightNode.width as number) + LOOP_PADDING.right
            n.width = (rightNode.position.x as number)+ (rightNode.width as number) + LOOP_PADDING.right
          }
          if (heightShouldExtend) {
            n.data.height = (bottomNode.position.y as number) + (bottomNode.height as number) + LOOP_PADDING.bottom
            n.height = (bottomNode.position.y as number) + (bottomNode.height as number) + LOOP_PADDING.bottom
          }
        }
      })
    }
  }

  const handleNodeLoopChildDrag = (node: Node) => {
    const { nodes } = store

    const restrictPosition: { x?: number; y?: number } = { x: undefined, y: undefined }

    if (node.data!.isInLoop) {
      const parentNode = nodes.value.find(n => n.id === node.parentNode)

      if (parentNode) {
        if (node.position.y < LOOP_PADDING.top)
          restrictPosition.y = LOOP_PADDING.top
        if (node.position.x < LOOP_PADDING.left)
          restrictPosition.x = LOOP_PADDING.left
        if (node.position.x + (node.width as number) > (parentNode!.width as number) - LOOP_PADDING.right)
          restrictPosition.x = (parentNode!.width as number)- LOOP_PADDING.right - (node.width as number)
        if (node.position.y + (node.height as number) > (parentNode!.width as number) - LOOP_PADDING.bottom)
          restrictPosition.y = (parentNode!.width as number) - LOOP_PADDING.bottom - (node.height as number)
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
