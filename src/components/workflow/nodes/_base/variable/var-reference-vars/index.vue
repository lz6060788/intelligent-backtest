<template>
  <div>
    <template v-if="!hideSearch">
      <div
        :class="cn('var-search-input-wrapper mx-2 mb-2 mt-2', searchBoxClassName)"
        @click.stop
      >
        <el-input
          v-model="searchText"
          class="var-search-input"
          :placeholder="t('workflow.common.searchVar') || ''"
          @keydown="handleKeyDown"
          @clear="handleClear"
          @blur="onBlur"
          :autofocus="autoFocus"
          clearable
        >
          <template #prefix>
            <el-icon>
              <Search />
            </el-icon>
          </template>
        </el-input>
      </div>
      <div
        class="relative left-[-4px] h-[0.5px] bg-black/5"
        :style="{ width: 'calc(100% + 8px)' }"
      ></div>
    </template>

    <div v-if="filteredVars.length > 0" :class="cn('max-h-[85vh] overflow-y-auto', maxHeightClass)">
      <div
        v-for="(item, i) in filteredVars"
        :key="i"
        :class="cn(!item.isFlat && 'mt-3', i === 0 && item.isFlat && 'mt-2')"
      >
        <div
          v-if="!item.isFlat"
          :class="'system-xs-medium-uppercase truncate px-3 leading-[22px] text-text-tertiary'"
          :title="item.title"
        >
          {{ item.title }}
        </div>
        <VarReferenceVarsItem
          v-for="(v, j) in item.vars"
          :key="j"
          :title="item.title"
          :node-id="item.nodeId"
          :obj-path="[]"
          :item-data="v"
          @change="handleChange"
          :item-width="itemWidth"
          :is-support-file-var="isSupportFileVar"
          :is-exception="v.isException"
          :is-loop-var="item.isLoop"
          :is-flat="item.isFlat"
          :is-in-code-generator-instruction-editor="isInCodeGeneratorInstructionEditor"
          :z-index="zIndex"
          :prefer-schema-type="preferSchemaType"
        />
        <div
          v-if="item.isFlat && !filteredVars[i + 1]?.isFlat && !!filteredVars.find(item => !item.isFlat)"
          class="relative mt-[14px] flex items-center space-x-1"
        >
          <div class="h-0 w-3 shrink-0 border border-divider-subtle"></div>
          <div class="system-2xs-semibold-uppercase text-text-tertiary">{{ t('workflow.debug.lastOutput') }}</div>
          <div class="h-0 shrink-0 grow border border-divider-subtle"></div>
        </div>
      </div>
    </div>
    <div v-else class="mt-2 pl-3 text-xs font-medium uppercase leading-[18px] text-gray-500">
      {{ t('workflow.common.noVar') }}
    </div>
    <ManageInputField
      v-if="showManageInputField"
      :on-manage="onManageInputField || noop"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElInput, ElIcon } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import { noop } from 'lodash-es'
import cn from '@/utils/classnames'
import { checkKeys } from '@/utils/var.ts'
import { isSpecialVar } from '../utils'
import type { NodeOutPutVar, ValueSelector, Var } from '@/types'
import VarReferenceVarsItem from './item.vue'
import ManageInputField from '../manage-input-field/index.vue'

interface Props {
  hideSearch?: boolean
  searchBoxClassName?: string
  vars: NodeOutPutVar[]
  isSupportFileVar?: boolean
  itemWidth?: number
  maxHeightClass?: string
  onClose?: () => void
  onBlur?: () => void
  zIndex?: number
  isInCodeGeneratorInstructionEditor?: boolean
  showManageInputField?: boolean
  onManageInputField?: () => void
  autoFocus?: boolean
  preferSchemaType?: boolean
}

const emit = defineEmits<{
  (e: 'change', value: ValueSelector, item: Var): void
}>()

const handleChange = (value: ValueSelector, item: Var) => {
  console.log('handleChange', value, item)
  emit('change', value, item)
}
const props = withDefaults(defineProps<Props>(), {
  autoFocus: true,
})

const { t } = useI18n()
const searchText = ref('')

const handleKeyDown = (e: Event | KeyboardEvent) => {
  if ((e as KeyboardEvent).key === 'Escape') {
    e.preventDefault()
    props.onClose?.()
  }
}

const handleClear = () => {
  searchText.value = ''
}

const filteredVars = computed(() => {
  return props.vars
    .filter((v) => {
      const children = v.vars.filter(v => checkKeys([v.variable || ''], false).isValid || isSpecialVar(v.variable?.split('.')[0] || ''))
      return children.length > 0
    })
    .filter((node) => {
      if (!searchText.value)
        return node
      const children = node.vars.filter((v) => {
        const searchTextLower = searchText.value.toLowerCase()
        return v.variable.toLowerCase().includes(searchTextLower) || node.title.toLowerCase().includes(searchTextLower)
      })
      return children.length > 0
    })
    .map((node) => {
      let vars = node.vars.filter(v => checkKeys([v.variable || ''], false).isValid || isSpecialVar(v.variable?.split('.')[0] || ''))
      if (searchText.value) {
        const searchTextLower = searchText.value.toLowerCase()
        if (!node.title.toLowerCase().includes(searchTextLower))
          vars = vars.filter(v => v.variable.toLowerCase().includes(searchText.value.toLowerCase()))
      }

      return {
        ...node,
        vars,
      }
    })
})
</script>

