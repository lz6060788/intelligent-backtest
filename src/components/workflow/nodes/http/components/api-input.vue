<template>
  <div class="flex items-start space-x-1">
    <el-select
      v-model="props.method"
      class="w-[108px] !h-8"
      :disabled="readonly"
      :class="[
        readonly ? 'cursor-not-allowed' : '',
        'method-select'
      ]"
      placeholder="Method"
      @change="handleMethodChange"
    >
      <el-option
        v-for="option in MethodOptions"
        :key="option.value"
        :label="option.label"
        :value="option.value"
      />
    </el-select>

    <div class="w-0 grow">
      <tiptap
      :vars="availableVars"
      @change="handleUrlChange"
      :className="cn(isFocus
        ? 'border-components-input-border-active shadow-xs'
        : 'border-components-input-border-normal hover:border-components-input-border-hover',
      'w-0 grow rounded border px-3 py-[4px] leading-6 text-sm')"
      :value="props.url"
      :editable="!readonly"
      instanceId='http-api-url'
      @focus="isFocus = true"
      @blur="isFocus = false"
    />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { Method } from '../types'
import useAvailableVarList from '../../_base/hooks/use-available-var-list'
import { VarType } from '@/types'
import type { Var } from '@/types'
import cn from '@/utils/classnames'
import tiptap from '@/components/workflow/tiptap-editor/tiptap.vue'

const MethodOptions = [
  { label: 'GET', value: Method.get },
  { label: 'POST', value: Method.post },
  { label: 'HEAD', value: Method.head },
  { label: 'PATCH', value: Method.patch },
  { label: 'PUT', value: Method.put },
  { label: 'DELETE', value: Method.delete },
]

const props = defineProps<{
  nodeId: string
  readonly: boolean
  method: Method
  url: string
}>()

const emit = defineEmits<{
  (e: 'methodChange', value: Method): void
  (e: 'urlChange', value: string): void
}>()

const { t } = useI18n()

const isFocus = ref(false)

const handleMethodChange = (val: Method) => {
  emit('methodChange', val)
}

const handleUrlChange = ({ text }: { text: string }) => {
  emit('urlChange', text)
}

const { availableVars, availableNodesWithParent } = useAvailableVarList(props.nodeId, {
  onlyLeafNodeVar: false,
  filterVar: (varPayload: Var) => {
    return [VarType.string, VarType.number, VarType.secret].includes(varPayload.type)
  },
})

</script>

