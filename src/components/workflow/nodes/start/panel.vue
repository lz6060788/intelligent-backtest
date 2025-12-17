<template>
  <div class="mt-2">
    <div class="space-y-4 px-4 pb-2">
      <Field
        :title="t(`${i18nPrefix}.inputField`)"
      >
        <template #operations>
          <AddButton v-if="!readOnly" @click="showAddVarModal" />
        </template>

        <VarList
          :readonly="readOnly"
          :list="inputs.variables || []"
          @change="handleVarListChange"
        />

        <div class="mt-4 space-y-1">
          <!-- <Split class="my-2" /> -->

          <!-- <VarItem
            v-if="isChatMode"
            readonly
            :payload="{ variable: 'sys.query' }"
          >
            <template #rightContent>
              <div class="text-xs font-normal text-text-tertiary">
                String
              </div>
            </template>
          </VarItem> -->

          <!-- <VarItem
            readonly
            :showLegacyBadge="!isChatMode"
            :payload="{ variable: 'sys.files' }"
          >
            <template #rightContent>
              <div class="text-xs font-normal text-text-tertiary">
                Array[File]
              </div>
            </template>
          </VarItem> -->

          <!-- <template v-if="isChatMode">
            <VarItem
              readonly
              :payload="{ variable: 'sys.dialogue_count' }"
            >
              <template #rightContent>
                <div class="text-xs font-normal text-text-tertiary">
                  Number
                </div>
              </template>
            </VarItem>

            <VarItem
              readonly
              :payload="{ variable: 'sys.conversation_id' }"
            >
              <template #rightContent>
                <div class="text-xs font-normal text-text-tertiary">
                  String
                </div>
              </template>
            </VarItem>
          </template> -->

          <VarItem
            readonly
            :payload="{ variable: 'sys.user_id' }"
          >
            <template #rightContent>
              <div class="text-xs font-normal text-text-tertiary">
                String
              </div>
            </template>
          </VarItem>

          <VarItem
            readonly
            :payload="{ variable: 'sys.app_id' }"
          >
            <template #rightContent>
              <div class="text-xs font-normal text-text-tertiary">
                String
              </div>
            </template>
          </VarItem>

          <VarItem
            readonly
            :payload="{ variable: 'sys.workflow_id' }"
          >
            <template #rightContent>
              <div class="text-xs font-normal text-text-tertiary">
                String
              </div>
            </template>
          </VarItem>

          <VarItem
            readonly
            :payload="{ variable: 'sys.workflow_run_id' }"
          >
            <template #rightContent>
              <div class="text-xs font-normal text-text-tertiary">
                String
              </div>
            </template>
          </VarItem>
        </div>
      </Field>
    </div>

    <ConfigVarModal
      v-if="isShowAddVarModal"
      :is-create="true"
      :support-file="true"
      :is-show="isShowAddVarModal"
      @close="hideAddVarModal"
      @confirm="handleAddVarConfirm"
      :var-keys="inputs.variables.map(v => v.variable)"
    />

    <RemoveEffectVarConfirm
      :is-show="isShowRemoveVarConfirm"
      @cancel="hideRemoveVarConfirm"
      @confirm="onRemoveVarConfirm"
    />
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import RemoveEffectVarConfirm from '../_base/remove-effect-var-confrim/index.vue'
import VarList from './components/var-list.vue'
import VarItem from './components/var-item.vue'
import useConfig from './use-config'
import type { StartNodeType } from './types'
// import Split from '../_base/components/split.vue'
import Field from '@/components/base/field.vue'
import AddButton from '@/components/base/add-button/index.vue'
import ConfigVarModal from '@/components/configuration/config-var/config-modal/index.vue'
import type { InputVar, NodePanelProps } from '@/types'
import { computed } from 'vue'

const i18nPrefix = 'workflow.nodes.start'

const props = defineProps<NodePanelProps<StartNodeType>>()

const { t } = useI18n()

const data = computed(() => props.data)
const {
  readOnly,
  isChatMode,
  inputs,
  isShowAddVarModal,
  showAddVarModal,
  handleAddVariable,
  hideAddVarModal,
  handleVarListChange,
  isShowRemoveVarConfirm,
  hideRemoveVarConfirm,
  onRemoveVarConfirm,
} = useConfig(props.id, data)

const handleAddVarConfirm = (payload: InputVar) => {
  console.log('handleAddVarConfirm', payload)
  const isValid = handleAddVariable(payload)
  if (!isValid) return
  hideAddVarModal()
}

</script>