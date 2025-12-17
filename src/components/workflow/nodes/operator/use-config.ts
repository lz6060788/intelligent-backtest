import { computed, onMounted, ref, unref, watch, type Ref } from 'vue'
import { v4 as uuid4 } from 'uuid'
import { useVueFlow } from '@vue-flow/core'
import {
  useNodesReadOnly,
  useWorkflow,
} from '../../hooks'
import { ValueType, VarType } from '@/types'
import type { Var } from '@/types'
import { toNodeOutputVars } from '@/components/workflow/nodes/_base/variable/utils'
import { operators } from './constant/operators'
import {
  OperatorArgumentTypeEnum,
  OperatorArgumentValueTypeEnum,
  type OperatorNodeType,
} from './types'
import { useWorkflowInstance } from '@/components/workflow/hooks/use-workflow-instance'
import { useNodeCrud } from '../_base/hooks'
import { cloneDeep } from 'lodash-es'

/**
 * 使用配置的composable
 * @param id 节点ID
 * @param payload 循环节点类型数据
 */
const useConfig = (id: string, payload: Ref<OperatorNodeType>) => {
  const { instanceId } = useWorkflowInstance()

  const { nodesReadOnly: readOnly } = useNodesReadOnly()

  const { setInputs } = useNodeCrud<OperatorNodeType>(id)

  const filterInputVar = (varPayload: Var) => {
    return [VarType.array, VarType.arrayString, VarType.arrayNumber, VarType.arrayObject, VarType.arrayFile].includes(varPayload.type)
  }

  const currentCalculatorTemplate = computed(() => {
    return cloneDeep(operators.find(item => item.name === payload.value.operator))
  })

  const handleChangeCalculator = (operator: string) => {
    const fixedTemplateVariables = cloneDeep(operators.find(item => item.name === operator)?.inputs.fixedArguments || [])
    const restTemplateVariables = cloneDeep(operators.find(item => item.name === operator)?.inputs.restArguments || [])
    const minTemplateVariables = operators.find(item => item.name === operator)?.inputs.minArguments || 1
    const draft = cloneDeep(payload.value)
    draft.variables = []
    draft.alias = '';
    draft.operator = operator
    fixedTemplateVariables.forEach(item => {
      draft.variables.push({
        id: uuid4(),
        name: item.name || '',
        isRest: false,
        isConst: item?.type === OperatorArgumentTypeEnum.CONSTANT,
        type: item?.valueType[0] || OperatorArgumentValueTypeEnum.FLOAT,
        value: '',
      })
    })
    // 参数不足时，添加剩余参数
    if (restTemplateVariables.length && draft.variables.length < minTemplateVariables) {
      for (let i = draft.variables.length; i < minTemplateVariables; i++) {
        draft.variables.push({
          id: uuid4(),
          name: '',
          isRest: true,
          isConst: restTemplateVariables[0]?.type === OperatorArgumentTypeEnum.CONSTANT || false,
          type: restTemplateVariables[0]?.valueType[0] || OperatorArgumentValueTypeEnum.FLOAT,
          value: '',
        })
      }
    }
    setInputs(draft)
  }

  const handleChangeAlias = (alias: string) => {
    const draft = cloneDeep(payload.value)
    draft.alias = alias
    setInputs(draft)
  }

  const fixedVariables = computed(() => {
    return payload.value.variables.filter(item => !item.isRest)
  })

  const restVariables = computed(() => {
    return payload.value.variables.filter(item => item.isRest)
  })

  const handleAddVariable = () => {
    if (payload.value.variables.length >= currentCalculatorTemplate.value!.inputs.maxArguments) {
      return
    }
    const restArgumentTemplate = currentCalculatorTemplate.value?.inputs.restArguments[0]
    const draft = cloneDeep(payload.value)
    if (!draft.variables)
      draft.variables = []

    draft.variables.push({
      id: uuid4(),
      name: '',
      isRest: true,
      isConst: restArgumentTemplate?.type === OperatorArgumentTypeEnum.CONSTANT || false,
      type: restArgumentTemplate?.valueType[0] || OperatorArgumentValueTypeEnum.FLOAT,
      value: '',
    })
    setInputs(draft)
  }

  const handleRemoveVariable = (id: string) => {
    // if (payload.value.variables.length <= currentCalculatorTemplate.value!.inputs.minArguments) {
    //   return
    // }
    const draft = cloneDeep(payload.value)
    draft.variables = draft.variables?.filter(item => item.id !== id)
    setInputs(draft)
  }

  const handleUpdateVariable = (id: string, updateData: any) => {
    const draft = cloneDeep(payload.value)
    const index = draft.variables?.findIndex(item => item.id === id)
    if (index > -1 && draft.variables) {
      draft.variables![index] = {
        ...draft.variables![index]!,
        ...updateData,
      }
    }
    setInputs(draft)
  }

  return {
    readOnly,
    filterInputVar,
    handleChangeCalculator,
    handleChangeAlias,
    currentCalculatorTemplate,
    fixedVariables,
    restVariables,
    handleAddVariable,
    handleRemoveVariable,
    handleUpdateVariable,
  }
}

export default useConfig
