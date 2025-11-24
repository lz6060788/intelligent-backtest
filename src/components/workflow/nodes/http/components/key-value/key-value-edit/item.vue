<template>
  <!-- group class name is for hover row show remove button -->
  <div :class="cn(props.className, 'h-min-7 group flex border-0 border-t border-divider-regular')">
    <div :class="cn('shrink-0 border-0 border-r border-divider-regular', props.isSupportFile ? 'w-[140px]' : 'w-1/2')">
      <InputItem
        v-if="!props.keyNotSupportVar"
        :instance-id="`http-key-${props.instanceId}`"
        :node-id="props.nodeId"
        :value="props.payload.key"
        @change="(value: string) => handleChange('key', value)"
        :has-remove="false"
        :placeholder="t(`${i18nPrefix}.key`)"
        :read-only="props.readonly"
        :insert-var-tip-to-left="props.insertVarTipToLeft"
      />
      <input
        v-else
        class="system-sm-regular focus:bg-gray-100! appearance-none rounded-none border-none bg-transparent outline-none hover:bg-components-input-bg-hover focus:ring-0"
        :value="props.payload.key"
        @input="(e: Event) => handleChange('key', (e.target as HTMLInputElement).value as string)"
      />
    </div>
    <div v-if="props.isSupportFile" class="w-[70px] shrink-0 border-0 border-r border-divider-regular">
      <el-select
        :model-value="props.payload.type!"
        :disabled="props.readonly"
        class="rounded-none h-7 text-text-primary"
        popper-class="custom-popover"
        @change="(value: string) => handleChange('type', value)"
      >
        <el-option
          v-for="option in typeOptions"
          :key="option.value"
          :label="option.name"
          :value="option.value"
        />
      </el-select>
    </div>
    <div :class="props.isSupportFile ? 'grow' : 'w-1/2'" @click="lastItemAdd">
      <VarReferencePicker
        v-if="props.isSupportFile && props.payload.type === 'file'"
        :node-id="props.nodeId"
        :readonly="props.readonly"
        :value="props.payload.file || []"
        :filter-var="filterOnlyFileVariable"
        :is-in-table="true"
        @change="(value: ValueSelector | string | number) => handleChange('file', value as ValueSelector)"
        @remove="emit('remove')"
      />
      <InputItem
        v-else
        :instance-id="`http-value-${props.instanceId}`"
        :node-id="props.nodeId"
        :value="props.payload.value"
        @change="(value: string | ValueSelector) => handleChange('value', value)"
        :has-remove="!props.readonly && props.canRemove"
        @remove="emit('remove')"
        :placeholder="t(`${i18nPrefix}.value`)"
        :read-only="props.readonly"
        :is-support-file="props.isSupportFile"
        :insert-var-tip-to-left="props.insertVarTipToLeft"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { produce } from 'immer'
import type { KeyValue } from '../../../types'
import VarReferencePicker from '@/components/workflow/nodes/_base/variable/var-reference-picker.vue'
import InputItem from './input-item.vue'
import cn from '@/utils/classnames'
import type { ValueSelector, Var } from '@/types'
import { VarType, VarKindType } from '@/types'

const i18nPrefix = 'workflow.nodes.http'

/**
 * 组件属性定义
 */
interface Props {
  /** 实例ID */
  instanceId: string
  /** 自定义类名 */
  className?: string
  /** 节点ID */
  nodeId: string
  /** 是否只读 */
  readonly: boolean
  /** 是否可以移除 */
  canRemove: boolean
  /** 数据载荷 */
  payload: KeyValue
  /** 是否是最后一项 */
  isLastItem: boolean
  /** 是否支持文件 */
  isSupportFile?: boolean
  /** 键不支持变量 */
  keyNotSupportVar?: boolean
  /** 插入变量提示位置 */
  insertVarTipToLeft?: boolean
}

const emit = defineEmits<{
  (e: 'change', newPayload: KeyValue): void
  (e: 'remove'): void
  (e: 'add'): void
}>()

const props = withDefaults(defineProps<Props>(), {
  isSupportFile: false,
  keyNotSupportVar: false,
  insertVarTipToLeft: false,
})

const { t } = useI18n()

/**
 * 类型选项
 */
const typeOptions = [
  { name: 'text', value: 'text' },
  { name: 'file', value: 'file' },
]

/**
 * 处理变更
 */
const handleChange = (key: string, value: string | ValueSelector) => {
  console.log('handleChange', {
    ...props.payload,
    [key]: value,
  }, props.payload, key, value)
  emit('change', {
    ...props.payload,
    [key]: value,
  })
}

/**
 * 过滤仅文件变量
 */
const filterOnlyFileVariable = (varPayload: Var) => {
  return [VarType.file, VarType.arrayFile].includes(varPayload.type)
}

const lastItemAdd = () => {
  console.log('lastItemAdd', props.isLastItem)
  if (props.isLastItem) {
    console.log('lastItemAdd')
    emit('add')
  }
}
</script>

