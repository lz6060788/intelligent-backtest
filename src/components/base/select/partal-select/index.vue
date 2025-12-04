<template>
  <el-popover
    v-model:visible="open"
    placement="bottom-start"
    :offset="4"
    :popper-class="cn('custom-popover', popupClassName)"
    trigger="click"
    teleported
    :persistent="false"
    :show-arrow="false"
    :popper-style="{ zIndex: 1000 }"
  >
    <div
      :class="[
        'max-h-60 overflow-auto rounded-md popper-default p-1 text-base shadow-lg focus:outline-none sm:text-sm',
        popupInnerClassName
      ]"
    >
      <div
        v-for="item in items"
        :key="item.value"
        :class="[
          'flex py-1 cursor-pointer items-center justify-between rounded-lg px-2.5 text-text-secondary hover:bg-gray-600 mb-1 last:mb-0',
          item.value === value && 'bg-gray-600'
        ]"
        :title="item.name"
        @click="handleItemSelect(item)"
      >
        <span class="w-0 grow truncate" :title="item.name">
          <span class="truncate">{{ item.name }}</span>
          <el-badge
            v-if="item.value === installedValue"
            class="ml-1 shrink-0"
            text="INSTALLED"
            :uppercase="true"
          />
        </span>
        <ri-check-line
          v-if="!hideChecked && item.value === value"
          class="h-4 w-4 shrink-0 text-text-accent"
        />
      </div>
    </div>

    <template #reference>
      <div
        class="w-full p-1"
        :class="[triggerClassName, triggerClassNameFn?.(open)]"
      >
        <template v-if="slots.trigger">
          <slot name="trigger" :value="selectedItem">
          </slot>
        </template>
        <div
          v-else
          :class="[
            'group flex py-1 items-center justify-between rounded-lg border-0 bg-gray-700 px-2.5 text-sm hover:bg-gray-600',
            readonly ? 'cursor-not-allowed' : 'cursor-pointer'
          ]"
          :title="selectedItem?.name"
        >
          <span
            :class="[
              'grow truncate text-text-secondary text-xs',
              !selectedItem?.name && 'text-components-input-text-placeholder'
            ]"
          >
            {{ selectedItem?.name ?? localPlaceholder }}
          </span>
          <div class="mx-0.5">
            <el-badge
              v-if="installedValue && selectedItem && selectedItem.value !== installedValue"
              text="`${installedValue} -> ${selectedItem.value}`"
            />
          </div>
          <chevron-down-icon class="h-4 w-4 shrink-0 text-text-quaternary group-hover:text-text-secondary" />
        </div>
      </div>
    </template>
  </el-popover>
</template>

<script setup lang="ts">
import { computed, ref, useSlots, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElBadge, ElPopover } from 'element-plus'
import { RiCheckLine } from '@remixicon/vue'
import { RiArrowDownSLine } from '@remixicon/vue'
import cn from '@/utils/classnames'

// 定义类型
interface Item {
  value: string | number
  name: string
}

interface PortalSelectProps {
  value: string | number
  items: Item[]
  placeholder?: string
  installedValue?: string | number
  triggerClassName?: string
  triggerClassNameFn?: (open: boolean) => string
  popupClassName?: string
  popupInnerClassName?: string
  readonly?: boolean
  hideChecked?: boolean
}

const props = withDefaults(defineProps<PortalSelectProps>(), {
  placeholder: '',
  installedValue: '',
  triggerClassName: '',
  popupClassName: '',
  popupInnerClassName: '',
  readonly: false,
  hideChecked: false
})

const emit = defineEmits<{
  select: [value: Item]
}>()

const slots = useSlots()

const { t } = useI18n()
const open = ref(false)

const localPlaceholder = computed(() => {
  return props.placeholder || t('common.placeholder.select')
})

const selectedItem = computed(() => {
  return props.value ? props.items.find(item => item.value === props.value) : undefined
})

const handleTriggerClick = (e: MouseEvent) => {
  if (props.readonly) {
    e.stopPropagation()
    return
  }
  open.value = !open.value
}

const handleItemSelect = (item: Item) => {
  emit('select', item)
  open.value = false
}
</script>

<style scoped>
/* 如需样式穿透，可使用 ::v-deep 或 :deep() */
:deep(.el-popover) {
  z-index: 20 !important;
}
</style>