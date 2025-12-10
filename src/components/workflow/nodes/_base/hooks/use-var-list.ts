import type { Variable } from '@/types'
import { unref, type Ref } from 'vue'
import { cloneDeep } from 'lodash-es'

type Params<T> = {
  inputs: Ref<T>
  setInputs: (newInputs: T) => void
  varKey?: string
}
function useVarList<T>({
  inputs,
  setInputs,
  varKey = 'variables',
}: Params<T>) {
  const handleVarListChange = (newList: Variable[] | string) => {
    const newInputs = cloneDeep(unref(inputs)) as any
    newInputs[varKey] = newList as Variable[]
    setInputs(newInputs)
  }

  const handleAddVariable = () => {
    const newInputs = cloneDeep(unref(inputs)) as any
    newInputs[varKey].push({
      variable: '',
      value_selector: [],
    })
    setInputs(newInputs)
  }
  return {
    handleVarListChange,
    handleAddVariable,
  }
}

export default useVarList
