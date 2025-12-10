import type { VariableAssignerNodeType } from '../../types'
import type { ValueSelector } from '@/types'
import { cloneDeep } from 'lodash-es'

type Params = {
  id: string
  inputs: VariableAssignerNodeType
  setInputs: (newInputs: VariableAssignerNodeType) => void
}
function useVarList({
  inputs,
  setInputs,
}: Params) {
  const handleVarListChange = (newList: ValueSelector[]) => {
    const draft = cloneDeep(inputs)
    draft.variables = newList
    setInputs(draft)
  }

  const handleAddVariable = () => {
    const draft = cloneDeep(inputs)
    draft.variables.push([])
    setInputs(draft)
  }
  return {
    handleVarListChange,
    handleAddVariable,
  }
}

export default useVarList
