import useVarList from '../_base/hooks/use-var-list'
import type { EndNodeType } from './types'
import useNodeCrud from '@/components/workflow/nodes/_base/hooks/use-node-crud'
import {
  useNodesReadOnly,
} from '@/components/workflow/hooks'
import type { Ref } from 'vue'

const useConfig = (id: string, payload: Ref<EndNodeType>) => {
  const { nodesReadOnly: readOnly } = useNodesReadOnly()
  const { setInputs } = useNodeCrud<EndNodeType>(id)

  const { handleVarListChange, handleAddVariable } = useVarList<EndNodeType>({
    inputs: payload,
    setInputs: (newInputs) => {
      setInputs(newInputs)
    },
    varKey: 'outputs',
  })

  return {
    readOnly,
    handleVarListChange,
    handleAddVariable,
  }
}

export default useConfig
