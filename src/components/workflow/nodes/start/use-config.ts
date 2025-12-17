import type { StartNodeType } from './types'
import { ChangeType } from '@/types'
import type { InputVar, MoreInfo, ValueSelector } from '@/types'
import useNodeCrud from '@/components/workflow/nodes/_base/hooks/use-node-crud.ts'
import {
  // useIsChatMode,
  useNodesReadOnly,
  useWorkflow,
  // useWorkflowInstance
} from '@/components/workflow/hooks'
// import useInspectVarsCrud from '@/components/workflow/hooks/use-inspect-vars-crud'
import { hasDuplicateStr } from '@/utils/var'
import { ElNotification } from 'element-plus'
import i18n from '@/locales'
import { computed, ref, type Ref } from 'vue'
import { cloneDeep } from 'lodash-es'

const useConfig = (id: string, payload: Ref<StartNodeType>) => {
  const t = i18n.global.t
  const { nodesReadOnly: readOnly } = useNodesReadOnly()
  // const { instanceId } = useWorkflowInstance()
  const { handleOutVarRenameChange, isVarUsedInNodes, removeUsedVarInNodes } = useWorkflow()
  const isChatMode = ref(false)

  const { setInputs } = useNodeCrud<StartNodeType>(id)
  const inputs = computed(() => payload.value)
  // const {
  //   deleteNodeInspectorVars,
  //   renameInspectVarName,
  //   nodesWithInspectVars,
  //   deleteInspectVar,
  // } = useInspectVarsCrud()

  const isShowAddVarModal = ref(false)
  const showAddVarModal = () => {
    isShowAddVarModal.value = true
  }
  const hideAddVarModal = () => {
    isShowAddVarModal.value = false
  }

  const isShowRemoveVarConfirm = ref(false)
  const showRemoveVarConfirm = () => {
    isShowRemoveVarConfirm.value = true
  }
  const hideRemoveVarConfirm = () => {
    isShowRemoveVarConfirm.value = false
  }

  const removedVar = ref<ValueSelector>([])
  const removedIndex = ref(0)

  const handleVarListChange = (newList: InputVar[], moreInfo?: { index: number; payload: MoreInfo }) => {
    if (moreInfo?.payload?.type === ChangeType.remove) {
      // // 注意：这些变量当前被注释掉了，需要根据实际情况处理
      // const varId = nodesWithInspectVars.value?.find(node => node.nodeId === id)?.vars.find((varItem) => {
      //   return varItem.name === moreInfo?.payload?.payload?.beforeKey
      // })?.id
      // if(varId)
      //   deleteInspectVar(id, varId)

      if (isVarUsedInNodes([id, moreInfo?.payload?.payload?.beforeKey || ''])) {
        showRemoveVarConfirm()
        removedVar.value = [id, moreInfo?.payload?.payload?.beforeKey || '']
        removedIndex.value = moreInfo?.index as number
        return
      }
    }


    const newInputs = cloneDeep(inputs.value)
    if (moreInfo?.payload?.type === ChangeType.changeVarName) {
      const changedVar = newList[moreInfo.index]
      handleOutVarRenameChange(id, [id, newInputs.variables![moreInfo.index]?.variable || ''], [id, changedVar!.variable])
      // renameInspectVarName(id, inputs.value.variables[moreInfo.index].variable, changedVar.variable)
    }
    else if(moreInfo?.payload?.type !== ChangeType.remove) { // edit var type
      // deleteNodeInspectorVars(id)
    }
    newInputs.variables = newList
    setInputs(newInputs)
  }

  const removeVarInNode = () => {
    const newInputs = cloneDeep(inputs.value)
    newInputs.variables.splice(removedIndex.value, 1)
    setInputs(newInputs)
    removeUsedVarInNodes(removedVar.value)
    hideRemoveVarConfirm()
  }

  const handleAddVariable = (payload: InputVar) => {
    const newInputs = cloneDeep(inputs.value)
    newInputs.variables.push(payload)
    const newList = newInputs.variables
    let errorMsgKey = ''
    let typeName = ''
    if(hasDuplicateStr(newList.map(item => item.variable))) {
      errorMsgKey = 'appDebug.varKeyError.keyAlreadyExists'
      typeName = 'appDebug.variableConfig.varName'
    }
    else if(hasDuplicateStr(newList.map(item => item.label as string))) {
      errorMsgKey = 'appDebug.varKeyError.keyAlreadyExists'
      typeName = 'appDebug.variableConfig.labelName'
    }

    if (errorMsgKey) {
      ElNotification({
        type: 'error',
        message: t(errorMsgKey, { key: t(typeName) }),
      })
      return false
    }
    setInputs(newInputs)
    return true
  }

  return {
    readOnly,
    isChatMode,
    inputs,
    isShowAddVarModal,
    showAddVarModal,
    hideAddVarModal,
    handleVarListChange,
    handleAddVariable,
    isShowRemoveVarConfirm,
    hideRemoveVarConfirm,
    onRemoveVarConfirm: removeVarInNode,
  }
}

export default useConfig
