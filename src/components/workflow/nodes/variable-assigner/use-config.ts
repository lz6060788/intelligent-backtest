import { cloneDeep, debounce } from 'lodash-es';
import { v4 as uuid4 } from 'uuid'
import type { ValueSelector, Var } from '@/types'
import { VarType } from '@/types'
import type { VarGroupItem, VariableAssignerNodeType } from './types'
import { useGetAvailableVars } from './hooks'
import useNodeCrud from '@/components/workflow/nodes/_base/hooks/use-node-crud'

import {
  useNodesReadOnly,
  useWorkflow,
} from '@/components/workflow/hooks'
import { computed, ref, type Ref } from 'vue';
// import useInspectVarsCrud from '@/components/workflow/hooks/use-inspect-vars-crud'

const useConfig = (id: string, payload: Ref<VariableAssignerNodeType>) => {
  // const {
  //   deleteNodeInspectorVars,
  //   renameInspectVarName,
  // } = useInspectVarsCrud()
  const { nodesReadOnly: readOnly } = useNodesReadOnly()
  const { handleOutVarRenameChange, isVarUsedInNodes, removeUsedVarInNodes } = useWorkflow()

  const { setInputs } = useNodeCrud<VariableAssignerNodeType>(id)
  const isEnableGroup = computed(() => !!payload.value.advanced_settings?.group_enabled)

  // Not Enable Group
  const handleListOrTypeChange = (_payload: VarGroupItem) => {
    setInputs({
      ...payload.value,
      ..._payload,
    })
  }

  const handleListOrTypeChangeInGroup = (groupId: string, _payload: VarGroupItem) => {
    const index = payload.value.advanced_settings.groups.findIndex(item => item.groupId === groupId)
    const draft = cloneDeep(payload.value)
    draft.advanced_settings.groups[index] = {
      ...draft.advanced_settings.groups[index],
      ..._payload,
    }
    setInputs(draft)
  }

  const getAvailableVars = useGetAvailableVars()
  const filterVar = (varType: VarType) => {
    return (v: Var) => {
      if (varType === VarType.any)
        return true
      if (v.type === VarType.any)
        return true
      return v.type === varType
    }
  }

  const isShowRemoveVarConfirm = ref(false)

  const removedVars = ref<ValueSelector[]>([])
  const removeType = ref<'group' | 'enableChanged'>('group')
  const removedGroupIndex = ref<number>(-1)
  const handleGroupRemoved = (groupId: string) => {
    const index = payload.value.advanced_settings.groups.findIndex(item => item.groupId === groupId)
    if (isVarUsedInNodes([id, payload.value.advanced_settings.groups[index]!.group_name, 'output'])) {
      isShowRemoveVarConfirm.value = true
      removedVars.value = [[id, payload.value.advanced_settings.groups[index]!.group_name, 'output']]
      removeType.value = 'group'
      removedGroupIndex.value = index
      return
    }
    const draft = cloneDeep(payload.value)
    draft.advanced_settings.groups.splice(index, 1)
    setInputs(draft)
  }

  const handleGroupEnabledChange = (enabled: boolean) => {
    const draft = cloneDeep(payload.value)
    if (!draft.advanced_settings)
      draft.advanced_settings = { group_enabled: false, groups: [] }
    console.log('draft.advanced_settings', draft.advanced_settings)
    if (enabled) {
      console.log('draft.advanced_settings.groups.length', draft.advanced_settings.groups.length)
      if (draft.advanced_settings.groups.length === 0) {
        console.log('draft.advanced_settings.groups.length === 0')
        const DEFAULT_GROUP_NAME = 'Group1'
        draft.advanced_settings.groups = [{
          output_type: draft.output_type,
          variables: draft.variables,
          group_name: DEFAULT_GROUP_NAME,
          groupId: uuid4(),
        }]

        handleOutVarRenameChange(id, [id, 'output'], [id, DEFAULT_GROUP_NAME, 'output'])
      }
    }
    else {
      if (draft.advanced_settings.groups.length > 0) {
        if (draft.advanced_settings.groups.length > 1) {
          const useVars = draft.advanced_settings.groups.filter((item, index) => index > 0 && isVarUsedInNodes([id, item.group_name, 'output']))
          if (useVars.length > 0) {
            isShowRemoveVarConfirm.value = true
            removedVars.value = useVars.map(item => [id, item.group_name, 'output'])
            removeType.value = 'enableChanged'
            return
          }
        }
        draft.output_type = draft.advanced_settings.groups[0]!.output_type
        draft.variables = draft.advanced_settings.groups[0]!.variables
        handleOutVarRenameChange(id, [id, draft.advanced_settings.groups[0]!.group_name, 'output'], [id, 'output'])
      }
    }
    draft.advanced_settings.group_enabled = enabled
    setInputs(draft)
    // deleteNodeInspectorVars(id)
  }

  const handleAddGroup = () => {
    let maxInGroupName = 1
    payload.value.advanced_settings.groups.forEach((item) => {
      const match = /(\d+)$/.exec(item.group_name)
      if (match) {
        const num = Number.parseInt(match[1]!, 10)
        if (num > maxInGroupName)
          maxInGroupName = num
      }
    })
    const draft = cloneDeep(payload.value)
    draft.advanced_settings.groups.push({
      output_type: VarType.any,
      variables: [],
      group_name: `Group${maxInGroupName + 1}`,
      groupId: uuid4(),
    })
    setInputs(draft)
    // deleteNodeInspectorVars(id)
  }

  // record the first old name value
  const oldNameRecord = ref<Record<string, string>>({})

  // const {
  //   run: renameInspectNameWithDebounce,
  // } = useDebounceFn(
  //   (id: string, newName: string) => {
  //     const oldName = oldNameRecord.current[id]
  //     renameInspectVarName(id, oldName, newName)
  //     delete oldNameRecord.current[id]
  //   },
  //   { wait: 500 },
  // )
  const renameInspectNameWithDebounce = debounce((id: string, newName: string) => {
    // const oldName = oldNameRecord.value[id]
    // renameInspectVarName(id, oldName, newName)
    delete oldNameRecord.value[id]
  }, 500)

  const handleVarGroupNameChange = (groupId: string, name: string) => {
    console.log(groupId, name)
    const index = payload.value.advanced_settings.groups.findIndex(item => item.groupId === groupId)
    const draft = cloneDeep(payload.value)
    draft.advanced_settings.groups[index]!.group_name = name
    handleOutVarRenameChange(id, [id, payload.value.advanced_settings.groups[index]!.group_name, 'output'], [id, name, 'output'])
    setInputs(draft)
    if(!(id in oldNameRecord.value))
      oldNameRecord.value[id] = payload.value.advanced_settings.groups[index]!.group_name
    renameInspectNameWithDebounce(id, name)
}

  const onRemoveVarConfirm = () => {
    removedVars.value.forEach((v) => {
      removeUsedVarInNodes(v)
    })
    isShowRemoveVarConfirm.value = false
    if (removeType.value === 'group') {
      const draft = cloneDeep(payload.value)
      draft.advanced_settings.groups.splice(removedGroupIndex.value, 1)
      setInputs(draft)
    }
    else {
      // removeType === 'enableChanged' to enabled
      const draft = cloneDeep(payload.value)
      draft.advanced_settings.group_enabled = false
      draft.output_type = draft.advanced_settings.groups[0]!.output_type
      draft.variables = draft.advanced_settings.groups[0]!.variables
      setInputs(draft)
    }
  }

  return {
    readOnly,
    handleListOrTypeChange,
    isEnableGroup,
    handleGroupEnabledChange,
    handleAddGroup,
    handleListOrTypeChangeInGroup,
    handleGroupRemoved,
    handleVarGroupNameChange,
    isShowRemoveVarConfirm,
    onRemoveVarConfirm,
    getAvailableVars,
    filterVar,
  }
}

export default useConfig
