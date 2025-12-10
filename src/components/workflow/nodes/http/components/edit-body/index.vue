<template>
  <div>
    <el-radio-group :model-value="payload.type" @change="handleTypeChange">
      <el-radio v-for="t in allTypes" :key="t" :value="t" :disabled="readonly">{{ bodyTextMap[t] }}</el-radio>
    </el-radio-group>
    <div :class="cn(payload.type !== BodyType.none && 'mt-1')">
      <template v-if="payload.type === BodyType.none">
      </template>
      <template v-else-if="payload.type === BodyType.formData || payload.type === BodyType.xWwwFormUrlencoded">
        <KeyValue
          :readonly="readonly"
          :node-id="nodeId"
          :list="bodyPayload as KeyValueType[]"
          @change="handleBodyPayloadChange"
          @add="handleAddBody"
          :is-support-file="payload.type === BodyType.formData"
        />
      </template>
      <template v-else-if="payload.type === BodyType.rawText">
        <InputWithVar
          instance-id="http-body-raw"
          title="Raw text"
          :value="stringValue"
          @change="handleBodyValueChange"
          just-var
          :nodes-output-vars="availableVars"
          :available-nodes="availableNodes"
          :read-only="readonly"
        />
      </template>
      <template v-else-if="payload.type === BodyType.json">
        <InputWithVar
          instance-id="http-body-json"
          title="JSON"
          :value="stringValue"
          @change="handleBodyValueChange"
          just-var
          :nodes-output-vars="availableVars"
          :available-nodes="availableNodes"
          :read-only="readonly"
        />
      </template>
      <template v-else-if="payload.type === BodyType.binary">
        <VarReferencePicker
          :node-id="nodeId"
          :readonly="readonly"
          :value="bodyPayload[0]?.file || []"
          @change="handleFileChange"
          :filter-var="filterOnlyFileVariable"
        />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { cloneDeep, uniqueId } from 'lodash-es'
import type { Body, BodyPayload, KeyValue as KeyValueType } from '../../types'
import { BodyPayloadValueType, BodyType } from '../../types'
import KeyValue from '../key-value/key-value-edit/index.vue'
import useAvailableVarList from '../../../_base/hooks/use-available-var-list'
import VarReferencePicker from '../../../_base/variable/var-reference-picker.vue'
import cn from '@/utils/classnames'
import InputWithVar from '@/components/workflow/nodes/_base/prompt/editor.vue'
import type { ValueSelector, Var } from '@/types'
import { VarType } from '@/types'

const UNIQUE_ID_PREFIX = 'key-value-'

/**
 * 组件属性定义
 */
interface Props {
  /** 是否只读 */
  readonly: boolean
  /** 节点ID */
  nodeId: string
  /** Body 数据 */
  payload: Body
}

const props = defineProps<Props>()

/**
 * 组件事件定义
 */
const emit = defineEmits<{
  (e: 'change', payload: Body): void
}>()

/**
 * Body 类型列表
 */
const allTypes = [
  BodyType.none,
  BodyType.formData,
  BodyType.xWwwFormUrlencoded,
  BodyType.json,
  BodyType.rawText,
  BodyType.binary,
]

/**
 * Body 类型文本映射
 */
const bodyTextMap: Record<BodyType, string> = {
  [BodyType.none]: 'none',
  [BodyType.formData]: 'form-data',
  [BodyType.xWwwFormUrlencoded]: 'x-www-form-urlencoded',
  [BodyType.rawText]: 'raw',
  [BodyType.json]: 'JSON',
  [BodyType.binary]: 'binary',
}

/**
 * 获取 BodyPayload，兼容旧数据格式（string）
 */
const bodyPayload = computed(() => {
  if (typeof props.payload.data === 'string') {
    // 旧数据格式，返回空数组
    return []
  }
  return props.payload.data
})

/**
 * 获取字符串值（用于 rawText 和 json 类型）
 */
const stringValue = computed(() => {
  return [BodyType.formData, BodyType.xWwwFormUrlencoded].includes(props.payload.type)
    ? ''
    : (bodyPayload.value[0]?.value || '')
})

/**
 * 获取可用变量列表
 */
const { availableVars, availableNodes } = useAvailableVarList(props.nodeId, {
  onlyLeafNodeVar: false,
  filterVar: (varPayload: Var) => {
    return [
      VarType.string,
      VarType.number,
      VarType.secret,
      VarType.arrayNumber,
      VarType.arrayString,
    ].includes(varPayload.type)
  },
})

/**
 * 处理类型变更
 */
const handleTypeChange = (value: BodyType) => {
  const hasKeyValue = [BodyType.formData, BodyType.xWwwFormUrlencoded].includes(value)
  emit('change', {
    type: value,
    data: hasKeyValue
      ? [
          {
            id: uniqueId(UNIQUE_ID_PREFIX),
            type: BodyPayloadValueType.text,
            key: '',
            value: '',
          },
        ]
      : [],
  })
}

/**
 * 添加 Body 项
 */
const handleAddBody = () => {
  const draft = cloneDeep(props.payload)
  ;(draft.data as BodyPayload).push({
    id: uniqueId(UNIQUE_ID_PREFIX),
    type: BodyPayloadValueType.text,
    key: '',
    value: '',
  })
  emit('change', draft)
}

/**
 * 处理 BodyPayload 变更
 */
const handleBodyPayloadChange = (newList: KeyValueType[]) => {
  const draft = cloneDeep(props.payload)
  draft.data = newList as BodyPayload
  emit('change', draft)
}

/**
 * 过滤仅文件变量
 */
const filterOnlyFileVariable = (varPayload: Var) => {
  return [VarType.file, VarType.arrayFile].includes(varPayload.type)
}

/**
 * 处理 Body 值变更（用于 rawText 和 json）
 */
const handleBodyValueChange = (value: string) => {
  const draft = cloneDeep(props.payload)
  if ((draft.data as BodyPayload).length === 0) {
    ;(draft.data as BodyPayload).push({
      id: uniqueId(UNIQUE_ID_PREFIX),
      type: BodyPayloadValueType.text,
      key: '',
      value: '',
    })
  }
  (draft.data as BodyPayload)[0]!.value = value
  emit('change', draft)
}

/**
 * 处理文件变更（用于 binary 类型）
 * @param value 文件选择器值
 * @param varKindType 变量类型（可选，未使用）
 * @param varInfo 变量信息（可选，未使用）
 */
const handleFileChange = (value: ValueSelector | string | number, varKindType?: any, varInfo?: any) => {
  const draft = cloneDeep(props.payload)
  if ((draft.data as BodyPayload).length === 0) {
    ;(draft.data as BodyPayload).push({
      id: uniqueId(UNIQUE_ID_PREFIX),
      type: BodyPayloadValueType.file,
    })
  }
  (draft.data as BodyPayload)[0]!.file = value as ValueSelector
  emit('change', draft)
}
</script>

