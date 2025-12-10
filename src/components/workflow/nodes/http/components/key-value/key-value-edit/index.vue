<template>
  <div v-if="Array.isArray(props.list)" class="overflow-hidden rounded-lg border border-divider-regular">
    <div :class="cn('system-xs-medium-uppercase flex h-7 items-center leading-7 text-text-tertiary')">
      <div :class="cn('h-full border-0 border-r border-divider-regular pl-3', props.isSupportFile ? 'w-[140px]' : 'w-1/2')">
        {{ t(`${i18nPrefix}.key`) }}
      </div>
      <div v-if="props.isSupportFile" class="h-full w-[70px] shrink-0 border-0 border-r border-divider-regular pl-3">
        {{ t(`${i18nPrefix}.type`) }}
      </div>
      <div :class="cn('h-full items-center justify-between pl-3 pr-1', props.isSupportFile ? 'grow' : 'w-1/2')">
        {{ t(`${i18nPrefix}.value`) }}
      </div>
    </div>
    <KeyValueItem
      v-for="(item, index) in props.list"
      :key="item.id"
      :instance-id="item.id!"
      :node-id="props.nodeId"
      :payload="item"
      @change="(newItem: KeyValue) => handleChange(index, newItem)"
      @remove="() => handleRemove(index)"
      :is-last-item="index === props.list.length - 1"
      @add="emit('add')"
      :readonly="props.readonly"
      :can-remove="props.list.length > 1"
      :is-support-file="props.isSupportFile"
      :key-not-support-var="props.keyNotSupportVar"
      :insert-var-tip-to-left="props.insertVarTipToLeft"
    />
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { KeyValue } from '../../../types'
import KeyValueItem from './item.vue'
import cn from '@/utils/classnames'
import { cloneDeep } from 'lodash-es'

const i18nPrefix = 'workflow.nodes.http'

/**
 * 组件属性定义
 */
interface Props {
  /** 是否只读 */
  readonly: boolean
  /** 节点ID */
  nodeId: string
  /** 键值对列表 */
  list: KeyValue[]
  /** 是否支持文件 */
  isSupportFile?: boolean
  /** 键不支持变量 */
  keyNotSupportVar?: boolean
  /** 插入变量提示位置 */
  insertVarTipToLeft?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isSupportFile: false,
  keyNotSupportVar: false,
  insertVarTipToLeft: false,
})

const emit = defineEmits<{
  (e: 'change', newList: KeyValue[]): void
  (e: 'add'): void
}>()

const { t } = useI18n()

/**
 * 处理项变更
 */
const handleChange = (index: number, newItem: KeyValue) => {
  const newList = cloneDeep(props.list)
  newList[index] = newItem
  emit('change', newList)
}

/**
 * 处理项移除
 */
const handleRemove = (index: number) => {
  console.log('handleRemove', index, props.list)
  const newList = cloneDeep(props.list)
  newList.splice(index, 1)
  emit('change', newList)
}
</script>

