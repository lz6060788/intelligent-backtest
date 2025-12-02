import { produce } from 'immer'
import type { VariableAssignerNodeType } from '../../types'
import type { ValueSelector } from '@/types'

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
    const newInputs = produce(inputs, (draft) => {
      draft.variables = newList
    })
    setInputs(newInputs)
  }

  const handleAddVariable = () => {
    const newInputs = produce(inputs, (draft) => {
      draft.variables.push([])
    })
    setInputs(newInputs)
  }
  return {
    handleVarListChange,
    handleAddVariable,
  }
}

export default useVarList
