import { computed, type Ref, ref, watch } from 'vue'
import { v4 as uuid4 } from 'uuid'
import type {
  ValueSelector,
  Var,
} from '@/types'
import { VarType } from '@/types'
import { LogicalOperator } from './types'
import type {
  Condition,
  IfElseNodeType,
} from './types'
import {
  branchNameCorrect,
  getOperators,
} from './utils'
import useIsVarFileAttribute from './use-is-var-file-attribute.ts'
import useNodeCrud from '@/components/workflow/nodes/_base/hooks/use-node-crud'
import {
  useEdgeInteractions,
  useNodesReadOnly,
  useWorkflowInstance,
} from '@/components/workflow/hooks'
import useAvailableVarList from '@/components/workflow/nodes/_base/hooks/use-available-var-list'
import { useVueFlow } from '@vue-flow/core'
import { cloneDeep } from 'lodash-es'

const useConfig = (id: string, payload: Ref<IfElseNodeType>) => {
  const { instanceId } = useWorkflowInstance()
  const store = useVueFlow(instanceId)
  const { updateNodeDimensions } = store
  const { nodesReadOnly: readOnly } = useNodesReadOnly()
  const { handleEdgeDeleteByDeleteBranch } = useEdgeInteractions()
  const { setInputs } = useNodeCrud<IfElseNodeType>(id)

  const filterVar = () => true

  const {
    availableVars,
    availableNodesWithParent,
  } = useAvailableVarList(id, {
    onlyLeafNodeVar: false,
    filterVar: filterVar,
  })

  const filterNumberVar = (varPayload: Var) => {
    return varPayload.type === VarType.number
  }

  const {
    getIsVarFileAttribute,
  } = useIsVarFileAttribute({
    nodeId: id,
    isInIteration: payload.value.isInIteration,
    isInLoop: payload.value.isInLoop,
  })

  const varsIsVarFileAttribute = computed(() => {
    const conditions: Record<string, boolean> = {}
    payload.value.cases?.forEach((c) => {
      c.conditions.forEach((condition) => {
        conditions[condition.id] = getIsVarFileAttribute(condition.variable_selector!)
      })
    })
    return conditions
  })

  const {
    availableVars: availableNumberVars,
    availableNodesWithParent: availableNumberNodesWithParent,
  } = useAvailableVarList(id, {
    onlyLeafNodeVar: false,
    filterVar: filterNumberVar,
  })

  const handleAddCase = () => {
    const draft = cloneDeep(payload.value)
    if (draft.cases) {
      const case_id = uuid4()
      draft.cases.push({
        case_id,
        logical_operator: LogicalOperator.and,
        conditions: [],
      })
      if (draft._targetBranches) {
        const elseCaseIndex = draft._targetBranches.findIndex((branch) => branch.id === 'false')
        if (elseCaseIndex > -1) {
          draft._targetBranches = branchNameCorrect([
            ...draft._targetBranches.slice(0, elseCaseIndex),
            {
              id: case_id,
              name: '',
            },
            ...draft._targetBranches.slice(elseCaseIndex),
          ])
        }
      }
    }
    setInputs(draft)
  }

  const handleRemoveCase = (caseId: string) => {
    const draft = cloneDeep(payload.value)
    draft.cases = draft.cases?.filter(item => item.case_id !== caseId)

    if (draft._targetBranches)
      draft._targetBranches = branchNameCorrect(draft._targetBranches.filter(branch => branch.id !== caseId))

    handleEdgeDeleteByDeleteBranch(id, caseId)
    setInputs(draft)
  }

  // const handleSortCase = (newCases: (CaseItem & { id: string })[]) => {
  //   const newInputs = produce(inputs, (draft) => {
  //     draft.cases = newCases.filter(Boolean).map(item => ({
  //       id: item.id,
  //       case_id: item.case_id,
  //       logical_operator: item.logical_operator,
  //       conditions: item.conditions,
  //     }))

  //     draft._targetBranches = branchNameCorrect([
  //       ...newCases.filter(Boolean).map(item => ({ id: item.case_id, name: '' })),
  //       { id: 'false', name: '' },
  //     ])
  //   })
  //   setInputs(newInputs)
  //   updateNodeDimensions(id)
  // }

  const handleAddCondition = (caseId: string, valueSelector: ValueSelector, varItem: Var) => {
    const draft = cloneDeep(payload.value)
    const targetCase = draft.cases?.find(item => item.case_id === caseId)
    if (targetCase) {
      targetCase.conditions.push({
        id: uuid4(),
        varType: varItem.type,
        variable_selector: valueSelector,
        comparison_operator: getOperators(varItem.type, getIsVarFileAttribute(valueSelector) ? { key: valueSelector.slice(-1)[0]! } : undefined)[0],
        value: (varItem.type === VarType.boolean || varItem.type === VarType.arrayBoolean) ? false : '',
      })
    }
    setInputs(draft)
  }

  const handleRemoveCondition = (caseId: string, conditionId: string) => {
    const draft = cloneDeep(payload.value)
    const targetCase = draft.cases?.find(item => item.case_id === caseId)
    if (targetCase)
      targetCase.conditions = targetCase.conditions.filter(item => item.id !== conditionId)
    setInputs(draft)
  }

  const handleUpdateCondition = (caseId: string, conditionId: string, newCondition: Condition) => {
    const draft = cloneDeep(payload.value)
    const targetCase = draft.cases?.find(item => item.case_id === caseId)
    if (targetCase) {
      const targetCondition = targetCase.conditions.find(item => item.id === conditionId)
      if (targetCondition)
        Object.assign(targetCondition, newCondition)
    }
    setInputs(draft)
  }

  const handleToggleConditionLogicalOperator = (caseId: string) => {
    const draft = cloneDeep(payload.value)
    const targetCase = draft.cases?.find(item => item.case_id === caseId)
    if (targetCase)
      targetCase.logical_operator = targetCase.logical_operator === LogicalOperator.and ? LogicalOperator.or : LogicalOperator.and
    setInputs(draft)
  }

  const handleAddSubVariableCondition = (caseId: string, conditionId: string, key?: string) => {
    const draft = cloneDeep(payload.value)
    const condition = draft.cases?.find(item => item.case_id === caseId)?.conditions.find(item => item.id === conditionId)
    if (!condition)
      return
    if (!condition?.sub_variable_condition) {
      condition.sub_variable_condition = {
        case_id: uuid4(),
        logical_operator: LogicalOperator.and,
        conditions: [],
      }
    }
    const subVarCondition = condition.sub_variable_condition
    if (subVarCondition) {
      if (!subVarCondition.conditions)
        subVarCondition.conditions = []

      subVarCondition.conditions.push({
        id: uuid4(),
        key: key || '',
        varType: VarType.string,
        comparison_operator: undefined,
        value: '',
      })
    }
    setInputs(draft)
  }

  const handleRemoveSubVariableCondition = (caseId: string, conditionId: string, subConditionId: string) => {
    const draft = cloneDeep(payload.value)
    const condition = draft.cases?.find(item => item.case_id === caseId)?.conditions.find(item => item.id === conditionId)
    if (!condition)
      return
    if (!condition?.sub_variable_condition)
      return
    const subVarCondition = condition.sub_variable_condition
    if (subVarCondition)
      subVarCondition.conditions = subVarCondition.conditions.filter(item => item.id !== subConditionId)
    setInputs(draft)
  }

  const handleUpdateSubVariableCondition = (caseId: string, conditionId: string, subConditionId: string, newSubCondition: Condition) => {
    const draft = cloneDeep(payload.value)
    const targetCase = draft.cases?.find(item => item.case_id === caseId)
    if (targetCase) {
      const targetCondition = targetCase.conditions.find(item => item.id === conditionId)
      if (targetCondition && targetCondition.sub_variable_condition) {
        const targetSubCondition = targetCondition.sub_variable_condition.conditions.find(item => item.id === subConditionId)
        if (targetSubCondition)
          Object.assign(targetSubCondition, newSubCondition)
      }
    }
    setInputs(draft)
  }

  const handleToggleSubVariableConditionLogicalOperator = (caseId: string, conditionId: string) => {
    const draft = cloneDeep(payload.value)
    const targetCase = draft.cases?.find(item => item.case_id === caseId)
    if (targetCase) {
      const targetCondition = targetCase.conditions.find(item => item.id === conditionId)
      if (targetCondition && targetCondition.sub_variable_condition)
        targetCondition.sub_variable_condition.logical_operator = targetCondition.sub_variable_condition.logical_operator === LogicalOperator.and ? LogicalOperator.or : LogicalOperator.and
    }
    setInputs(draft)
  }

  return {
    readOnly,
    filterVar,
    filterNumberVar,
    handleAddCase,
    handleRemoveCase,
    // handleSortCase,
    handleAddCondition,
    handleRemoveCondition,
    handleUpdateCondition,
    handleToggleConditionLogicalOperator,
    handleAddSubVariableCondition,
    handleUpdateSubVariableCondition,
    handleRemoveSubVariableCondition,
    handleToggleSubVariableConditionLogicalOperator,
    nodesOutputVars: availableVars,
    availableNodes: availableNodesWithParent,
    nodesOutputNumberVars: availableNumberVars,
    availableNumberNodes: availableNumberNodesWithParent,
    varsIsVarFileAttribute,
  }
}

export default useConfig
