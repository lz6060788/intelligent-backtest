<template>
  <div class="mt-2">
    <div class="space-y-4 px-4 pb-4">
      <template v-if="!isEnableGroup">
        <VarGroupItem
          :read-only="readOnly"
          :node-id="id"
          :payload="{
            output_type: inputs.output_type,
            variables: inputs.variables,
          }"
          :on-change="handleListOrTypeChange"
          :group-enabled="false"
          :available-vars="getAvailableVars(id, 'target', filterVar(inputs.output_type), true)"
        />
      </template>
      <template v-else>
        <div>
          <div class="space-y-2">
            <div v-for="(item, index) in inputs.advanced_settings?.groups" :key="item.groupId">
              <VarGroupItem
                :read-only="readOnly"
                :node-id="id"
                :payload="item"
                :on-change="handleListOrTypeChangeInGroup(item.groupId)"
                :group-enabled="true"
                :can-remove="!readOnly && inputs.advanced_settings?.groups.length > 1"
                :on-remove="handleGroupRemoved(item.groupId)"
                :on-group-name-change="handleVarGroupNameChange(item.groupId)"
                :available-vars="getAvailableVars(id, item.groupId, filterVar(item.output_type), true)"
              />
              <Split v-if="index !== inputs.advanced_settings?.groups.length - 1" class="my-4" />
            </div>
          </div>
          <AddButton
            class="mt-2"
            :text="t(`${i18nPrefix}.addGroup`)"
            :on-click="handleAddGroup"
          />
        </div>
      </template>
    </div>
    <Split />
    <div :class="cn('px-4 pt-4', isEnableGroup ? 'pb-4' : 'pb-2')">
      <Field
        :title="t(`${i18nPrefix}.aggregationGroup`)"
        :tooltip="t(`${i18nPrefix}.aggregationGroupTip`)!"
      >
        <template #operations>
          <el-switch
            :model-value="isEnableGroup"
            @update:model-value="handleGroupEnabledChange"
            size="default"
            :disabled="readOnly"
          />
        </template>
      </Field>
    </div>
    <template v-if="isEnableGroup">
      <Split />
      <OutputVars>
        <VarItem
          v-for="(item, index) in inputs.advanced_settings?.groups"
          :key="index"
          :name="`${item.group_name}.output`"
          :type="item.output_type"
          :description="t(`${i18nPrefix}.outputVars.varDescribe`, {
            groupName: item.group_name,
          })"
        />
      </OutputVars>
    </template>
    <RemoveEffectVarConfirm
      :is-show="isShowRemoveVarConfirm"
      :on-cancel="hideRemoveVarConfirm"
      :on-confirm="onRemoveVarConfirm"
    />
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ElSwitch } from 'element-plus'
import Field from '../_base/components/field.vue'
import RemoveEffectVarConfirm from '../_base/components/remove-effect-var-confirm.vue'
import useConfig from './use-config'
import type { VariableAssignerNodeType } from './types'
import VarGroupItem from './components/var-group-item.vue'
import cn from '@/utils/classnames'
import type { NodePanelProps } from '@/types/node'
import Split from '../_base/components/split.vue'
import OutputVars, { VarItem } from '../_base/components/output-vars.vue'
import AddButton from '../_base/components/add-button.vue'

const i18nPrefix = 'workflow.nodes.variableAssigner'

const props = defineProps<NodePanelProps<VariableAssignerNodeType>>()

const { id, data } = props
const { t } = useI18n()

const {
  readOnly,
  inputs,
  handleListOrTypeChange,
  isEnableGroup,
  handleGroupEnabledChange,
  handleAddGroup,
  handleListOrTypeChangeInGroup,
  handleGroupRemoved,
  handleVarGroupNameChange,
  isShowRemoveVarConfirm,
  hideRemoveVarConfirm,
  onRemoveVarConfirm,
  getAvailableVars,
  filterVar,
} = useConfig(id, data)
</script>

