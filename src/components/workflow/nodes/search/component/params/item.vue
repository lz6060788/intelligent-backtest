<template>
  <div
    class="mb-4 p-2 flex gap-2 rounded last-of-type:mb-0"
    :class="{
      'bg-red-5/20 border-red-7' : isFocusDelete
    }"
  >
    <div class="text-xs flex-1 flex flex-col gap-2">
      <div class="w-full flex">
        <span class="w-16 shrink-0">搜索问句：</span>
        <div class="grow">
          <div class="mb-1">
            <InputModeSelect
              :value="item.search_query.type"
              @change="handleUpdateSearchType"
            />
          </div>
          <FormItem
            :node-id="nodeId"
            :item="item.search_query"
            @change="handleUpdateSearchValue"
          />
        </div>
      </div>
      <div class="flex w-full">
        <span class="w-16 shrink-0">开始时间：</span>
        <div class="grow flex gap-2">
          <div class="mb-1 w-22">
            <InputModeSelect
              :value="item.start_date.type"
              @change="handleUpdateStartDateType"
            />
          </div>
          <div class="flex-1 w-0">
            <VarReferencePicker
              v-if="item.start_date.type === ValueType.variable"
              :readonly="false"
              :node-id="nodeId"
              :is-show-node-name="true"
              :value="item.start_date.value"
              @change="handleUpdateStartDate"
              :filter-var="filterVar"
              :placeholder="t('workflow.nodes.assigner.setParameter')"
            ></VarReferencePicker>
            <el-date-picker
              v-else
              :disabled="readonly"
              :model-value="item.start_date.value"
              type="date"
              value-format="YYYYMMDD"
              @update:model-value="handleUpdateStartDate"
              style="width: 100%;"
            />
          </div>
        </div>
      </div>
      <div class="flex w-full">
        <span class="w-16 shrink-0">结束时间：</span>
        <div class="grow flex gap-2">
          <div class="mb-1 w-22">
            <InputModeSelect
              :value="item.end_date.type"
              @change="handleUpdateEndDateType"
            />
          </div>
          <div class="flex-1 w-0">
            <VarReferencePicker
              v-if="item.end_date.type === ValueType.variable"
              :readonly="false"
              :node-id="nodeId"
              :is-show-node-name="true"
              :value="item.end_date.value"
              @change="handleUpdateEndDate"
              :filter-var="filterVar"
              :placeholder="t('workflow.nodes.assigner.setParameter')"
            ></VarReferencePicker>
            <el-date-picker
              v-else
              :disabled="readonly"
              :model-value="item.end_date.value"
              type="date"
              value-format="YYYYMMDD"
              @update:model-value="handleUpdateEndDate"
              style="width: 100%;"
            />
          </div>
        </div>
      </div>
    </div>
    <RemoveButton
      @click="handleSearchItemRemove"
      v-if="!readonly && showDeleteBtn"
      @mouseenter="isFocusDelete = true"
      @mouseleave="isFocusDelete = false"
    ></RemoveButton>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import InputModeSelect from './input-mode-selec.vue'
import FormItem from './form-item.vue'
import { ValueType, VarType, type ValueSelector, type Var } from '@/types'
import type { SearchItem } from '../../types'
import { ref } from 'vue'

/**
 * 项组件的属性定义
 */
interface SearchItemProps {
  /** 搜索项 */
  item: SearchItem
  nodeId: string
  readonly: boolean
  showDeleteBtn: boolean
}

const props = defineProps<SearchItemProps>()
const emit = defineEmits<{
  (e: 'update-search-item', updateData: Partial<SearchItem>): void
  (e: 'remove-search-item'): void
}>()

const handleUpdateSearchItem = (updateData: Partial<SearchItem>) => {
  emit('update-search-item', updateData)
}

const { t } = useI18n()

const isFocusDelete = ref(false);

const filterVar = (varPayload: Var) => {
  return varPayload.type === VarType.string
}

const handleUpdateSearchType = (value: ValueType) => {
  handleUpdateSearchItem({ search_query: {
    type: value,
    value: value === ValueType.variable ? [] : ''
  }})
}

const handleUpdateSearchValue = (value: string | ValueSelector) => {
  handleUpdateSearchItem({ search_query: {
    ...props.item.search_query,
    value: value
  }})
}

const handleUpdateStartDateType = (value: ValueType) => {
  handleUpdateSearchItem({ start_date: {
    type: value,
    value: value === ValueType.variable ? [] : ''
  }})
}

const handleUpdateEndDateType = (value: ValueType) => {
  handleUpdateSearchItem({ end_date: {
    type: value,
    value: value === ValueType.variable ? [] : ''
  }})
}

const handleUpdateEndDate = (value: string | ValueSelector) => {
  handleUpdateSearchItem({ end_date: {
    ...props.item.end_date,
    value: value
  }})
}

const handleUpdateStartDate = (value: string | ValueSelector) => {
  handleUpdateSearchItem({ start_date: {
    ...props.item.start_date,
    value: value
  }})
}

const handleSearchItemRemove = () => {
  emit('remove-search-item')
}
</script>

