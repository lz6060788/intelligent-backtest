import type { CalculatorStartNodeType } from './types'
import type { ValueSelector, Var } from '@/types'
import useNodeCrud from '@/components/workflow/nodes/_base/hooks/use-node-crud.ts'
import {
  useNodesReadOnly,
  useWorkflow,
} from '@/components/workflow/hooks'
import { computed, ref, type Ref } from 'vue'
import { cloneDeep } from 'lodash-es'
import { SET_OUTPUT_VARIABLES } from './constant'

const useConfig = (id: string, payload: Ref<CalculatorStartNodeType>) => {
  const { nodesReadOnly: readOnly } = useNodesReadOnly()
  const { isVarUsedInNodes, removeUsedVarInNodes } = useWorkflow()

  const { setInputs } = useNodeCrud<CalculatorStartNodeType>(id)
  const inputs = computed(() => payload.value)

  const unusedVariables = computed(() => {
    return SET_OUTPUT_VARIABLES.filter(item => !inputs.value.variables.some(v => v.variable === item.variable))
  })

  const addVariable = (variable: Var) => {
    const newInputs = cloneDeep(inputs.value)
    newInputs.variables.push(variable)
    setInputs(newInputs)
  }

  const isShowRemoveVarConfirm = ref(false)
  const showRemoveVarConfirm = () => {
    isShowRemoveVarConfirm.value = true
  }
  const hideRemoveVarConfirm = () => {
    isShowRemoveVarConfirm.value = false
  }

  const removedVar = ref<ValueSelector>([])

  const beforeRemoveVar = (variable: Var) => {
    const varSelector: ValueSelector = [id, variable.variable]
    removedVar.value = varSelector
    if (isVarUsedInNodes(varSelector)) {
      showRemoveVarConfirm()
    } else {
      removeVarInNode()
    }
  }

  const removeVarInNode = () => {
    const newInputs = cloneDeep(inputs.value)
    newInputs.variables = newInputs.variables.filter(item => item.variable !== removedVar.value[1])
    setInputs(newInputs)
    removeUsedVarInNodes(removedVar.value)
    hideRemoveVarConfirm()
  }

  return {
    readOnly,
    inputs,
    addVariable,
    beforeRemoveVar,
    isShowRemoveVarConfirm,
    hideRemoveVarConfirm,
    onRemoveVarConfirm: removeVarInNode,
    unusedVariables
  }
}

export default useConfig
