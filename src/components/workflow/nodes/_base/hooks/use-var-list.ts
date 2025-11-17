import { produce } from 'immer'
import type { Variable } from '@/types'
import { unref, type Ref } from 'vue'

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
    const newInputs = produce(unref(inputs), (draft: any) => {
      draft[varKey] = newList as Variable[]
    })
    setInputs(newInputs)
  }

  const handleAddVariable = () => {
    const newInputs = produce(unref(inputs), (draft: any) => {
      draft[varKey].push({
        variable: '',
        value_selector: [],
      })
    })
    setInputs(newInputs)
  }
  return {
    handleVarListChange,
    handleAddVariable,
  }
}

export default useVarList
