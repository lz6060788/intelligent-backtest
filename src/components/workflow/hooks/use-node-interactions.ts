import { getOutgoers, type Connection, type GraphEdge, type NodeDragEvent, type NodeMouseEvent, type OnConnectStartParams, type XYPosition } from '@vue-flow/core';
import { reactive, unref } from 'vue';
import { useVueFlow, getConnectedEdges } from '@vue-flow/core'
import { useWorkflowInstance } from '../hooks/use-workflow-instance'
import { cloneDeep } from 'lodash-es'
import { BlockEnum, type Edge, type Node, type OnNodeAdd } from '@/types'
import { CUSTOM_EDGE, CUSTOM_LOOP_START_NODE, LOOP_CHILDREN_Z_INDEX, NODE_WIDTH_X_OFFSET, X_OFFSET, Y_OFFSET } from '../nodes/_base/node/constant';
import { getNodesConnectedSourceOrTargetHandleIdsMap } from '../utils/workflow';
import { generateNewNode, genNewNodeTitleFromOld, getNestedNodePosition, getNodeCustomTypeByNodeDataType, getTopLeftNodePosition } from '../utils/node';
import type { LoopNodeType } from '../nodes/loop/type';
import { useNodeLoopInteractions } from '@/components/workflow/nodes/loop/use-interactions'
import { useNodesMetaData } from './use-nodes-meta-data';
import {
  useNodesReadOnly,
  useWorkflow,
  useWorkflowReadOnly,
} from './use-workflow'
import {
  WorkflowHistoryEvent,
  useWorkflowHistory,
} from './use-workflow-history'

export const useNodesInteractions = () => {
  const { instance: workflowStore, instanceId } = useWorkflowInstance();
  const store = useVueFlow(instanceId);
  const { getNodesReadOnly } = useNodesReadOnly()
  const { getWorkflowReadOnly } = useWorkflowReadOnly()
  const { handleNodeLoopChildDrag, handleNodeLoopChildrenCopy }
    = useNodeLoopInteractions()
  const { nodesMap: nodesMetaDataMap } = useNodesMetaData()
  const { getAfterNodesInSameBranch } = useWorkflow()
  const { store: workflowHistoryStore, saveStateToHistory, undo, redo } = useWorkflowHistory()

  const dragNodeStartPosition = reactive({ x: 0, y: 0 } as {
    x: number;
    y: number;
  })

  const handleNodeDragStart = (e: NodeDragEvent) => {
    if (getNodesReadOnly()) return
    const node = e.node;

    dragNodeStartPosition.x = node.position.x;
    dragNodeStartPosition.y = node.position.y;
  }

  const handleNodeDrag = (e: NodeDragEvent) => {
    if (getNodesReadOnly()) return
    const { node, event } = e;

    if (node.type === CUSTOM_LOOP_START_NODE) return

    const { nodes } = store;
    event.stopPropagation();

    const { restrictPosition: restrictLoopPosition }
      = handleNodeLoopChildDrag(node)

    const currentNode = nodes.value.find(n => n.id === node.id)!

    if (restrictLoopPosition.x !== undefined)
      currentNode.position.x = restrictLoopPosition.x
    else currentNode.position.x = node.position.x
    if (restrictLoopPosition.y !== undefined)
      currentNode.position.y = restrictLoopPosition.y
    else currentNode.position.y = node.position.y
  }

  const handleNodeDragStop = (e: NodeDragEvent) => {
    if (getNodesReadOnly()) return
    const node = e.node;
    const { x, y } = dragNodeStartPosition
    console.log(x, y)
    if (!(x === node.position.x && y === node.position.y)) {
      // handleSyncWorkflowDraft()

      if (x !== 0 && y !== 0) {
        // selecting a note will trigger a drag stop event with x and y as 0
        saveStateToHistory(WorkflowHistoryEvent.NodeDragStop, {
          nodeId: node.id,
        })
      }
    }
  }

  const handleNodeMouseEnter = (e: NodeMouseEvent) => {
    if (getNodesReadOnly()) return
    const node = e.node;
    const { nodes, edges } = store;
    const { connectingNodePayload, setEnteringNodePayload }
      = workflowStore;

    // 连接到特殊节点时高亮对应的节点
    if (connectingNodePayload.value) {
      if (connectingNodePayload.value?.nodeId === node.id) return
      const connectingNode: Node = nodes.value.find(
        n => n.id === connectingNodePayload.value?.nodeId,
      )!
      console.log(connectingNodePayload.value, connectingNode)
      const sameLevel = connectingNode.parentNode === node.parentNode

      if (sameLevel) {
        setEnteringNodePayload({
          nodeId: node.id,
          nodeData: node.data,
        })
        // 特殊节点 - 可能无需使用
        // const fromType = connectingNodePayload.handleType

        // nodes.map((n) => {
        //   if (
        //     n.id === node.id
        //     && fromType === 'source'
        //     && (node.data.type === BlockEnum.VariableAssigner
        //       || node.data.type === BlockEnum.VariableAggregator)
        //   ) {
        //     if (!node.data.advanced_settings?.group_enabled)
        //       n.data._isEntering = true
        //   }
        //   if (
        //     n.id === node.id
        //     && fromType === 'target'
        //     && (connectingNode.data?.type === BlockEnum.VariableAssigner
        //       || connectingNode.data?.type === BlockEnum.VariableAggregator)
        //     && node.data.type !== BlockEnum.IfElse
        //     && node.data.type !== BlockEnum.QuestionClassifier
        //   )
        //     n.data._isEntering = true;
        //   return n
        // })
        // setNodes(nodes)
      }
    }
    const connectedEdges = getConnectedEdges([node], edges.value)
    connectedEdges.forEach((edge) => {
      const currentEdge = edges.value.find(e => e.id === edge.id)
      if (currentEdge) currentEdge.data._connectedNodeIsHovering = true
    })
  }

  const handleNodeMouseLeave = (e: NodeMouseEvent) => {
    if (getNodesReadOnly()) return
    const { setEnteringNodePayload } = workflowStore
    setEnteringNodePayload(undefined)
    const { nodes, edges } = store
    nodes.value.forEach((node) => {
      node.data._isEntering = false
    })
    edges.value.forEach((edge) => {
      edge.data._connectedNodeIsHovering = false
    })
  }

  const handleNodeSelect = (
    nodeId: string,
    cancelSelection?: boolean,
  ) => {
    const { nodes, edges } = store;

    const selectedNode = nodes.value.find(node => node.data.selected)

    if (!cancelSelection && selectedNode?.id === nodeId) return

    nodes.value.forEach((node) => {
      if (node.id === nodeId) node.data.selected = !cancelSelection
      else node.data.selected = false
    })

    const connectedEdges = getConnectedEdges(
      [{ id: nodeId } as Node],
      edges.value,
    ).map(edge => edge.id)
    edges.value.forEach((edge) => {
      if (connectedEdges.includes(edge.id)) {
        edge.data = {
          ...edge.data,
          _connectedNodeIsSelected: !cancelSelection,
        }
      }
      else {
        edge.data = {
          ...edge.data,
          _connectedNodeIsSelected: false,
        }
      }
    })

    // handleSyncWorkflowDraft()
  }

  const handleNodesCancelSelected = () => {
    const { nodes } = store

    nodes.value.forEach((node) => {
      node.data.selected = false
    })
  }

  const handleNodeClick = (e: NodeMouseEvent) => {
    if (e.node.type === CUSTOM_LOOP_START_NODE) return
    handleNodeSelect(e.node.id);
  }

  const handleNodeContextMenu = (e: NodeMouseEvent) => {

    if (e.node.type === CUSTOM_LOOP_START_NODE)
      return
    e.event.preventDefault()
    const container = document.querySelector('#workflow-container')
    const { x, y } = container!.getBoundingClientRect()
    const { setNodeMenu } = workflowStore
    setNodeMenu({
      top: (e.event as MouseEvent).clientY - y,
      left: (e.event as MouseEvent).clientX - x,
      nodeId: e.node.id,
    })
    handleNodeSelect(e.node.id)
  }

  const handleNodeConnectStart = (e: { event?: MouseEvent } & OnConnectStartParams) => {
    if (getNodesReadOnly()) return
    const { nodeId, handleType, handleId } = e

    if (nodeId && handleType) {
      const { setConnectingNodePayload } = workflowStore
      const { nodes } = store
      const node = nodes.value.find(n => n.id === nodeId)!

      // if (node.type === CUSTOM_NOTE_NODE) return

      // if (
      //   node.data.type === BlockEnum.VariableAggregator
      //   || node.data.type === BlockEnum.VariableAssigner
      // )
      //   if (handleType === 'target') return

      setConnectingNodePayload({
        nodeId,
        nodeType: node.data.type,
        handleType,
        handleId,
      })
    }
  }

  const handleNodeConnect =
  ({ source, sourceHandle, target, targetHandle }: Connection) => {
    if (source === target) return
    if (getNodesReadOnly()) return

    const { nodes, edges, addEdges } = store
    const targetNode = nodes.value.find(node => node.id === target!)
    const sourceNode = nodes.value.find(node => node.id === source!)

    if (targetNode?.parentNode !== sourceNode?.parentNode) return

    // 线已存在
    if (
      edges.value.find(
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
    const nodesConnectedSourceOrTargetHandleIdsMap
      = getNodesConnectedSourceOrTargetHandleIdsMap(
        [{ type: 'add', edge: newEdge }],
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
    addEdges(newEdge)

    // handleSyncWorkflowDraft()
    saveStateToHistory(WorkflowHistoryEvent.NodeConnect, {
      nodeId: targetNode?.id,
    })
  }

  const handleNodeConnectEnd = (e?: MouseEvent) => {
    if (getNodesReadOnly()) return

      const {
        connectingNodePayload,
        setConnectingNodePayload,
        enteringNodePayload,
        setEnteringNodePayload,
      } = workflowStore
      if (connectingNodePayload && enteringNodePayload) {
        // const { setShowAssignVariablePopup, hoveringAssignVariableGroupId }
        //   = workflowStore
        const { project } = store
        const { nodes } = store
        const fromHandleType = connectingNodePayload.value?.handleType
        const fromHandleId = connectingNodePayload.value?.handleId
        const fromNode = nodes.value.find(
          n => n.id === connectingNodePayload.value?.nodeId,
        )!
        const toNode = nodes.value.find(n => n.id === enteringNodePayload.value?.nodeId)
        if (!toNode) return
        const toParentNode = nodes.value.find(n => n.id === toNode?.parentNode)

        if (fromNode?.parentNode !== toNode?.parentNode) return

        // const { x, y } = project({ x: e?.x || 0, y: e?.y || 0 })

        // if (
        //   fromHandleType === 'source'
        //   && (toNode.data.type === BlockEnum.VariableAssigner
        //     || toNode.data.type === BlockEnum.VariableAggregator)
        // ) {
        //   const groupEnabled = toNode.data.advanced_settings?.group_enabled
        //   const firstGroupId = toNode.data.advanced_settings?.groups[0].groupId
        //   let handleId = 'target'

        //   if (groupEnabled) {
        //     if (hoveringAssignVariableGroupId)
        //       handleId = hoveringAssignVariableGroupId
        //     else handleId = firstGroupId
        //   }
        //   nodes.value.forEach((node) => {
        //     if (node.id === toNode.id) {
        //       node.data._showAddVariablePopup = true
        //       node.data._holdAddVariablePopup = true
        //     }
        //   })
        //   setShowAssignVariablePopup({
        //     nodeId: fromNode.id,
        //     nodeData: fromNode.data,
        //     variableAssignerNodeId: toNode.id,
        //     variableAssignerNodeData: toNode.data,
        //     variableAssignerNodeHandleId: handleId,
        //     parentNode: toParentNode,
        //     x: x - toNode.position!.x,
        //     y: y - toNode.position!.y,
        //   })
        //   handleNodeConnect({
        //     source: fromNode.id,
        //     sourceHandle: fromHandleId,
        //     target: toNode.id,
        //     targetHandle: 'target',
        //   })
        // }
      }
      setConnectingNodePayload(undefined)
      setEnteringNodePayload(undefined)
  }

  const handleNodeDelete = (nodeId: string) => {
    if (getNodesReadOnly()) return

      const { nodes, setNodes, edges, setEdges } = store

      const currentNodeIndex = nodes.value.findIndex(node => node.id === nodeId)
      const currentNode = nodes.value[currentNodeIndex]

      console.log('currentNode', currentNode, nodes.value, nodeId)
      if (!currentNode) return

      if (
        nodesMetaDataMap?.[currentNode.data.type as BlockEnum]?.metaData
          .isUndeletable
      )
        return

      // deleteNodeInspectorVars(nodeId)
      // if (currentNode.data.type === BlockEnum.Iteration) {
      //   const iterationChildren = nodes.filter(
      //     node => node.parentId === currentNode.id,
      //   )

      //   if (iterationChildren.length) {
      //     if (currentNode.data._isBundled) {
      //       iterationChildren.forEach((child) => {
      //         handleNodeDelete(child.id)
      //       })
      //       return handleNodeDelete(nodeId)
      //     }
      //     else {
      //       if (iterationChildren.length === 1) {
      //         handleNodeDelete(iterationChildren[0].id)
      //         handleNodeDelete(nodeId)

      //         return
      //       }
      //       const { setShowConfirm, showConfirm } = workflowStore.getState()

      //       if (!showConfirm) {
      //         setShowConfirm({
      //           title: t('workflow.nodes.iteration.deleteTitle'),
      //           desc: t('workflow.nodes.iteration.deleteDesc') || '',
      //           onConfirm: () => {
      //             iterationChildren.forEach((child) => {
      //               handleNodeDelete(child.id)
      //             })
      //             handleNodeDelete(nodeId)
      //             handleSyncWorkflowDraft()
      //             setShowConfirm(undefined)
      //           },
      //         })
      //         return
      //       }
      //     }
      //   }
      // }

      if (currentNode.data.type === BlockEnum.Loop) {
        const loopChildren = nodes.value.filter(
          node => node.parentNode === currentNode.id,
        )

        if (loopChildren.length) {
          if (currentNode.data._isBundled) {
            loopChildren.forEach((child) => {
              handleNodeDelete(child.id)
            })
            return handleNodeDelete(nodeId)
          }
          else {
            if (loopChildren.length === 1) {
              handleNodeDelete(loopChildren[0]!.id)
              handleNodeDelete(nodeId)

              return
            }
            const { setShowConfirm, showConfirm } = workflowStore

            if (!showConfirm) {
              setShowConfirm({
                title: '是否删除循环节点',
                desc: '',
                onConfirm: () => {
                  loopChildren.forEach((child) => {
                    handleNodeDelete(child.id)
                  })
                  handleNodeDelete(nodeId)
                  // handleSyncWorkflowDraft()
                  setShowConfirm(undefined)
                },
              })
              return
            }
          }
        }
      }

      // if (currentNode.data.type === BlockEnum.DataSource) {
      //   const { id } = currentNode
      //   const { ragPipelineVariables, setRagPipelineVariables }
      //     = workflowStore
      //   if (ragPipelineVariables && setRagPipelineVariables) {
      //     const newRagPipelineVariables: RAGPipelineVariables = []
      //     ragPipelineVariables.forEach((variable) => {
      //       if (variable.belong_to_node_id === id) return
      //       newRagPipelineVariables.push(variable)
      //     })
      //     setRagPipelineVariables(newRagPipelineVariables)
      //   }
      // }

      const connectedEdges = getConnectedEdges([{ id: nodeId } as Node], edges.value)
      const nodesConnectedSourceOrTargetHandleIdsMap
        = getNodesConnectedSourceOrTargetHandleIdsMap(
          connectedEdges.map(edge => ({ type: 'remove', edge })),
          nodes.value,
        )
      const newNodes = unref(nodes.value)
      newNodes.forEach((node) => {
        if (nodesConnectedSourceOrTargetHandleIdsMap[node.id]) {
          node.data = {
            ...node.data,
            ...nodesConnectedSourceOrTargetHandleIdsMap[node.id],
          }
        }

        if (node.id === currentNode.parentNode) {
          node.data._children = node.data._children?.filter(
            (child: any) => child.nodeId !== nodeId,
          )
        }
      })
      newNodes.splice(currentNodeIndex, 1)
      setNodes(newNodes)
      const newEdges = edges.value.filter(
        edge =>
          !connectedEdges.find(
            connectedEdge => connectedEdge.id === edge.id,
          ),
      )
      setEdges(newEdges)
      // handleSyncWorkflowDraft()

      saveStateToHistory(WorkflowHistoryEvent.NodeDelete, {
        nodeId: currentNode.id,
      })
  }

  const handleNodeAdd: OnNodeAdd = ({
      nodeType,
      sourceHandle = 'source',
      targetHandle = 'target',
    }, { prevNodeId, prevNodeSourceHandle, nextNodeId, nextNodeTargetHandle }) => {
      if (getNodesReadOnly()) return

      const { nodes, setNodes, edges, setEdges } = store
      const nodesWithSameType = nodes.value.filter(
        node => node.data.type === nodeType,
      )
      const { defaultValue } = nodesMetaDataMap![nodeType]
      const { newNode, newIterationStartNode, newLoopStartNode }
        = generateNewNode({
          type: getNodeCustomTypeByNodeDataType(nodeType),
          data: {
            ...(defaultValue as any),
            title:
              nodesWithSameType.length > 0
                ? `${defaultValue.title} ${nodesWithSameType.length + 1}`
                : defaultValue.title,
            selected: true,
            // _showAddVariablePopup:
            //   (nodeType === BlockEnum.VariableAssigner
            //     || nodeType === BlockEnum.VariableAggregator)
            //   && !!prevNodeId,
            _holdAddVariablePopup: false,
          },
          position: {
            x: 0,
            y: 0,
          },
        })
      if (prevNodeId && !nextNodeId) {
        const prevNodeIndex = nodes.value.findIndex(node => node.id === prevNodeId)
        const prevNode = nodes.value[prevNodeIndex]
        const outgoers = getOutgoers(prevNodeId, nodes.value, edges.value).sort(
          (a, b) => a.position.y - b.position.y,
        )
        const lastOutgoer = outgoers[outgoers.length - 1]

        newNode.data!._connectedTargetHandleIds
          = nodeType === BlockEnum.DataSource ? [] : [targetHandle]
        newNode.data!._connectedSourceHandleIds = []
        newNode.position = {
          x: lastOutgoer
            ? lastOutgoer.position.x
            : prevNode!.position.x + prevNode!.dimensions.width + X_OFFSET,
          y: lastOutgoer
            ? lastOutgoer!.position.y + lastOutgoer!.dimensions.height + Y_OFFSET
            : prevNode!.position.y,
        }
        newNode.parentNode = prevNode!.parentNode
        newNode.extent = prevNode!.extent

        const parentNode
          = nodes.value.find(node => node.id === prevNode!.parentNode) || null
        const isInLoop
          = !!parentNode && parentNode.data.type === BlockEnum.Loop

        if (prevNode!.parentNode) {
          newNode.data!.isInLoop = isInLoop
          if (isInLoop) {
            newNode.data!.loop_id = parentNode.id
            newNode.zIndex = LOOP_CHILDREN_Z_INDEX
          }
          // if (
          //   isInLoop
          //   && (newNode.data!.type === BlockEnum.Answer
          //     || newNode.data!.type === BlockEnum.Tool
          //     || newNode.data!.type === BlockEnum.Assigner)
          // ) {
          //   const iterNodeData: IterationNodeType = parentNode.data
          //   iterNodeData._isShowTips = true
          // }
        }

        let newEdge = null
        if (nodeType !== BlockEnum.DataSource) {
          newEdge = {
            id: `${prevNodeId}-${prevNodeSourceHandle}-${newNode.id}-${targetHandle}`,
            type: CUSTOM_EDGE,
            source: prevNodeId,
            sourceHandle: prevNodeSourceHandle,
            target: newNode.id,
            targetHandle,
            data: {
              sourceType: prevNode!.data.type,
              targetType: newNode.data!.type,
              // isInIteration,
              isInLoop,
              // iteration_id: isInIteration ? prevNode.parentNode : undefined,
              loop_id: isInLoop ? prevNode!.parentNode : undefined,
              _connectedNodeIsSelected: true,
            },
            zIndex: prevNode!.parentNode
              ? LOOP_CHILDREN_Z_INDEX
              : 0,
          }
        }

        const nodesConnectedSourceOrTargetHandleIdsMap
          = getNodesConnectedSourceOrTargetHandleIdsMap(
            (newEdge ? [{ type: 'add', edge: newEdge }] : []),
            nodes.value,
          )
        nodes.value.forEach((node) => {
          node.data.selected = false

          if (nodesConnectedSourceOrTargetHandleIdsMap[node.id]) {
            node.data = {
              ...node.data,
              ...nodesConnectedSourceOrTargetHandleIdsMap[node.id],
            }
          }

          // if (
          //   node.data.type === BlockEnum.Iteration
          //   && prevNode!.parentNode === node.id
          // ) {
          //   node.data._children?.push({
          //     nodeId: newNode.id,
          //     nodeType: newNode.data!.type,
          //   })
          // }

          if (
            node.data.type === BlockEnum.Loop
            && prevNode?.parentNode === node.id
          ) {
            node.data._children?.push({
              nodeId: newNode.id,
              nodeType: newNode.data!.type,
            })
          }
        })
        const newNodes = [...nodes.value, newNode]
        
        // if (newIterationStartNode) nodes.value.push(newIterationStartNode)
        
        if (newLoopStartNode) newNodes.push(newLoopStartNode)

        setNodes(newNodes)

        // if (
        //   newNode.data.type === BlockEnum.VariableAssigner
        //   || newNode.data.type === BlockEnum.VariableAggregator
        // ) {
        //   const { setShowAssignVariablePopup } = workflowStore.getState()

        //   setShowAssignVariablePopup({
        //     nodeId: prevNode.id,
        //     nodeData: prevNode.data,
        //     variableAssignerNodeId: newNode.id,
        //     variableAssignerNodeData: newNode.data as VariableAssignerNodeType,
        //     variableAssignerNodeHandleId: targetHandle,
        //     parentNode: nodes.find(node => node.id === newNode.parentNode),
        //     x: -25,
        //     y: 44,
        //   })
        // }
        edges.value.forEach((item) => {
          item.data = {
            ...item.data,
            _connectedNodeIsSelected: false,
          }
        })
        if (newEdge) setEdges([...edges.value, newEdge])

      }
      if (!prevNodeId && nextNodeId) {
        const nextNodeIndex = nodes.value.findIndex(node => node.id === nextNodeId)
        const nextNode = nodes.value[nextNodeIndex]!
        if (
          nodeType !== BlockEnum.IfElse
          // && nodeType !== BlockEnum.QuestionClassifier
        )
        newNode.data!._connectedSourceHandleIds = [sourceHandle]
        newNode.data!._connectedTargetHandleIds = []
        newNode.position = {
          x: nextNode.position.x,
          y: nextNode.position.y,
        }
        newNode.parentNode = nextNode.parentNode
        newNode.extent = nextNode.extent

        const parentNode
          = nodes.value.find(node => node.id === nextNode.parentNode) || null
        // const isInIteration
        //   = !!parentNode && parentNode.data.type === BlockEnum.Iteration
        const isInLoop
          = !!parentNode && parentNode.data.type === BlockEnum.Loop

        if (parentNode && nextNode.parentNode) {
          // newNode.data.isInIteration = isInIteration
          newNode.data!.isInLoop = isInLoop
          // if (isInIteration) {
          //   newNode.data.iteration_id = parentNode.id
          //   newNode.zIndex = ITERATION_CHILDREN_Z_INDEX
          // }
          if (isInLoop) {
            newNode.data!.loop_id = parentNode.id
            newNode.zIndex = LOOP_CHILDREN_Z_INDEX
          }
        }

        let newEdge

        if (
          nodeType !== BlockEnum.IfElse
          // && nodeType !== BlockEnum.QuestionClassifier
          && nodeType !== BlockEnum.LoopEnd
        ) {
          newEdge = {
            id: `${newNode.id}-${sourceHandle}-${nextNodeId}-${nextNodeTargetHandle}`,
            type: CUSTOM_EDGE,
            source: newNode.id,
            sourceHandle,
            target: nextNodeId,
            targetHandle: nextNodeTargetHandle,
            data: {
              sourceType: newNode.data!.type,
              targetType: nextNode.data.type,
              // isInIteration,
              isInLoop,
              // iteration_id: isInIteration ? nextNode.parentNode : undefined,
              loop_id: isInLoop ? nextNode.parentNode : undefined,
              _connectedNodeIsSelected: true,
            },
            zIndex: nextNode.parentNode
              ? LOOP_CHILDREN_Z_INDEX
              : 0,
          }
        }

        let nodesConnectedSourceOrTargetHandleIdsMap: Record<string, any>
        if (newEdge) {
          nodesConnectedSourceOrTargetHandleIdsMap
            = getNodesConnectedSourceOrTargetHandleIdsMap(
              [{ type: 'add', edge: newEdge }],
              nodes.value,
            )
        }

        const afterNodesInSameBranch = getAfterNodesInSameBranch(nextNodeId!)
        const afterNodesInSameBranchIds = afterNodesInSameBranch.map(
          node => node.id,
        )
        nodes.value.forEach((node) => {
          node.data.selected = false

          if (afterNodesInSameBranchIds.includes(node.id))
            node.position.x += NODE_WIDTH_X_OFFSET

          if (nodesConnectedSourceOrTargetHandleIdsMap?.[node.id]) {
            node.data = {
              ...node.data,
              ...nodesConnectedSourceOrTargetHandleIdsMap[node.id],
            }
          }

          // if (
          //   node.data.type === BlockEnum.Iteration
          //   && nextNode.parentNode === node.id
          // ) {
          //   node.data._children?.push({
          //     nodeId: newNode.id,
          //     nodeType: newNode.data.type,
          //   })
          // }

          // if (
          //   node.data.type === BlockEnum.Iteration
          //   && node.data.start_node_id === nextNodeId
          // ) {
          //   node.data.start_node_id = newNode.id
          //   node.data.startNodeType = newNode.data.type
          // }

          if (
            node.data.type === BlockEnum.Loop
            && nextNode.parentNode === node.id
          ) {
            node.data._children?.push({
              nodeId: newNode.id,
              nodeType: newNode.data!.type,
            })
          }

          if (
            node.data.type === BlockEnum.Loop
            && node.data.start_node_id === nextNodeId
          ) {
            node.data.start_node_id = newNode.id
            node.data.startNodeType = newNode.data!.type
          }
        })
        const newNodeList = [...nodes.value, newNode]
        if (newIterationStartNode) newNodeList.push(newIterationStartNode)
        if (newLoopStartNode) newNodeList.push(newLoopStartNode)
        setNodes(newNodeList)
        if (newEdge) {
          edges.value.forEach((item) => {
            item.data = {
              ...item.data,
              _connectedNodeIsSelected: false,
            }
          })

          setEdges([...edges.value, newEdge])
        }
      }
      if (prevNodeId && nextNodeId) {
        const prevNode = nodes.value.find(node => node.id === prevNodeId)!
        const nextNode = nodes.value.find(node => node.id === nextNodeId)!

        newNode.data!._connectedTargetHandleIds
          = nodeType === BlockEnum.DataSource ? [] : [targetHandle]
        newNode.data!._connectedSourceHandleIds = [sourceHandle]
        newNode.position = {
          x: nextNode.position.x,
          y: nextNode.position.y,
        }
        newNode.parentNode = prevNode.parentNode
        newNode.extent = prevNode.extent

        const parentNode
          = nodes.value.find(node => node.id === prevNode.parentNode) || null
        // const isInIteration
        //   = !!parentNode && parentNode.data.type === BlockEnum.Iteration
        const isInLoop
          = !!parentNode && parentNode.data.type === BlockEnum.Loop

        if (parentNode && prevNode.parentNode) {
          // newNode.data.isInIteration = isInIteration
          newNode.data!.isInLoop = isInLoop
          // if (isInIteration) {
          //   newNode.data.iteration_id = parentNode.id
          //   newNode.zIndex = ITERATION_CHILDREN_Z_INDEX
          // }
          if (isInLoop) {
            newNode.data!.loop_id = parentNode.id
            newNode.zIndex = LOOP_CHILDREN_Z_INDEX
          }
        }

        const currentEdgeIndex = edges.value.findIndex(
          edge => edge.source === prevNodeId && edge.target === nextNodeId,
        )
        let newPrevEdge = null

        if (nodeType !== BlockEnum.DataSource) {
          newPrevEdge = {
            id: `${prevNodeId}-${prevNodeSourceHandle}-${newNode.id}-${targetHandle}`,
            type: CUSTOM_EDGE,
            source: prevNodeId,
            sourceHandle: prevNodeSourceHandle,
            target: newNode.id,
            targetHandle,
            data: {
              sourceType: prevNode.data.type,
              targetType: newNode.data!.type,
              // isInIteration,
              isInLoop,
              // iteration_id: isInIteration ? prevNode.parentNode : undefined,
              loop_id: isInLoop ? prevNode.parentNode : undefined,
              _connectedNodeIsSelected: true,
            },
            zIndex: prevNode.parentNode
              ? LOOP_CHILDREN_Z_INDEX
              : 0,
          }
        }

        let newNextEdge: Edge | null = null

        const nextNodeParentNode
          = nodes.value.find(node => node.id === nextNode.parentNode) || null
        // const isNextNodeInIteration
        //   = !!nextNodeParentNode
        //   && nextNodeParentNode.data.type === BlockEnum.Iteration
        const isNextNodeInLoop
          = !!nextNodeParentNode
          && nextNodeParentNode.data.type === BlockEnum.Loop

        if (
          nodeType !== BlockEnum.IfElse
          // && nodeType !== BlockEnum.QuestionClassifier
          && nodeType !== BlockEnum.LoopEnd
        ) {
          newNextEdge = {
            id: `${newNode.id}-${sourceHandle}-${nextNodeId}-${nextNodeTargetHandle}`,
            type: CUSTOM_EDGE,
            source: newNode.id,
            sourceHandle,
            target: nextNodeId,
            targetHandle: nextNodeTargetHandle,
            data: {
              sourceType: newNode.data!.type,
              targetType: nextNode.data.type,
              // isInIteration: isNextNodeInIteration,
              isInLoop: isNextNodeInLoop,
              // iteration_id: isNextNodeInIteration
              //   ? nextNode.parentNode
              //   : undefined,
              loop_id: isNextNodeInLoop ? nextNode.parentNode : undefined,
              _connectedNodeIsSelected: true,
            },
            zIndex: nextNode.parentNode
              ? LOOP_CHILDREN_Z_INDEX
              : 0,
          }
        }
        const nodesConnectedSourceOrTargetHandleIdsMap
          = getNodesConnectedSourceOrTargetHandleIdsMap(
            [
              { type: 'remove', edge: edges.value[currentEdgeIndex]! },
              ...(newPrevEdge ? [{ type: 'add', edge: newPrevEdge }] : []),
              ...(newNextEdge ? [{ type: 'add', edge: newNextEdge }] : []),
            ],
            [...nodes.value, newNode],
          )

        const afterNodesInSameBranch = getAfterNodesInSameBranch(nextNodeId!)
        const afterNodesInSameBranchIds = afterNodesInSameBranch.map(
          node => node.id,
        )
        nodes.value.forEach((node) => {
          node.data.selected = false

          if (nodesConnectedSourceOrTargetHandleIdsMap[node.id]) {
            node.data = {
              ...node.data,
              ...nodesConnectedSourceOrTargetHandleIdsMap[node.id],
            }
          }
          if (afterNodesInSameBranchIds.includes(node.id))
            node.position.x += NODE_WIDTH_X_OFFSET

          // if (
          //   node.data.type === BlockEnum.Iteration
          //   && prevNode.parentNode === node.id
          // ) {
          //   node.data._children?.push({
          //     nodeId: newNode.id,
          //     nodeType: newNode.data.type,
          //   })
          // }
          if (
            node.data.type === BlockEnum.Loop
            && prevNode.parentNode === node.id
          ) {
            node.data._children?.push({
              nodeId: newNode.id,
              nodeType: newNode.data!.type,
            })
          }
        })
        const newNodes = [...nodes.value, newNode]
        if (newIterationStartNode) newNodes.push(newIterationStartNode)
        if (newLoopStartNode) newNodes.push(newLoopStartNode)
        setNodes(newNodes)
        // if (
        //   newNode.data.type === BlockEnum.VariableAssigner
        //   || newNode.data.type === BlockEnum.VariableAggregator
        // ) {
        //   const { setShowAssignVariablePopup } = workflowStore.getState()

        //   setShowAssignVariablePopup({
        //     nodeId: prevNode.id,
        //     nodeData: prevNode.data,
        //     variableAssignerNodeId: newNode.id,
        //     variableAssignerNodeData: newNode.data as VariableAssignerNodeType,
        //     variableAssignerNodeHandleId: targetHandle,
        //     parentNode: nodes.find(node => node.id === newNode.parentNode),
        //     x: -25,
        //     y: 44,
        //   })
        // }
        const newEdges: Array<GraphEdge | Edge> = edges.value
        newEdges.splice(currentEdgeIndex, 1)
        newEdges.forEach((item) => {
          item.data = {
            ...item.data,
            _connectedNodeIsSelected: false,
          }
        })
        if (newPrevEdge) newEdges.push(newPrevEdge)

        if (newNextEdge) newEdges.push(newNextEdge)
        setEdges(newEdges)
      }
      // handleSyncWorkflowDraft()
      saveStateToHistory(WorkflowHistoryEvent.NodeAdd, { nodeId: newNode.id })
  }

  const handleIsolatedNodeAdd = (nodeType: BlockEnum, position: XYPosition) => {
    if (getNodesReadOnly()) return

    const { nodes, setNodes, edges, setEdges } = store
    const nodesWithSameType = nodes.value.filter(
      node => node.data.type === nodeType,
    )
    const { defaultValue } = nodesMetaDataMap![nodeType]
    const { newNode, newIterationStartNode, newLoopStartNode }
      = generateNewNode({
        type: getNodeCustomTypeByNodeDataType(nodeType),
        data: {
          ...(defaultValue as any),
          title:
            nodesWithSameType.length > 0
              ? `${defaultValue.title} ${nodesWithSameType.length + 1}`
              : defaultValue.title,
          selected: false,
          // _showAddVariablePopup:
          //   (nodeType === BlockEnum.VariableAssigner
          //     || nodeType === BlockEnum.VariableAggregator)
          //   && !!prevNodeId,
          _holdAddVariablePopup: false,
        },
        position: {
          x: position.x,
          y: position.y,
        },
      })
    const newNodes = [...nodes.value, newNode]
    if (newIterationStartNode) newNodes.push(newIterationStartNode)
    if (newLoopStartNode) newNodes.push(newLoopStartNode)
    setNodes(newNodes)
  }

  const handleNodesCopy = (nodeId?: string) => {
    if (getNodesReadOnly()) return
    const { setClipboardElements } = workflowStore;
    const { nodes } = store;

    if (nodeId) {
      const nodeToCopy = nodes.value.find(
        node =>
          node.id === nodeId
          && node.data.type !== BlockEnum.Start
          // && node.type !== CUSTOM_ITERATION_START_NODE
          && node.type !== CUSTOM_LOOP_START_NODE
          && node.data.type !== BlockEnum.LoopEnd
          // && node.data.type !== BlockEnum.KnowledgeBase
          // && node.data.type !== BlockEnum.DataSourceEmpty,
      )
      if (nodeToCopy) setClipboardElements([nodeToCopy])
    } else {
        // If no nodeId is provided, fall back to the current behavior
        const bundledNodes = nodes.value.filter((node) => {
          if (!node.data._isBundled) return false
          // const { metaData } = nodesMetaDataMap![node.data.type as BlockEnum]
          // if (metaData.isSingleton) return false
          return !node.data.isInIteration && !node.data.isInLoop
        })

        if (bundledNodes.length) {
          setClipboardElements(bundledNodes)
          return
        }

        const selectedNode = nodes.value.find((node) => {
          if (!node.data.selected) return false
          return true
          // const { metaData } = nodesMetaDataMap![node.data.type as BlockEnum]
          // return !metaData.isSingleton
        })

        if (selectedNode) setClipboardElements([selectedNode])
    }
  }

  const handleNodesPaste = () => {
    if (getNodesReadOnly()) return
    const { clipboardElements, mousePosition } = workflowStore;
    const { nodes, edges, project, setNodes, setEdges } = store;

    const nodesToPaste: Node[] = []
    const edgesToPaste: Edge[] = []

    console.log('clipboardElements', clipboardElements.value)
    if (clipboardElements.value.length) {
      const { x, y } = getTopLeftNodePosition(clipboardElements.value)
      const currentPosition = project({
        x: mousePosition.value.pageX,
        y: mousePosition.value.pageY,
      })
      const offsetX = currentPosition.x - x
      const offsetY = currentPosition.y - y
      let idMapping: Record<string, string> = {}
      clipboardElements.value.forEach((nodeToPaste, index) => {
        const nodeType = nodeToPaste.data!.type

        const { newNode, newIterationStartNode, newLoopStartNode }
          = generateNewNode({
            type: nodeToPaste.type,
            data: {
              // ...nodesMetaDataMap![nodeType].defaultValue,
              type: nodeType,
              desc: '',
              ...nodeToPaste.data,
              selected: false,
              _isBundled: false,
              _connectedSourceHandleIds: [],
              _connectedTargetHandleIds: [],
              title: genNewNodeTitleFromOld(nodeToPaste.data!.title),
            },
            position: {
              x: nodeToPaste.position.x + offsetX,
              y: nodeToPaste.position.y + offsetY,
            },
            extent: nodeToPaste.extent,
            zIndex: nodeToPaste.zIndex,
          })
        newNode.id = newNode.id + index
        // This new node is movable and can be placed anywhere
        let newChildren: Node[] = []
        // if (nodeToPaste.data!.type === BlockEnum.Iteration) {
        //   newIterationStartNode!.parentNode = newNode.id;
        //   (newNode.data as IterationNodeType).start_node_id
        //     = newIterationStartNode!.id

        //   const oldIterationStartNode = nodes.find(
        //     n =>
        //       n.parentNode === nodeToPaste.id
        //       && n.type === CUSTOM_ITERATION_START_NODE,
        //   )
        //   idMapping[oldIterationStartNode!.id] = newIterationStartNode!.id

        //   const { copyChildren, newIdMapping }
        //     = handleNodeIterationChildrenCopy(
        //       nodeToPaste.id,
        //       newNode.id,
        //       idMapping,
        //     )
        //   newChildren = copyChildren
        //   idMapping = newIdMapping
        //   newChildren.forEach((child) => {
        //     newNode.data._children?.push({
        //       nodeId: child.id,
        //       nodeType: child.data.type,
        //     })
        //   })
        //   newChildren.push(newIterationStartNode!)
        // }
        // else if (nodeToPaste.data.type === BlockEnum.Loop) {
        if (nodeToPaste.data!.type === BlockEnum.Loop) {
          newLoopStartNode!.parentNode = newNode.id;
          (newNode.data as LoopNodeType).start_node_id = newLoopStartNode!.id

          newChildren = handleNodeLoopChildrenCopy(nodeToPaste.id, newNode.id)
          newChildren.forEach((child) => {
            newNode.data!._children?.push({
              nodeId: child.id,
              nodeType: child.data!.type,
            })
          })
          newChildren.push(newLoopStartNode!)
        }
        else {
          // single node paste
          const selectedNode = nodes.value.find(node => node.selected)
          if (selectedNode) {
            const commonNestedDisallowPasteNodes = [
              // end node only can be placed outermost layer
              BlockEnum.End,
            ]

            // handle disallow paste node
            if (commonNestedDisallowPasteNodes.includes(nodeToPaste.data!.type))
              return

            // handle paste to nested block
            // if (selectedNode.data.type === BlockEnum.Iteration) {
            //   newNode.data.isInIteration = true
            //   newNode.data.iteration_id = selectedNode.data.iteration_id
            //   newNode.parentNode = selectedNode.id
            //   newNode.positionAbsolute = {
            //     x: newNode.position.x,
            //     y: newNode.position.y,
            //   }
            //   // set position base on parent node
            //   newNode.position = getNestedNodePosition(newNode, selectedNode)
            // }
            // else if (selectedNode.data.type === BlockEnum.Loop) {
            if (selectedNode.data.type === BlockEnum.Loop) {
              newNode.data!.isInLoop = true
              newNode.data!.loop_id = selectedNode.data.loop_id
              newNode.parentNode = selectedNode.id
              newNode.position = {
                x: newNode.position.x,
                y: newNode.position.y,
              }
              // set position base on parent node
              newNode.position = getNestedNodePosition(newNode, selectedNode)
            }
          }
        }

        nodesToPaste.push(newNode)

        if (newChildren.length) nodesToPaste.push(...newChildren)
      })

      // only handle edge when paste nested block
      edges.value.forEach((edge) => {
        const sourceId = idMapping[edge.source]
        const targetId = idMapping[edge.target]

        if (sourceId && targetId) {
          const newEdge: Edge = {
            ...edge,
            id: `${sourceId}-${edge.sourceHandle}-${targetId}-${edge.targetHandle}`,
            source: sourceId,
            target: targetId,
            data: {
              ...edge.data,
              _connectedNodeIsSelected: false,
            },
          }
          edgesToPaste.push(newEdge)
        }
      })

      setNodes([...nodes.value, ...nodesToPaste])
      setEdges([...edges.value, ...edgesToPaste])
      saveStateToHistory(WorkflowHistoryEvent.NodePaste, {
        nodeId: nodesToPaste?.[0]?.id,
      })
      // handleSyncWorkflowDraft()
    }
  }

  const handleNodesDuplicate = (nodeId?: string) => {
    if (getNodesReadOnly()) return

    handleNodesCopy(nodeId)
    handleNodesPaste()
  }

  const handleNodesDelete = () => {
    if (getNodesReadOnly()) return

    const { nodes, edges } = store

    const bundledNodes = nodes.value.filter(
      node => node.data._isBundled && node.data.type !== BlockEnum.Start,
    )

    if (bundledNodes.length) {
      bundledNodes.forEach(node => handleNodeDelete(node.id))

      return
    }

    const edgeSelected = edges.value.some(edge => edge.selected)
    if (edgeSelected) return

    const selectedNode = nodes.value.find(
      node => node.data.selected && node.data.type !== BlockEnum.Start,
    )

    if (selectedNode) handleNodeDelete(selectedNode.id)
  }

  const handleNodeDisconnect = (nodeId: string) => {
    if (getNodesReadOnly()) return

      const { nodes, setNodes, edges, setEdges } = store
      const currentNode = nodes.value.find(node => node.id === nodeId)!
      const connectedEdges = getConnectedEdges([currentNode], edges.value)
      const nodesConnectedSourceOrTargetHandleIdsMap
        = getNodesConnectedSourceOrTargetHandleIdsMap(
          connectedEdges.map(edge => ({ type: 'remove', edge })),
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
      edges.value = edges.value.filter(
        edge =>
          !connectedEdges.find(
            connectedEdge => connectedEdge.id === edge.id,
          ),
      )
      // handleSyncWorkflowDraft()
      saveStateToHistory(WorkflowHistoryEvent.EdgeDelete)
  }

  const handleHistoryBack = () => {
    if (getNodesReadOnly() || getWorkflowReadOnly()) return

    const { setEdges, setNodes } = store
    undo()

    const currentHistory = workflowHistoryStore.getCurrentHistory()
    if (currentHistory) {
      const { nodes, edges } = currentHistory
      if (nodes && edges) {
        setEdges(edges)
        setNodes(nodes)
      }
    }
  }

  const handleHistoryForward = () => {
    if (getNodesReadOnly() || getWorkflowReadOnly()) return
    const { setEdges, setNodes } = store
    redo()
    const currentHistory = workflowHistoryStore.getCurrentHistory()
    if (currentHistory) {
      const { nodes, edges } = currentHistory
      if (nodes && edges) {
        setEdges(edges)
        setNodes(nodes)
      }
    }
  }

  return {
    handleNodeClick,
    handleNodeDragStart,
    handleNodeDrag,
    handleNodeDragStop,
    handleNodeMouseEnter,
    handleNodeMouseLeave,
    handleNodeSelect,
    handleNodesCancelSelected,
    handleNodeContextMenu,
    handleNodeConnectStart,
    handleNodeConnect,
    handleNodeConnectEnd,
    handleNodeDelete,
    handleNodeAdd,
    handleIsolatedNodeAdd,
    handleNodesCopy,
    handleNodesPaste,
    handleNodesDuplicate,
    handleNodesDelete,
    handleNodeDisconnect,
    handleHistoryBack,
    handleHistoryForward
  }
}
