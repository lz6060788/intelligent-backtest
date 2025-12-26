import { useVueFlow } from '@vue-flow/core'
import { useNodesMetaData } from '../../hooks/use-nodes-meta-data'
import { BlockEnum, type ChildNodeTypeCount, type GraphNode } from '@/types'
import { ITERATION_PADDING } from '../_base/node/constant'
import { generateNewNode } from '../../utils/node'
import { getNodeCustomTypeByNodeDataType } from '../../utils/node'
import { useWorkflowInstance } from '../../hooks/use-workflow-instance'
import { CUSTOM_ITERATION_START_NODE } from '../iteration-start/constants'
import i18n from '@/locales'

/**
 * 节点迭代交互的composable
 */
export const useNodeIterationInteractions = (id?: string) => {
  const t = i18n.global.t;
  const { instanceId } = useWorkflowInstance(id)
  const store = useVueFlow(instanceId)
  const { nodesMap: nodesMetaDataMap } = useNodesMetaData(instanceId)

  const handleNodeIterationRerender = (nodeId: string) => {
    const { nodes } = store

    const currentNode = nodes.value.find(n => n.id === nodeId)!
    const childrenNodes = nodes.value.filter(n => n.parentNode === nodeId)
    let rightNode: GraphNode
    let bottomNode: GraphNode

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
            n.data.width = (rightNode.position.x as number) + (rightNode.dimensions.width as number) + ITERATION_PADDING.right
            n.width = (rightNode.position.x as number) + (rightNode.dimensions.width as number) + ITERATION_PADDING.right
          }
          if (heightShouldExtend) {
            n.data.height = (bottomNode.position.y as number) + (bottomNode.dimensions.height as number) + ITERATION_PADDING.bottom
            n.height = (bottomNode.position.y as number) + (bottomNode.dimensions.height as number) + ITERATION_PADDING.bottom
          }
        }
      })
    }
  }

  const handleNodeIterationChildDrag = (node: GraphNode) => {
    const { nodes } = store

    const restrictPosition: { x?: number; y?: number } = { x: undefined, y: undefined }

    if (node.data!.isInIteration) {
      const parentNode = nodes.value.find(n => n.id === node.parentNode)

      if (parentNode) {
        if (node.position.y < ITERATION_PADDING.top)
          restrictPosition.y = ITERATION_PADDING.top
        if (node.position.x < ITERATION_PADDING.left)
          restrictPosition.x = ITERATION_PADDING.left
        if (node.position.x + (node.dimensions.width as number) > (parentNode!.dimensions.width as number) - ITERATION_PADDING.right)
          restrictPosition.x = (parentNode!.dimensions.width as number) - ITERATION_PADDING.right - (node.dimensions.width as number)
        if (node.position.y + (node.dimensions.height as number) > (parentNode!.dimensions.height as number) - ITERATION_PADDING.bottom)
          restrictPosition.y = (parentNode!.dimensions.height as number) - ITERATION_PADDING.bottom - (node.dimensions.height as number)
      }
    }

    return {
      restrictPosition,
    }
  }

  const handleNodeIterationChildSizeChange = (nodeId: string) => {
    const { nodes } = store
    const currentNode = nodes.value.find(n => n.id === nodeId)!
    const parentId = currentNode.parentNode

    if (parentId)
      handleNodeIterationRerender(parentId)
  }

  const handleNodeIterationChildrenCopy = (nodeId: string, newNodeId: string, idMapping: Record<string, string>) => {
    const { nodes } = store
    const childrenNodes = nodes.value.filter(n => n.parentNode === nodeId && n.type !== CUSTOM_ITERATION_START_NODE)
    const newIdMapping = { ...idMapping }
    const childNodeTypeCount: ChildNodeTypeCount = {}

    const copyChildren = childrenNodes.map((child, index) => {
      const childNodeType = child.data.type as BlockEnum
      const nodesWithSameType = nodes.value.filter(node => node.data.type === childNodeType)

      if (!childNodeTypeCount[childNodeType])
        childNodeTypeCount[childNodeType] = nodesWithSameType.length + 1
      else
        childNodeTypeCount[childNodeType] = childNodeTypeCount[childNodeType] + 1

      const { newNode } = generateNewNode({
        type: getNodeCustomTypeByNodeDataType(childNodeType),
        data: {
          ...nodesMetaDataMap![childNodeType].defaultValue,
          ...child.data,
          selected: false,
          _isBundled: false,
          _connectedSourceHandleIds: [],
          _connectedTargetHandleIds: [],
          title: nodesWithSameType.length > 0 ? `${t(`workflow.blocks.${childNodeType}`)} ${childNodeTypeCount[childNodeType]}` : t(`workflow.blocks.${childNodeType}`),
          iteration_id: newNodeId,
          type: childNodeType,
        },
        position: child.position,
        // positionAbsolute: child.positionAbsolute,
        parentNode: newNodeId,
        extent: child.extent,
        zIndex: child.zIndex,
      })
      newNode.id = `${newNodeId}${newNode.id + index}`
      newIdMapping[child.id] = newNode.id
      return newNode
    })

    return {
      copyChildren,
      newIdMapping,
    }
  }

  return {
    handleNodeIterationRerender,
    handleNodeIterationChildDrag,
    handleNodeIterationChildSizeChange,
    handleNodeIterationChildrenCopy,
  }
}
