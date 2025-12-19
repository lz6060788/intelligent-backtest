import { BlockEnum, type Edge, type Node } from '@/types'
import { CUSTOM_NODE, ITERATION_NODE_Z_INDEX, LOOP_NODE_Z_INDEX, CUSTOM_LOOP_START_NODE, LOOP_CHILDREN_Z_INDEX } from '../nodes/_base/node/constant'
import { Position, type GraphNode } from '@vue-flow/core'
import type { LoopNodeType } from '../nodes/loop/type'
import { v4 as uuid4 } from 'uuid'


export function generateNewNode({ data, position, id, zIndex, type, ...rest }: Omit<Node, 'id'> & { id?: string }): {
  newNode: Node
  newIterationStartNode?: Node
  newLoopStartNode?: Node
} {
  const newNode = {
    id: id || `${uuid4()}`,
    type: type || CUSTOM_NODE,
    data,
    position,
    targetPosition: Position.Left,
    sourcePosition: Position.Right,
    // zIndex: data.type === BlockEnum.Iteration ? ITERATION_NODE_Z_INDEX : (data.type === BlockEnum.Loop ? LOOP_NODE_Z_INDEX : zIndex),
    zIndex: data!.type === BlockEnum.Loop ? LOOP_NODE_Z_INDEX : zIndex,
    ...rest,
  } as Node

  // if (data!.type === BlockEnum.Iteration) {
  //   const newIterationStartNode = getIterationStartNode(newNode.id);
  //   (newNode.data as IterationNodeType).start_node_id = newIterationStartNode.id;
  //   (newNode.data as IterationNodeType)._children = [{ nodeId: newIterationStartNode.id, nodeType: BlockEnum.IterationStart }]
  //   return {
  //     newNode,
  //     newIterationStartNode,
  //   }
  // }

  if (data!.type === BlockEnum.Loop) {
    const newLoopStartNode = getLoopStartNode(newNode.id);
    (newNode.data as LoopNodeType).start_node_id = newLoopStartNode.id;
    (newNode.data as LoopNodeType)._children = [{ nodeId: newLoopStartNode.id, nodeType: BlockEnum.LoopStart }]
    return {
      newNode,
      newLoopStartNode,
    }
  }

  return {
    newNode,
  }
}

export const getTopLeftNodePosition = (nodes: Node[]) => {
  let minX = Infinity
  let minY = Infinity

  nodes.forEach((node) => {
    if (node.position.x < minX)
      minX = node.position.x

    if (node.position.y < minY)
      minY = node.position.y
  })

  return {
    x: minX,
    y: minY,
  }
}

export const getBottomRightNodePosition = (nodes: GraphNode[]) => {
  let maxX = -Infinity
  let maxY = -Infinity

  nodes.forEach((node) => {
    if (node.position.x + (node.width as number || node.dimensions.width as number || 0) > maxX)
      maxX = node.position.x + (node.width as number || node.dimensions.width as number || 0)

    if (node.position.y + (node.height as number || node.dimensions.height as number || 0) > maxY)
      maxY = node.position.y + (node.height as number || node.dimensions.height as number || 0)
  })

  return {
    x: maxX,
    y: maxY,
  }
}

export function getLoopStartNode(loopId: string): Node {
  return generateNewNode({
    id: `${loopId}start`,
    type: CUSTOM_LOOP_START_NODE,
    data: {
      title: '',
      desc: '',
      type: BlockEnum.LoopStart,
      isInLoop: true,
    },
    position: {
      x: 24,
      y: 68,
    },
    zIndex: LOOP_CHILDREN_Z_INDEX,
    parentNode: loopId,
    selectable: false,
    draggable: false,
  }).newNode
}

export const genNewNodeTitleFromOld = (oldTitle: string) => {
  const regex = /^(.+?)\s*\((\d+)\)\s*$/
  const match = oldTitle.match(regex)

  if (match && match[2]) {
    const title = match[1]
    const num = Number.parseInt(match[2], 10)
    return `${title} (${num + 1})`
  }
  else {
    return `${oldTitle} (1)`
  }
}

export const getNestedNodePosition = (node: Node, parentNode: Node) => {
  return {
    x: node.position.x - parentNode.position.x,
    y: node.position.y - parentNode.position.y,
  }
}

export const getNodeCustomTypeByNodeDataType = (nodeType: BlockEnum) => {
  if (nodeType === BlockEnum.LoopEnd)
    return 'custom-simple'
}

export const transformGraphNodesToNodes = (nodes: GraphNode[]): Node[] => {
  return nodes.map((node) => {
    return {
      id: node.id,
      type: node.type,
      data: node.data,
      position: node.position,
      targetPosition: node.targetPosition,
      sourcePosition: node.sourcePosition,
      zIndex: node.zIndex,
      parentNode: node.parentNode,
      width: node.dimensions.width,
      height: node.dimensions.height,
    }
  })
}
