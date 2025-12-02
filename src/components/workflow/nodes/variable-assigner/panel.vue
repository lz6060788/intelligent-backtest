<template>
  <div class="mt-2">
    <div class="space-y-4 px-4 pb-4">
      <template v-if="!isEnableGroup">
        <VarGroupItem
          :read-only="readOnly"
          :node-id="id"
          :payload="{
            output_type: payload.output_type,
            variables: payload.variables,
          }"
          @change="handleListOrTypeChange"
          :group-enabled="false"
          :available-vars="getAvailableVars(id, 'target', filterVar(payload.output_type), false)"
        />
      </template>
      <template v-else>
        <div>
          <div class="space-y-2">
            <div v-for="(item, index) in payload.advanced_settings?.groups" :key="item.groupId">
              <VarGroupItem
                :read-only="readOnly"
                :node-id="id"
                :payload="item"
                @change="handleListOrTypeChangeInGroup(item.groupId, $event)"
                :group-enabled="true"
                :can-remove="!readOnly && payload.advanced_settings?.groups.length > 1"
                @remove="handleGroupRemoved(item.groupId)"
                @group-name-change="handleVarGroupNameChange(item.groupId, $event)"
                :available-vars="getAvailableVars(id, item.groupId, filterVar(item.output_type), false)"
              />
              <Split v-if="index !== payload.advanced_settings?.groups.length - 1" class="my-4" />
            </div>
          </div>
          <AddButton
            class="mt-2"
            :text="t(`${i18nPrefix}.addGroup`)"
            @click="handleAddGroup"
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
            @change="(val) => handleGroupEnabledChange(val as boolean)"
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
          v-for="(item, index) in payload.advanced_settings?.groups"
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
      @cancel="isShowRemoveVarConfirm = false"
      @confirm="onRemoveVarConfirm"
    />
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ElSwitch } from 'element-plus'
import Field from '@/components/base/field.vue'
import RemoveEffectVarConfirm from '@/components/workflow/nodes/_base/remove-effect-var-confrim/index.vue'
import useConfig from './use-config'
import type { VariableAssignerNodeType } from './types'
import VarGroupItem from './components/var-group-item.vue'
import cn from '@/utils/classnames'
import type { NodePanelProps } from '@/types'
import Split from '@/components/base/split.vue'
import OutputVars from '@/components/workflow/nodes/_base/output-var/index.vue'
import VarItem from '@/components/workflow/nodes/_base/output-var/var-item.vue'
import AddButton from '@/components/base/add-button/index.vue'
import { computed } from 'vue'

const i18nPrefix = 'workflow.nodes.variableAssigner'

const props = defineProps<NodePanelProps<VariableAssignerNodeType>>()

const { id, data } = props
const { t } = useI18n()

const payload = computed(() => props.data)

const {
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
} = useConfig(id, payload)
</script>

