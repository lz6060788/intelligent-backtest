import type { OperatorOverviewNodeType } from './types'
import { BlockEnum, ChangeType, VarType, type InputVar, type MoreInfo, type ValueSelector, type Var } from '@/types'
import useNodeCrud from '@/components/workflow/nodes/_base/hooks/use-node-crud.ts'
import {
  useNodesReadOnly,
  useWorkflow,
} from '@/components/workflow/hooks'
import { computed, onMounted, ref, type Ref } from 'vue'
import { getOutputVars, transformVarType } from '@/components/workflow/nodes/operator-end/utils';
import { useI18n } from 'vue-i18n'
import type { OperatorStartNodeType } from '../operator-start/types'
import { cloneDeep } from 'lodash-es'

const useConfig = (id: string, payload: Ref<OperatorOverviewNodeType>) => {
  const { t } = useI18n()
  const { nodesReadOnly: readOnly } = useNodesReadOnly()

  const outputVars = computed(() => getOutputVars(payload.value.graph.nodes, payload.value.graph.edges).map(item => ({
    ...item,
    type: transformVarType(item.type!),
  })))

  const inputs = computed(() => payload.value.inputs)
  const inputsConfig = computed(() => {
    return (payload.value.graph.nodes.find(node => node.data?.type === BlockEnum.OperatorStart)?.data as OperatorStartNodeType)?.inputs || []
  });

  const { setInputs } = useNodeCrud<OperatorOverviewNodeType>(id)

  const handhleInputChange = (vairable: InputVar) => {
    return (value: ValueSelector) => {
      const newInputs = cloneDeep(inputs.value)
      newInputs[vairable.variable] = value
      console.log('handhleInputChange', vairable, value, newInputs)
      setInputs({
        ...payload.value,
        inputs: newInputs,
      })
    }
  }

  onMounted(() => {
    const newInputs = Object.keys(payload.value.inputs).filter(key => inputsConfig.value.some(item => item.variable === key)).reduce((acc, key) => {
      acc[key] = payload.value.inputs[key] || []
      return acc
    }, {} as Record<string, ValueSelector>)
    setInputs({
      ...payload.value,
      inputs: newInputs,
    })
  })

  return {
    readOnly,
    outputVars,
    inputs,
    inputsConfig,
    handhleInputChange,
  }
}

export default useConfig
