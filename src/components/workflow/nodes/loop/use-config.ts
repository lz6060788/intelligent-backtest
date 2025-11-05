import { computed, ref, watch } from 'vue'
import { produce } from 'immer'
import { v4 as uuid4 } from 'uuid'
import { useVueFlow } from '@vue-flow/core'
import {
  useWorkflow,
} from '../../hooks'
import { ValueType, VarType } from '@/types'
import type { ErrorHandleMode, Var } from '@/types'
import { toNodeOutputVars } from '../_base/components/variable/utils'
import { getOperators } from './utils'
import { LogicalOperator } from './type'
import type {
  HandleAddCondition,
  HandleAddSubVariableCondition,
  HandleRemoveCondition,
  HandleToggleConditionLogicalOperator,
  HandleToggleSubVariableConditionLogicalOperator,
  HandleUpdateCondition,
  HandleUpdateSubVariableCondition,
  LoopNodeType,
} from './type'
import useIsVarFileAttribute from './use-is-var-file-attribute'
import { useWorkflowStore } from '@/components/workflow/store'

/**
 * 使用配置的composable
 * @param id 节点ID
 * @param payload 循环节点类型数据
 */
const useConfig = (id: string, payload: LoopNodeType) => {
  const { nodes } = useVueFlow()
  const workflowStore = useWorkflowStore()
  
  // 获取节点只读状态（需要根据实际情况实现）
  const readOnly = computed(() => false) // TODO: 实现真正的只读状态检查
  
  // 获取聊天模式状态（需要根据实际情况实现）
  const isChatMode = computed(() => false) // TODO: 实现真正的聊天模式检查
  
  const conversationVariables = computed(() => workflowStore.conversationVariables || [])
  
  // 获取当前节点数据
  const currentNode = computed(() => nodes.value.find(n => n.id === id))
  
  // 获取节点输入数据
  const inputs = computed(() => currentNode.value?.data as LoopNodeType || payload)
  
  // 更新节点数据
  const setInputs = (newInputs: LoopNodeType) => {
    const node = nodes.value.find(n => n.id === id)
    if (node) {
      node.data = { ...node.data, ...newInputs } as any
    }
  }
  
  const inputsRef = ref(inputs.value)
  
  // 监听inputs变化，更新ref
  watch(inputs, (newVal) => {
    inputsRef.value = newVal
  }, { immediate: true, deep: true })
  
  // 监听inputs变化，更新ref
  const handleInputsChange = (newInputs: LoopNodeType) => {
    inputsRef.value = newInputs
    setInputs(newInputs)
  }

  const filterInputVar = (varPayload: Var) => {
    return [VarType.array, VarType.arrayString, VarType.arrayNumber, VarType.arrayObject, VarType.arrayFile].includes(varPayload.type)
  }

  // output
  const { getLoopNodeChildren } = useWorkflow()
  const loopChildrenNodes = computed(() => [{ id, data: payload } as any, ...getLoopNodeChildren(id)])
  

  const dataSourceList = computed(() => workflowStore.dataSourceList || [])
  
  const allPluginInfoList = computed(() => ({
    dataSourceList: dataSourceList.value || [],
  }))
  
  const childrenNodeVars = computed(() => {
    return toNodeOutputVars(
      loopChildrenNodes.value,
      isChatMode.value,
      undefined,
      [],
      conversationVariables.value,
      [],
      allPluginInfoList.value
    )
  })

  const {
    getIsVarFileAttribute,
  } = useIsVarFileAttribute({
    nodeId: id,
  })

  const changeErrorResponseMode = (item: { value: unknown }) => {
    const newInputs = produce(inputsRef.value, (draft) => {
      draft.error_handle_mode = item.value as ErrorHandleMode
    })
    handleInputsChange(newInputs)
  }

  const handleAddCondition: HandleAddCondition = (valueSelector, varItem) => {
    const newInputs = produce(inputsRef.value, (draft) => {
      if (!draft.break_conditions)
        draft.break_conditions = []

      draft.break_conditions?.push({
        id: uuid4(),
        varType: varItem.type,
        variable_selector: valueSelector,
        comparison_operator: getOperators(varItem.type, getIsVarFileAttribute(valueSelector) ? { key: valueSelector.slice(-1)[0] } : undefined)[0],
        value: varItem.type === VarType.boolean ? 'false' : '',
      })
    })
    handleInputsChange(newInputs)
  }

  const handleRemoveCondition: HandleRemoveCondition = (conditionId) => {
    const newInputs = produce(inputsRef.value, (draft) => {
      draft.break_conditions = draft.break_conditions?.filter(item => item.id !== conditionId)
    })
    handleInputsChange(newInputs)
  }

  const handleUpdateCondition: HandleUpdateCondition = (conditionId, newCondition) => {
    const newInputs = produce(inputsRef.value, (draft) => {
      const targetCondition = draft.break_conditions?.find(item => item.id === conditionId)
      if (targetCondition)
        Object.assign(targetCondition, newCondition)
    })
    handleInputsChange(newInputs)
  }

  const handleToggleConditionLogicalOperator: HandleToggleConditionLogicalOperator = () => {
    const newInputs = produce(inputsRef.value, (draft) => {
      draft.logical_operator = draft.logical_operator === LogicalOperator.and ? LogicalOperator.or : LogicalOperator.and
    })
    handleInputsChange(newInputs)
  }

  const handleAddSubVariableCondition: HandleAddSubVariableCondition = (conditionId: string, key?: string) => {
    const newInputs = produce(inputsRef.value, (draft) => {
      const condition = draft.break_conditions?.find(item => item.id === conditionId)
      if (!condition)
        return
      if (!condition?.sub_variable_condition) {
        condition.sub_variable_condition = {
          logical_operator: LogicalOperator.and,
          conditions: [],
        }
      }
      const subVarCondition = condition.sub_variable_condition
      if (subVarCondition) {
        if (!subVarCondition.conditions)
          subVarCondition.conditions = []

        const svcComparisonOperators = getOperators(VarType.string, { key: key || '' })

        subVarCondition.conditions.push({
          id: uuid4(),
          key: key || '',
          varType: VarType.string,
          comparison_operator: (svcComparisonOperators && svcComparisonOperators.length) ? svcComparisonOperators[0] : undefined,
          value: '',
        })
      }
    })
    handleInputsChange(newInputs)
  }

  const handleRemoveSubVariableCondition = (conditionId: string, subConditionId: string) => {
    const newInputs = produce(inputsRef.value, (draft) => {
      const condition = draft.break_conditions?.find(item => item.id === conditionId)
      if (!condition)
        return
      if (!condition?.sub_variable_condition)
        return
      const subVarCondition = condition.sub_variable_condition
      if (subVarCondition)
        subVarCondition.conditions = subVarCondition.conditions.filter(item => item.id !== subConditionId)
    })
    handleInputsChange(newInputs)
  }

  const handleUpdateSubVariableCondition: HandleUpdateSubVariableCondition = (conditionId, subConditionId, newSubCondition) => {
    const newInputs = produce(inputsRef.value, (draft) => {
      const targetCondition = draft.break_conditions?.find(item => item.id === conditionId)
      if (targetCondition && targetCondition.sub_variable_condition) {
        const targetSubCondition = targetCondition.sub_variable_condition.conditions.find(item => item.id === subConditionId)
        if (targetSubCondition)
          Object.assign(targetSubCondition, newSubCondition)
      }
    })
    handleInputsChange(newInputs)
  }

  const handleToggleSubVariableConditionLogicalOperator: HandleToggleSubVariableConditionLogicalOperator = (conditionId) => {
    const newInputs = produce(inputsRef.value, (draft) => {
      const targetCondition = draft.break_conditions?.find(item => item.id === conditionId)
      if (targetCondition && targetCondition.sub_variable_condition)
        targetCondition.sub_variable_condition.logical_operator = targetCondition.sub_variable_condition.logical_operator === LogicalOperator.and ? LogicalOperator.or : LogicalOperator.and
    })
    handleInputsChange(newInputs)
  }

  const handleUpdateLoopCount = (value: number) => {
    const newInputs = produce(inputsRef.value, (draft) => {
      draft.loop_count = value
    })
    handleInputsChange(newInputs)
  }

  const handleAddLoopVariable = () => {
    const newInputs = produce(inputsRef.value, (draft) => {
      if (!draft.loop_variables)
        draft.loop_variables = []

      draft.loop_variables.push({
        id: uuid4(),
        label: '',
        var_type: VarType.string,
        value_type: ValueType.constant,
        value: '',
      })
    })
    handleInputsChange(newInputs)
  }

  const handleRemoveLoopVariable = (id: string) => {
    const newInputs = produce(inputsRef.value, (draft) => {
      draft.loop_variables = draft.loop_variables?.filter(item => item.id !== id)
    })
    handleInputsChange(newInputs)
  }

  const handleUpdateLoopVariable = (id: string, updateData: any) => {
    const loopVariables = inputsRef.value.loop_variables || []
    const index = loopVariables.findIndex(item => item.id === id)
    const newInputs = produce(inputsRef.value, (draft) => {
      if (index > -1) {
        draft.loop_variables![index] = {
          ...draft.loop_variables![index],
          ...updateData,
        }
      }
    })
    handleInputsChange(newInputs)
  }

  return {
    readOnly,
    inputs,
    filterInputVar,
    childrenNodeVars,
    loopChildrenNodes,
    handleAddCondition,
    handleRemoveCondition,
    handleUpdateCondition,
    handleToggleConditionLogicalOperator,
    handleAddSubVariableCondition,
    handleUpdateSubVariableCondition,
    handleRemoveSubVariableCondition,
    handleToggleSubVariableConditionLogicalOperator,
    handleUpdateLoopCount,
    changeErrorResponseMode,
    handleAddLoopVariable,
    handleRemoveLoopVariable,
    handleUpdateLoopVariable,
  }
}

export default useConfig
