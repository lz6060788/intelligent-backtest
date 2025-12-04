import { computed, ref, watch, type Ref } from 'vue'
import { produce } from 'immer'
import { v4 as uuid4 } from 'uuid'
import { useVueFlow } from '@vue-flow/core'
import {
  useNodesReadOnly,
  useWorkflow,
} from '../../hooks'
import { ValueType, VarType } from '@/types'
import type { ErrorHandleMode, ValueSelector, Var } from '@/types'
import { toNodeOutputVars } from '@/components/workflow/nodes/_base/variable/utils'
import { getOperators } from './utils'
import { LogicalOperator } from './type'
import type {
  Condition,
  LoopNodeType,
} from './type'
import useIsVarFileAttribute from './use-is-var-file-attribute'
import { useWorkflowInstance } from '@/components/workflow/hooks/use-workflow-instance'
import { useNodeCrud } from '../_base/hooks'

/**
 * 使用配置的composable
 * @param id 节点ID
 * @param payload 循环节点类型数据
 */
const useConfig = (id: string, payload: Ref<LoopNodeType>) => {
  const { instanceId  } = useWorkflowInstance()

  const { nodesReadOnly: readOnly } = useNodesReadOnly()

  const { setInputs } = useNodeCrud<LoopNodeType>(id)

  const filterInputVar = (varPayload: Var) => {
    return [VarType.array, VarType.arrayString, VarType.arrayNumber, VarType.arrayObject, VarType.arrayFile].includes(varPayload.type)
  }

  const { getLoopNodeChildren } = useWorkflow()
  const loopChildrenNodes = computed(() => [{ id, data: payload.value } as any, ...getLoopNodeChildren(id)])

  const childrenNodeVars = computed(() => {
    return toNodeOutputVars(
      loopChildrenNodes.value,
      false,
      undefined,
      [],
      [],
      {},
      []
    )
  })

  const {
    getIsVarFileAttribute,
  } = useIsVarFileAttribute({
    nodeId: id,
  })

  const changeErrorResponseMode = (item: { value: unknown }) => {
    const newInputs = produce(payload.value, (draft) => {
      draft.error_handle_mode = item.value as ErrorHandleMode
    })
    setInputs(newInputs)
  }

  const handleAddCondition = (valueSelector: ValueSelector, varItem: Var) => {
    console.log('handleAddCondition', valueSelector, varItem)
    const newInputs = produce(payload.value, (draft) => {
      if (!draft.break_conditions)
        draft.break_conditions = []

      draft.break_conditions?.push({
        id: uuid4(),
        varType: varItem.type,
        variable_selector: valueSelector,
        comparison_operator: getOperators(varItem.type, getIsVarFileAttribute(valueSelector) ? { key: valueSelector.slice(-1)[0]! } : undefined)[0],
        value: varItem.type === VarType.boolean ? 'false' : '',
      })
    })
    console.log('newInputs', newInputs)
    setInputs(newInputs)
  }

  const handleRemoveCondition = (conditionId: string) => {
    const newInputs = produce(payload.value, (draft) => {
      draft.break_conditions = draft.break_conditions?.filter(item => item.id !== conditionId)
    })
    setInputs(newInputs)
  }

  const handleUpdateCondition = (conditionId: string, newCondition: Condition) => {
    const newInputs = produce(payload.value, (draft) => {
      const targetCondition = draft.break_conditions?.find(item => item.id === conditionId)
      if (targetCondition)
        Object.assign(targetCondition, newCondition)
    })
    setInputs(newInputs)
  }

  const handleToggleConditionLogicalOperator = () => {
    const newInputs = produce(payload.value, (draft) => {
      draft.logical_operator = draft.logical_operator === LogicalOperator.and ? LogicalOperator.or : LogicalOperator.and
    })
    setInputs(newInputs)
  }

  const handleAddSubVariableCondition = (conditionId: string, key?: string) => {
    const newInputs = produce(payload.value, (draft) => {
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
    setInputs(newInputs)
  }

  const handleRemoveSubVariableCondition = (conditionId: string, subConditionId: string) => {
    const newInputs = produce(payload.value, (draft) => {
      const condition = draft.break_conditions?.find(item => item.id === conditionId)
      if (!condition)
        return
      if (!condition?.sub_variable_condition)
        return
      const subVarCondition = condition.sub_variable_condition
      if (subVarCondition)
        subVarCondition.conditions = subVarCondition.conditions.filter(item => item.id !== subConditionId)
    })
    setInputs(newInputs)
  }

  const handleUpdateSubVariableCondition = (conditionId: string, subConditionId: string, newSubCondition: Condition) => {
    const newInputs = produce(payload.value, (draft) => {
      const targetCondition = draft.break_conditions?.find(item => item.id === conditionId)
      if (targetCondition && targetCondition.sub_variable_condition) {
        const targetSubCondition = targetCondition.sub_variable_condition.conditions.find(item => item.id === subConditionId)
        if (targetSubCondition)
          Object.assign(targetSubCondition, newSubCondition)
      }
    })
    setInputs(newInputs)
  }

  const handleToggleSubVariableConditionLogicalOperator = (conditionId: string) => {
    const newInputs = produce(payload.value, (draft) => {
      const targetCondition = draft.break_conditions?.find(item => item.id === conditionId)
      if (targetCondition && targetCondition.sub_variable_condition)
        targetCondition.sub_variable_condition.logical_operator = targetCondition.sub_variable_condition.logical_operator === LogicalOperator.and ? LogicalOperator.or : LogicalOperator.and
    })
    setInputs(newInputs)
  }

  const handleUpdateLoopCount = (value: number) => {
    const newInputs = produce(payload.value, (draft) => {
      draft.loop_count = value
    })
    setInputs(newInputs)
  }

  const handleAddLoopVariable = () => {
    const newInputs = produce(payload.value, (draft) => {
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
    setInputs(newInputs)
  }

  const handleRemoveLoopVariable = (id: string) => {
    const newInputs = produce(payload.value, (draft) => {
      draft.loop_variables = draft.loop_variables?.filter(item => item.id !== id)
    })
    setInputs(newInputs)
  }

  const handleUpdateLoopVariable = (id: string, updateData: any) => {
    console.log('handleUpdateLoopVariable', id, updateData)
    const loopVariables = payload.value.loop_variables || []
    const index = loopVariables.findIndex(item => item.id === id)
    const newInputs = produce(payload.value, (draft) => {
      if (index > -1) {
        draft.loop_variables![index] = {
          ...draft.loop_variables![index],
          ...updateData,
        }
      }
    })
    setInputs(newInputs)
  }

  return {
    readOnly,
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
