import { computed } from 'vue'
import { uniqBy } from 'lodash-es'
import { useNodeDataUpdate, useWorkflow, useWorkflowVariables } from '@/components/workflow/hooks'
import type { Node, ValueSelector, Var } from '@/types'
import { useWorkflowStore } from '@/components/workflow/store'
import type { VarGroupItem, VariableAssignerNodeType } from './types'
import { useVueFlow } from '@vue-flow/core'

export const useVariableAssigner = () => {
  const workflowStore = useWorkflowStore()
  const { handleNodeDataUpdate } = useNodeDataUpdate()

  const handleAssignVariableValueChange = (nodeId: string, value: ValueSelector, varDetail: Var, groupId?: string) => {
    const { nodes } = useVueFlow()
    const node: Node<VariableAssignerNodeType> = nodes.value.find(node => node.id === nodeId)!

    let payload
    if (groupId && groupId !== 'target') {
      payload = {
        advanced_settings: {
          ...node.data!.advanced_settings,
          groups: node.data!.advanced_settings?.groups.map((group: VarGroupItem & { groupId: string }) => {
            if (group.groupId === groupId && !group.variables.some(item => item.join('.') === (value as ValueSelector).join('.'))) {
              return {
                ...group,
                variables: [...group.variables, value],
                output_type: varDetail.type,
              }
            }
            return group
          }),
        },
      }
    } else {
      if (node.data!.variables.some(item => item.join('.') === (value as ValueSelector).join('.')))
        return
      payload = {
        variables: [...node.data!.variables, value],
        output_type: varDetail.type,
      }
    }
    handleNodeDataUpdate({
      id: nodeId,
      data: payload,
    })
  }

  const handleAddVariableInAddVariablePopupWithPosition = (
    nodeId: string,
    variableAssignerNodeId: string,
    variableAssignerNodeHandleId: string,
    value: ValueSelector,
    varDetail: Var,
  ) => {
    const { nodes } = useVueFlow()
    const { setShowAssignVariablePopup } = workflowStore

    nodes.value.forEach((node) => {
      if (node.id === nodeId || node.id === variableAssignerNodeId) {
        node.data = {
          ...node.data,
          _showAddVariablePopup: false,
          _holdAddVariablePopup: false,
        }
      }
    })
    setShowAssignVariablePopup(undefined)
    handleAssignVariableValueChange(variableAssignerNodeId, value, varDetail, variableAssignerNodeHandleId)
  }

  const handleGroupItemMouseEnter = (groupId: string) => {
    workflowStore.setHoveringAssignVariableGroupId(groupId)
  }

  const handleGroupItemMouseLeave = () => {
    const { connectingNodePayload } = workflowStore
    if (connectingNodePayload) {
      workflowStore.setHoveringAssignVariableGroupId(undefined)
    }
  }

  return {
    handleAddVariableInAddVariablePopupWithPosition,
    handleGroupItemMouseEnter,
    handleGroupItemMouseLeave,
    handleAssignVariableValueChange,
  }
}

export const useGetAvailableVars = () => {
  const { nodes } = useVueFlow()
  const { getBeforeNodesInSameBranchIncludeParent } = useWorkflow()
  const { getNodeAvailableVars } = useWorkflowVariables()

  const getAvailableVars = (nodeId: string, handleId: string, filterVar: (v: Var) => boolean, hideEnv = false) => {
    const availableNodes: Node[] = []
    const currentNode = nodes.value.find(node => node.id === nodeId)!

    if (!currentNode)
      return []
    const beforeNodes = getBeforeNodesInSameBranchIncludeParent(nodeId)
    availableNodes.push(...beforeNodes)
    const parentNode = nodes.value.find(node => node.id === currentNode.parentNode)

    if (hideEnv) {
      return getNodeAvailableVars({
        parentNode,
        beforeNodes: uniqBy(availableNodes, 'id').filter(node => node.id !== nodeId),
        isChatMode: false,
        hideEnv,
        hideChatVar: false,
        filterVar,
      })
        .map(node => ({
          ...node,
          vars: node.isStartNode ? node.vars.filter(v => !v.variable.startsWith('sys.')) : node.vars,
        }))
        .filter(item => item.vars.length > 0)
    }

    return getNodeAvailableVars({
      parentNode,
      beforeNodes: uniqBy(availableNodes, 'id').filter(node => node.id !== nodeId),
      isChatMode: false,
      filterVar,
    })
  }

  return getAvailableVars
}