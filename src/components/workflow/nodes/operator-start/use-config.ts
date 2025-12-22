import type { OperatorStartNodeType } from './types'
import { ChangeType, type InputVar, type MoreInfo, type ValueSelector, type Var } from '@/types'
import useNodeCrud from '@/components/workflow/nodes/_base/hooks/use-node-crud.ts'
import {
  useNodesReadOnly,
  useWorkflow,
} from '@/components/workflow/hooks'
import { computed, ref, type Ref } from 'vue'
import { cloneDeep } from 'lodash-es'
import { SET_OUTPUT_VARIABLES } from './constant'
import { hasDuplicateStr } from '@/utils/var'
import { ElNotification } from 'element-plus'
import { useI18n } from 'vue-i18n'

const useConfig = (id: string, payload: Ref<OperatorStartNodeType>) => {
  const { t } = useI18n()
  const { nodesReadOnly: readOnly } = useNodesReadOnly()
  const { handleOutVarRenameChange, isVarUsedInNodes, removeUsedVarInNodes } = useWorkflow()

  const { setInputs } = useNodeCrud<OperatorStartNodeType>(id)
  const inputs = computed(() => payload.value)

  // 内置变量
  const unusedVariables = computed(() => {
    return SET_OUTPUT_VARIABLES.filter(item => !inputs.value.variables.some(v => v.variable === item.variable))
  })

  const addVariable = (variable: Var) => {
    const newInputs = cloneDeep(inputs.value)
    newInputs.variables.push(variable)
    setInputs(newInputs)
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
  const removedVarType = ref<'variable' | 'input'>('variable')

  const beforeRemoveVar = (variable: Var) => {
    const varSelector: ValueSelector = [id, variable.variable]
    removedVar.value = varSelector
    removedVarType.value = 'variable'
    if (isVarUsedInNodes(varSelector)) {
      showRemoveVarConfirm()
    } else {
      removeVarInNode()
    }
  }

  const removeVarInNode = () => {
    const newInputs = cloneDeep(inputs.value)
    if (removedVarType.value === 'variable') {
      newInputs.variables = newInputs.variables.filter(item => item.variable !== removedVar.value[1])
      setInputs(newInputs)
      removeUsedVarInNodes(removedVar.value)
      hideRemoveVarConfirm()
    } else {
      newInputs.inputs.splice(removedIndex.value, 1)
      setInputs(newInputs)
      removeUsedVarInNodes(removedVar.value)
      hideRemoveVarConfirm()
    }
  }

  // 输入变量
  const handleInputVarListChange = (newList: InputVar[], moreInfo?: { index: number; payload: MoreInfo }) => {
    if (moreInfo?.payload?.type === ChangeType.remove) {
      if (isVarUsedInNodes([id, moreInfo?.payload?.payload?.beforeKey || ''])) {
        showRemoveVarConfirm()
        removedVar.value = [id, moreInfo?.payload?.payload?.beforeKey || '']
        removedVarType.value = 'input'
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
    newInputs.inputs = newList
    setInputs(newInputs)
  }

  const isShowAddVarModal = ref(false)
  const showAddVarModal = () => {
    isShowAddVarModal.value = true
  }
  const hideAddVarModal = () => {
    isShowAddVarModal.value = false
  }
  const handleAddInputVariable = (payload: InputVar) => {
    const newInputs = cloneDeep(inputs.value)
    newInputs.inputs.push(payload)
    const newList = newInputs.inputs
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
    inputs,
    addVariable,
    beforeRemoveVar,
    isShowRemoveVarConfirm,
    hideRemoveVarConfirm,
    onRemoveVarConfirm: removeVarInNode,
    unusedVariables,

    isShowAddVarModal,
    showAddVarModal,
    hideAddVarModal,
    handleInputVarListChange,
    handleAddInputVariable,
  }
}

export default useConfig
