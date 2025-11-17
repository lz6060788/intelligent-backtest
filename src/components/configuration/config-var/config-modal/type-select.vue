<template>
  <el-popover
    v-model:visible="open"
    :teleported="true"
    :persistent="false"
    :show-arrow="false"
    popper-class="custom-popover"
    placement="bottom-start"
    :offset="4"
    trigger="click"
  >
    <template #reference>
      <div
        :class="classNames(`group flex h-9 items-center justify-between rounded-lg border-0 bg-gray-800 border border-solid border-[var(--el-border-color)] hover:border-[var(--el-border-color-hover)] px-2 text-sm ${readonly ? 'cursor-not-allowed' : 'cursor-pointer'}`)"
        :title="selectedItem?.name"
      >
        <div class="flex items-center">
          <InputVarTypeIcon :type="selectedItem?.value as InputVarType" class="size-4 shrink-0 text-text-secondary" />
          <span
            :class="`
              ml-1.5 text-components-input-text-filled ${!selectedItem?.name && 'text-components-input-text-placeholder'}
            `"
          >
            {{ selectedItem?.name }}
          </span>
        </div>
        <div class="flex items-center space-x-1">
          <Badge :text="inputVarTypeToVarType(selectedItem?.value as InputVarType)" />
          <ChevronDownIcon :class="cn('h-4 w-4 shrink-0 text-text-quaternary group-hover:text-text-secondary', open && 'text-text-secondary')" />
        </div>
      </div>
    </template>
    <div
      :class="classNames('w-[512px] rounded-md border-[0.5px] border-gray-5 border-solid bg-gray-8 px-1 py-1 text-base shadow-lg focus:outline-none sm:text-sm', popupInnerClassName)"
    >
      <div
        v-for="item in items"
        :key="item.value"
        :class="'flex h-9 cursor-pointer items-center justify-between rounded-lg px-2 text-text-secondary hover:bg-gray-700'"
        :title="item.name"
        @click="handleSelect(item)"
      >
        <div class="flex items-center space-x-2">
          <InputVarTypeIcon :type="item.value" class="size-4 shrink-0 text-text-secondary" />
          <span :title="item.name">{{ item.name }}</span>
        </div>
        <Badge :text="inputVarTypeToVarType(item.value)" />
      </div>
    </div>
  </el-popover>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ChevronDownIcon } from '@heroicons/vue/24/solid'
import classNames from '@/utils/classnames'
import InputVarTypeIcon from '@/components/workflow/nodes/_base/input-var-type-icon/index.vue'
import type { InputVarType } from '@/types'
import cn from '@/utils/classnames'
import Badge from '@/components/base/badge/index.vue'
import { inputVarTypeToVarType } from '@/components/workflow/nodes/_base/variable/utils'

/**
 * 选项项类型定义
 */
export type Item = {
  /** 值 */
  value: InputVarType
  /** 名称 */
  name: string
}

/**
 * TypeSelector 组件的属性定义
 */
interface TypeSelectorProps {
  /** 当前值 */
  value: string | number
  /** 选择回调 */
  onSelect: (value: Item) => void
  /** 选项列表 */
  items: Item[]
  /** 弹出层类名 */
  popupClassName?: string
  /** 弹出层内部类名 */
  popupInnerClassName?: string
  /** 是否只读 */
  readonly?: boolean
  /** 是否隐藏选中标记 */
  hideChecked?: boolean
}

const props = withDefaults(defineProps<TypeSelectorProps>(), {
  popupClassName: '',
  popupInnerClassName: '',
  readonly: false,
  hideChecked: false,
})

const emit = defineEmits<{
  select: [item: Item]
}>()

const open = ref(false)

const selectedItem = computed(() => {
  return props.value ? props.items.find(item => item.value === props.value) : undefined
})

const handleSelect = (item: Item) => {
  emit('select', item)
  props.onSelect(item)
  open.value = false
}
</script>

