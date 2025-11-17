import { useNodeDataUpdate } from '@/components/workflow/hooks'
import type { CommonNodeType } from '@/types'
const useNodeCrud = <T>(id: string) => {
  const { handleNodeDataUpdateWithSyncDraft } = useNodeDataUpdate()

  const setInputs = (newInputs: CommonNodeType<T>) => {
    handleNodeDataUpdateWithSyncDraft({
      id,
      data: newInputs,
    })
  }

  return {
    setInputs,
  }
}

export default useNodeCrud
