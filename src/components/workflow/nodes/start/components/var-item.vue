<template>
  <div
    ref="containerRef"
    :class="cn('flex h-8 cursor-pointer items-center justify-between rounded-lg border border-gray-500 bg-gray-700 px-2.5 shadow-xs hover:bg-gray-600', className)"
    @mouseenter="isHovering = true"
    @mouseleave="isHovering = false"
  >
    <div class="flex w-0 grow items-center space-x-1">
      <Variable02 :class="cn('h-3.5 w-3.5 text-text-accent', canDrag && 'group-hover:opacity-0')" />
      <div :title="payload.variable" class="max-w-[130px] shrink-0 truncate text-[13px] font-medium text-text-secondary">
        {{ payload.variable }}
      </div>
      <template v-if="payload.label">
        <div class="shrink-0 text-xs font-medium text-text-quaternary">·</div>
        <div :title="typeof payload.label === 'string' ? payload.label : ''" class="max-w-[130px] truncate text-[13px] font-medium text-text-tertiary">
          {{ typeof payload.label === 'string' ? payload.label : '' }}
        </div>
      </template>
      <Badge
        v-if="showLegacyBadge"
        text="LEGACY"
        className="shrink-0 border-text-accent-secondary text-text-accent-secondary"
      />
    </div>
    <div class="ml-2 flex shrink-0 items-center">
      <slot name="rightContent">
        <template v-if="!isHovering || readonly">
          <div v-if="payload.required" class="mr-2 text-xs font-normal text-text-tertiary">
            {{ t('workflow.nodes.start.required') }}
          </div>
          <InputVarTypeIcon :type="payload.type" className="h-3.5 w-3.5 text-text-tertiary" />
        </template>
        <template v-else-if="!readonly">
          <div @click="showEditVarModal" class="mr-1 cursor-pointer rounded-md hover:bg-blue-500 h-6 px-1">
            <Edit03 class="h-4 w-4 text-text-tertiary group-hover:text-white" />
          </div>
          <div @click="handleRemove" class="group cursor-pointer rounded-md hover:bg-red-200 h-6 px-1">
            <RiDeleteBinLine class="h-4 w-4 text-text-tertiary group-hover:text-red-500" />
          </div>
        </template>
      </slot>
    </div>
    <ConfigVarModal
      v-if="isShowEditVarModal"
      :is-show="isShowEditVarModal"
      :support-file="true"
      :payload="payload"
      :var-keys="varKeys"
      @close="hideEditVarModal"
      @confirm="handlePayloadChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { RiDeleteBinLine } from '@remixicon/vue'
import InputVarTypeIcon from '../../_base/input-var-type-icon/index.vue'
import type { InputVar, MoreInfo } from '@/types'
import { Variable02 } from '@/components/base/icons/src/vender/solid/development'
import { Edit03 } from '@/components/base/icons/src/vender/solid/general'
import Badge from '@/components/base/badge/index.vue'
import ConfigVarModal from '@/components/configuration/config-var/config-modal/index.vue'
import cn from '@/utils/classnames'

/**
 * 变量项组件的属性定义
 */
interface VarItemProps {
  /** 自定义类名 */
  className?: string
  /** 是否只读 */
  readonly: boolean
  /** 变量数据 */
  payload: InputVar
  /** 变化回调 */
  onChange?: (item: InputVar, moreInfo?: MoreInfo) => boolean
  /** 变量键列表 */
  varKeys?: string[]
  /** 是否显示遗留标记 */
  showLegacyBadge?: boolean
  /** 是否可拖拽 */
  canDrag?: boolean
}

const props = withDefaults(defineProps<VarItemProps>(), {
  className: '',
  onChange: () => true,
  varKeys: () => [],
  showLegacyBadge: false,
  canDrag: false,
})

const emit = defineEmits<{
  change: [item: InputVar, moreInfo?: MoreInfo]
  remove: []
}>()

const { t } = useI18n()

const containerRef = ref<HTMLDivElement | null>(null)
const isHovering = ref(false)
const isShowEditVarModal = ref(false)

const showEditVarModal = () => {
  isShowEditVarModal.value = true
}

const hideEditVarModal = () => {
  isShowEditVarModal.value = false
}

const handlePayloadChange = (payload: InputVar, moreInfo?: MoreInfo) => {
  const isValid = props.onChange(payload, moreInfo)
  if (!isValid)
    return
  hideEditVarModal()
}

const handleRemove = () => {
  emit('remove')
}
</script>

