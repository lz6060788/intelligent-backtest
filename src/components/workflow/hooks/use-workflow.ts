import { getIncomers, getOutgoers, useVueFlow, type Connection } from "@vue-flow/core"
import { useAvailableBlocks, useNodesMetaData } from "./index"
import { CUSTOM_LOOP_START_NODE, SUPPORT_OUTPUT_VARS_NODE } from "../nodes/_base/node/constant"
import { type Node, type Edge, type ValueSelector, type BlockEnum, WorkflowRunningStatus } from "@/types"
import { uniqBy } from "lodash-es"
import type { LoopNodeType } from "../nodes/loop/type"
import { useWorkflowInstance } from '../hooks/use-workflow-instance'
import { storeToRefs } from "pinia"
import { computed } from "vue"

export const useWorkflow = () => {
  const { instanceId } = useWorkflowInstance()
  const store = useVueFlow(instanceId)
  const { getAvailableBlocks } = useAvailableBlocks()
  const { nodesMap } = useNodesMetaData()

  const getNodeById =(nodeId: string) => {
    const {
      nodes,
    } = store
    const currentNode = nodes.value.find(node => node.id === nodeId)
    return currentNode
  }

  const getTreeLeafNodes = (nodeId: string) => {
    const {
      nodes,
      edges,
    } = store
    const currentNode = nodes.value.find(node => node.id === nodeId)

    let startNodes = nodes.value.filter(node => nodesMap?.[node.data.type as BlockEnum]?.metaData.isStart) || []

    if (currentNode?.parentNode) {
      const startNode = nodes.value.find(node => node.parentNode === currentNode.parentNode && (node.type === CUSTOM_LOOP_START_NODE))
      if (startNode)
        startNodes = [startNode]
    }

    if (!startNodes.length)
      return []

    const list: Node[] = []
    const preOrder = (root: Node, callback: (node: Node) => void) => {
      if (root.id === nodeId)
        return
      const outgoers = getOutgoers(root, nodes.value, edges.value)

      if (outgoers.length) {
        outgoers.forEach((outgoer) => {
          preOrder(outgoer, callback)
        })
      }
      else {
        if (root.id !== nodeId)
          callback(root)
      }
    }
    startNodes.forEach((startNode) => {
      preOrder(startNode, (node) => {
        list.push(node)
      })
    })

    const incomers = getIncomers({ id: nodeId } as Node, nodes.value, edges.value)

    list.push(...incomers)

    return uniqBy(list, 'id').filter((item: Node) => {
      return SUPPORT_OUTPUT_VARS_NODE.includes(item.data!.type)
    })
  }

  const getBeforeNodesInSameBranch = (nodeId: string, newNodes?: Node[], newEdges?: Edge[]) => {
    const {
      nodes: storeNodes,
      edges,
    } = store
    const nodes = newNodes || storeNodes.value
    const currentNode = nodes.find(node => node.id === nodeId)

    const list: Node[] = []

    if (!currentNode)
      return list

    if (currentNode.parentNode) {
      const parentNode = nodes.find(node => node.id === currentNode.parentNode)
      if (parentNode) {
        const parentList = getBeforeNodesInSameBranch(parentNode.id)

        list.push(...parentList)
      }
    }

    const traverse = (root: Node, callback: (node: Node) => void) => {
      if (root) {
        const incomers = getIncomers(root, nodes, newEdges || edges.value)

        if (incomers.length) {
          incomers.forEach((node) => {
            if (!list.find(n => node.id === n.id)) {
              callback(node)
              traverse(node, callback)
            }
          })
        }
      }
    }
    traverse(currentNode, (node) => {
      list.push(node)
    })

    const length = list.length
    if (length) {
      return uniqBy(list, 'id').reverse().filter((item: Node) => {
        return SUPPORT_OUTPUT_VARS_NODE.includes(item.data!.type)
      })
    }

    return []
  }

  const getBeforeNodesInSameBranchIncludeParent = (nodeId: string, newNodes?: Node[], newEdges?: Edge[]) => {
    const nodes = getBeforeNodesInSameBranch(nodeId, newNodes, newEdges)
    const {
      nodes: allNodes,
    } = store
    const node = allNodes.value.find(n => n.id === nodeId)
    const parentNodeId = node?.parentNode
    const parentNode = allNodes.value.find(n => n.id === parentNodeId)
    if (parentNode)
      nodes.push(parentNode)

    return nodes
  }

  const getAfterNodesInSameBranch = (nodeId: string) => {
    const {
      nodes,
      edges,
    } = store
    const currentNode = nodes.value.find(node => node.id === nodeId)!

    if (!currentNode)
      return []
    const list: Node[] = [currentNode]

    const traverse = (root: Node, callback: (node: Node) => void) => {
      if (root) {
        const outgoers = getOutgoers(root, nodes.value, edges.value)

        if (outgoers.length) {
          outgoers.forEach((node) => {
            callback(node)
            traverse(node, callback)
          })
        }
      }
    }
    traverse(currentNode, (node) => {
      list.push(node)
    })

    return uniqBy(list, 'id')
  }

  const getBeforeNodeById = (nodeId: string) => {
    const {
      nodes,
      edges,
    } = store
    const node = nodes.value.find(node => node.id === nodeId)!

    return getIncomers(node, nodes.value, edges.value)
  }

  const getIterationNodeChildren = (nodeId: string) => {
    const {
      nodes,
    } = store

    return nodes.value.filter(node => node.parentNode === nodeId)
  }

  const getLoopNodeChildren = (nodeId: string) => {
    const {
      nodes,
    } = store

    return nodes.value.filter(node => node.parentNode === nodeId)
  }

  // 暂不考虑输出变量名修改
  // const handleOutVarRenameChange = (nodeId: string, oldValeSelector: ValueSelector, newVarSelector: ValueSelector) => {
  //   const { getNodes, setNodes } = store.getState()
  //   const allNodes = getNodes()
  //   const affectedNodes = findUsedVarNodes(oldValeSelector, allNodes)
  //   if (affectedNodes.length > 0) {
  //     const newNodes = allNodes.map((node) => {
  //       if (affectedNodes.find(n => n.id === node.id))
  //         return updateNodeVars(node, oldValeSelector, newVarSelector)

  //       return node
  //     })
  //     setNodes(newNodes)
  //   }
  // }

  const isVarUsedInNodes = (varSelector: ValueSelector) => {
    // const nodeId = varSelector[0]
    // const afterNodes = getAfterNodesInSameBranch(nodeId)
    // const effectNodes = findUsedVarNodes(varSelector, afterNodes)
    // return effectNodes.length > 0
  }

  const removeUsedVarInNodes = (varSelector: ValueSelector) => {
    // const nodeId = varSelector[0]
    // const { getNodes, setNodes } = store.getState()
    // const afterNodes = getAfterNodesInSameBranch(nodeId)
    // const effectNodes = findUsedVarNodes(varSelector, afterNodes)
    // if (effectNodes.length > 0) {
    //   const newNodes = getNodes().map((node) => {
    //     if (effectNodes.find(n => n.id === node.id))
    //       return updateNodeVars(node, varSelector, [])

    //     return node
    //   })
    //   setNodes(newNodes)
    // }
  }

  const isNodeVarsUsedInNodes = (node: Node, isChatMode: boolean) => {
    // const outputVars = getNodeOutputVars(node, isChatMode)
    // const isUsed = outputVars.some((varSelector) => {
    //   return isVarUsedInNodes(varSelector)
    // })
    // return isUsed
  }

  const getRootNodesById = (nodeId: string) => {
    const {
      nodes,
      edges,
    } = store
    const currentNode = nodes.value.find(node => node.id === nodeId)

    const rootNodes: Node[] = []

    if (!currentNode)
      return rootNodes

    if (currentNode.parentNode) {
      const parentNode = nodes.value.find(node => node.id === currentNode.parentNode)
      if (parentNode) {
        const parentList = getRootNodesById(parentNode.id)

        rootNodes.push(...parentList)
      }
    }

    const traverse = (root: Node, callback: (node: Node) => void) => {
      if (root) {
        const incomers = getIncomers(root, nodes.value, edges.value)

        if (incomers.length) {
          incomers.forEach((node) => {
            traverse(node, callback)
          })
        }
        else {
          callback(root)
        }
      }
    }
    traverse(currentNode, (node) => {
      rootNodes.push(node)
    })

    const length = rootNodes.length
    if (length)
      return uniqBy(rootNodes, 'id')

    return []
  }

  const getStartNodes = (nodes: Node[], currentNode?: Node) => {
    const { id, parentNode: parentNodeId } = currentNode || {}
    let startNodes: Node[] = []

    if (parentNodeId) {
      const parentNode = nodes.find(node => node.id === parentNodeId)
      if (!parentNode)
        throw new Error('Parent node not found')

      const startNode = nodes.find(node => node.id === (parentNode.data as (LoopNodeType)).start_node_id)
      if (startNode)
        startNodes = [startNode]
    }
    else {
      startNodes = nodes.filter(node => nodesMap?.[node.data!.type as BlockEnum]?.metaData.isStart) || []
    }

    if (!startNodes.length)
      startNodes = getRootNodesById(id || '')

    return startNodes
  }

  const isValidConnection = ({ source, sourceHandle: _sourceHandle, target }: Connection) => {
    const {
      edges,
      nodes,
    } = store
    const sourceNode: Node = nodes.value.find(node => node.id === source)!
    const targetNode: Node = nodes.value.find(node => node.id === target)!

    // if (sourceNode.type === CUSTOM_NOTE_NODE || targetNode.type === CUSTOM_NOTE_NODE)
    //   return false

    if (sourceNode.parentNode !== targetNode.parentNode)
      return false

    if (sourceNode && targetNode) {
      const sourceNodeAvailableNextNodes = getAvailableBlocks(sourceNode.data!.type, !!sourceNode.parentNode).availableNextBlocks
      const targetNodeAvailablePrevNodes = getAvailableBlocks(targetNode.data!.type, !!targetNode.parentNode).availablePrevBlocks

      if (!sourceNodeAvailableNextNodes.includes(targetNode.data!.type))
        return false

      if (!targetNodeAvailablePrevNodes.includes(sourceNode.data!.type))
        return false
    }

    const hasCycle = (node: Node, visited = new Set()) => {
      if (visited.has(node.id))
        return false

      visited.add(node.id)

      for (const outgoer of getOutgoers(node, nodes.value, edges.value)) {
        if (outgoer.id === source)
          return true
        if (hasCycle(outgoer, visited))
          return true
      }
    }

    return !hasCycle(targetNode)
  }

  return {
    getNodeById,
    getTreeLeafNodes,
    getBeforeNodesInSameBranch,
    getBeforeNodesInSameBranchIncludeParent,
    getAfterNodesInSameBranch,
    // handleOutVarRenameChange,
    isVarUsedInNodes,
    removeUsedVarInNodes,
    isNodeVarsUsedInNodes,
    isValidConnection,
    getBeforeNodeById,
    getIterationNodeChildren,
    getLoopNodeChildren,
    getRootNodesById,
    getStartNodes,
  }
}

export const useWorkflowReadOnly = () => {
  const { instance:workflowStore } = useWorkflowInstance()
  const workflowRunningData = computed(() => workflowStore.workflowRunningData.value)

  const getWorkflowReadOnly = () => {
    return workflowRunningData.value?.result?.status === WorkflowRunningStatus.Running
  }

  return {
    workflowReadOnly: workflowRunningData.value?.result?.status === WorkflowRunningStatus.Running,
    getWorkflowReadOnly,
  }
}

export const useNodesReadOnly = () => {
  const { instance: workflowStore } = useWorkflowInstance()
  const workflowRunningData = computed(() => workflowStore.workflowRunningData.value)
  // const historyWorkflowData = workflowStore.historyWorkflowData
  // const isRestoring = workflowStore.isRestoring

  const getNodesReadOnly = () => {
    return workflowRunningData.value?.result?.status === WorkflowRunningStatus.Running
    // return workflowRunningData.value?.result.status === WorkflowRunningStatus.Running || historyWorkflowData.value || isRestoring.value
  }

  return {
    nodesReadOnly: !!(workflowRunningData.value?.result?.status === WorkflowRunningStatus.Running),
    // nodesReadOnly: !!(workflowRunningData.value?.result.status === WorkflowRunningStatus.Running || historyWorkflowData.value || isRestoring.value),
    getNodesReadOnly,
  }
}
