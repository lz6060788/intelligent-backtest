import { ref, computed, watch, onMounted, onUnmounted, type Ref } from 'vue'
import { produce } from 'immer'
import { useWorkflow } from '@/components/workflow/hooks'
import { ErrorHandleTypeEnum, VarType, type ValueSelector } from '@/types'
import { getDefaultValue } from '@/components/workflow/nodes/_base/error-handle/utils'
import type { OutputVar } from '../../code/types'
// import useInspectVarsCrud from '../../../hooks/use-inspect-vars-crud'

// 类型定义
type Params<T> = {
  id: string
  inputs: Ref<T>
  setInputs: (newInputs: T) => void
  varKey?: string
  outputKeyOrders: Ref<string[]>
  onOutputKeyOrdersChange: (newOutputKeyOrders: string[]) => void
}

function useOutputVarList<T>({
  id,
  inputs,
  setInputs,
  varKey = 'outputs',
  outputKeyOrders = ref([]),
  onOutputKeyOrdersChange,
}: Params<T>) {
  // const {
  //   renameInspectVarName,
  //   deleteInspectVar,
  //   nodesWithInspectVars,
  // } = useInspectVarsCrud()

  const { handleOutVarRenameChange, isVarUsedInNodes, removeUsedVarInNodes } = useWorkflow()

  // record the first old name value
  const oldNameRecord = ref<Record<string, string>>({})

  let renameInspectNameWithDebounceTimeout: number | null = null
  const renameInspectNameWithDebounce = (id: string, newName: string) => {
    if (renameInspectNameWithDebounceTimeout) {
      clearTimeout(renameInspectNameWithDebounceTimeout)
    }
    renameInspectNameWithDebounceTimeout = setTimeout(() => {
      const oldName = oldNameRecord.value[id]
      // renameInspectVarName(id, oldName, newName)
      delete oldNameRecord.value[id]
    }, 500)
  }

  const handleVarsChange = (newVars: OutputVar, changedIndex?: number, newKey?: string) => {
    console.log('handleVarsChange', newVars, changedIndex, newKey, inputs.value)
    const newInputs = produce(inputs.value, (draft: any) => {
      draft[varKey] = newVars

      if ((inputs.value as any).type === 'BlockEnum.Code' && (inputs.value as any).error_strategy === ErrorHandleTypeEnum.defaultValue && varKey === 'outputs')
        draft.default_value = getDefaultValue(draft as any)
    })
    setInputs(newInputs)

    console.log('changedIndex', changedIndex)
    console.log('outputKeyOrders', outputKeyOrders.value)
    if (changedIndex !== undefined) {
      outputKeyOrders.value[changedIndex] = newKey!
      onOutputKeyOrdersChange(outputKeyOrders.value)
    }
    console.log('outputKeyOrders', outputKeyOrders.value)


    if (newKey) {
      handleOutVarRenameChange(id, [id, outputKeyOrders.value[changedIndex!]!], [id, newKey])
      if (!(id in oldNameRecord.value))
        oldNameRecord.value[id] = outputKeyOrders.value[changedIndex!]!
      renameInspectNameWithDebounce(id, newKey)
    }
    // else if (changedIndex === undefined) {
    //   const varId = nodesWithInspectVars.value.find(node => node.nodeId === id)?.vars.find((varItem) => {
    //     return varItem.name === Object.keys(newVars)[0]
    //   })?.id
    //   if (varId)
    //     deleteInspectVar(id, varId)
    // }
  }

  const generateNewKey = () => {
    let keyIndex = Object.keys((inputs.value as any)[varKey]).length + 1
    while (((inputs.value as any)[varKey])[`var_${keyIndex}`])
      keyIndex++
    return `var_${keyIndex}`
  }

  const handleAddVariable = () => {
    const newKey = generateNewKey()
    const newInputs = produce(inputs.value, (draft: any) => {
      draft[varKey] = {
        ...draft[varKey],
        [newKey]: {
          type: VarType.string,
          children: null,
        },
      }

      if ((inputs.value as any).type === 'BlockEnum.Code' && (inputs.value as any).error_strategy === ErrorHandleTypeEnum.defaultValue && varKey === 'outputs')
        draft.default_value = getDefaultValue(draft as any)
    })
    setInputs(newInputs)
    onOutputKeyOrdersChange([...outputKeyOrders.value, newKey])
  }

  const isShowRemoveVarConfirm = ref(false)
  const showRemoveVarConfirm = () => { isShowRemoveVarConfirm.value = true }
  const hideRemoveVarConfirm = () => { isShowRemoveVarConfirm.value = false }
  const removedVar = ref<ValueSelector>([])
  const removeVarInNode = () => {
    // const varId = nodesWithInspectVars.value.find(node => node.nodeId === id)?.vars.find((varItem) => {
    //   return varItem.name === removedVar.value[1]
    // })?.id
    // if (varId)
    //   deleteInspectVar(id, varId)
    removeUsedVarInNodes(removedVar.value)
    hideRemoveVarConfirm()
  }

  const handleRemoveVariable = (index: number) => {
    const key = outputKeyOrders.value[index]!

    if (isVarUsedInNodes([id, key])) {
      showRemoveVarConfirm()
      removedVar.value = [id, key]
      return
    }

    const newInputs = produce(inputs.value, (draft: any) => {
      delete draft[varKey][key]

      if ((inputs.value as any).type === 'BlockEnum.Code' && (inputs.value as any).error_strategy === ErrorHandleTypeEnum.defaultValue && varKey === 'outputs')
        draft.default_value = getDefaultValue(draft as any)
    })
    setInputs(newInputs)
    onOutputKeyOrdersChange(outputKeyOrders.value.filter((_, i) => i!== index))
    // const varId = nodesWithInspectVars.value.find(node => node.nodeId === id)?.vars.find((varItem) => {
    //   return varItem.name === key
    // })?.id
    // if (varId)
    //   deleteInspectVar(id, varId)
  }

  return {
    handleVarsChange,
    handleAddVariable,
    handleRemoveVariable,
    isShowRemoveVarConfirm,
    hideRemoveVarConfirm,
    onRemoveVarConfirm: removeVarInNode,
  }
}
export default useOutputVarList