import { ValueType, type ValueSelector, type Var } from '@/types'
import useNodeCrud from '@/components/workflow/nodes/_base/hooks/use-node-crud.ts'
import {
  useNodesReadOnly,
  useWorkflow,
} from '@/components/workflow/hooks'
import { computed, onMounted, ref, type Ref } from 'vue'
import { cloneDeep } from 'lodash-es'
import type { SearchItem, SearchNodeType } from './types'

const useConfig = (id: string, payload: Ref<SearchNodeType>) => {
  const { nodesReadOnly: readOnly } = useNodesReadOnly()

  const { setInputs } = useNodeCrud<SearchNodeType>(id)
  const inputs = computed(() => payload.value)

  const handleSearchItemChange = (index: number, item: Partial<SearchItem>) => {
    if (readOnly) return;

    if (!inputs.value.retrieve_params.items[index]) {
      return
    }
    const newInputs = cloneDeep(inputs.value)
    newInputs.retrieve_params.items[index] = {
      ...newInputs.retrieve_params.items[index]!,
      ...item,
    }
    setInputs(newInputs)
  }

  const handleSearchItemRemove = (index: number) => {
    if (readOnly) return;

    const newInputs = cloneDeep(inputs.value)
    newInputs.retrieve_params.items = newInputs.retrieve_params.items.filter((_, _index)  => _index !== index)
    setInputs(newInputs)
  }

  const handleSearchItemAdd = () => {
    if (readOnly) return;

    const newInputs = cloneDeep(inputs.value)
    newInputs.retrieve_params.items.push({
      search_query: { type: ValueType.constant, value:  '' },
      start_date: { type: ValueType.constant, value:  '' },
      end_date: { type: ValueType.constant, value:  '' }
    })
    setInputs(newInputs)
  }

  return {
    readOnly,
    inputs,
    handleSearchItemChange,
    handleSearchItemRemove,
    handleSearchItemAdd
  }
}

export default useConfig
