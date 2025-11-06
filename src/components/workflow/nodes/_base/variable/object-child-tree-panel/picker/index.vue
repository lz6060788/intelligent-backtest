<template>
  <div :class="cn('w-[296px] rounded-xl border-[0.5px] border-components-panel-border bg-components-panel-bg-blur p-1 shadow-lg backdrop-blur-[5px]', className)">
    <div ref="refEl" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
      <!-- Root info -->
      <div class="flex items-center justify-between px-2 py-1">
        <div class="flex">
          <template v-if="root.nodeName">
            <div class="system-sm-medium max-w-[100px] truncate text-text-tertiary">{{ root.nodeName }}</div>
            <div class="system-sm-medium text-text-tertiary">.</div>
          </template>
          <div class="system-sm-medium text-text-secondary">{{ root.attrName }}</div>
        </div>
        <div class="system-xs-regular ml-2 truncate text-text-tertiary" :title="root.attrAlias || 'object'">
          {{ root.attrAlias || 'object' }}
        </div>
      </div>
      <Field
        v-for="name in fieldNames"
        :key="name"
        :name="name"
        :payload="schema.properties[name]!"
        :readonly="readonly"
        :value-selector="[root.nodeId!, root.attrName]"
        @select="onSelect"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { StructuredOutput } from '@/components/workflow/nodes/llm/types'
import Field from './field.vue'
import cn from '@/utils/classnames'
import type { ValueSelector } from '@/types'

interface Props {
  className?: string
  root: { nodeId?: string, nodeName?: string, attrName: string, attrAlias?: string }
  payload: StructuredOutput
  readonly?: boolean
  onSelect?: (valueSelector: ValueSelector) => void
  onHovering?: (value: boolean) => void
}

const props = defineProps<Props>()

const refEl = ref<HTMLDivElement>()
const isHovering = ref(false)

const handleMouseEnter = () => {
  isHovering.value = true
  props.onHovering?.(true)
}

const handleMouseLeave = () => {
  isHovering.value = false
  setTimeout(() => {
    if (!isHovering.value) {
      props.onHovering?.(false)
    }
  }, 100)
}

const schema = computed(() => props.payload.schema)
const fieldNames = computed(() => Object.keys(schema.value.properties || {}))
</script>
