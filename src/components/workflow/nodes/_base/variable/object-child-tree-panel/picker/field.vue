<template>
  <div v-if="depth <= MAX_DEPTH + 1">
    <Tooltip :popup-content="t('app.structOutput.moreFillTip')" :disabled="depth !== MAX_DEPTH + 1">
      <div
        :class="cn(
          'flex items-center justify-between rounded-md pr-2',
          !readonly && 'hover:bg-state-base-hover',
          depth !== MAX_DEPTH + 1 && 'cursor-pointer'
        )"
        @mousedown="handleMouseDown"
      >
        <div class="flex grow items-stretch">
          <TreeIndentLine :depth="depth" />
          <RiMoreFill v-if="depth === MAX_DEPTH + 1" class="h-3 w-3 text-text-tertiary" />
          <div
            v-else
            :class="cn(
              'system-sm-medium h-6 w-0 grow truncate leading-6 text-text-secondary',
              isHighlight && 'text-text-accent'
            )"
          >
            {{ name }}
          </div>
        </div>
        <div v-if="depth < MAX_DEPTH + 1" class="system-xs-regular ml-2 shrink-0 text-text-tertiary">
          {{ fieldType }}
        </div>
      </div>
    </Tooltip>

    <div v-if="depth <= MAX_DEPTH && payload.type === Type.object && payload.properties">
      <Field
        v-for="propName in Object.keys(payload.properties)"
        :key="propName"
        :name="propName"
        :payload="payload.properties[propName] as FieldType"
        :depth="depth + 1"
        :readonly="readonly"
        :value-selector="[...valueSelector, name]"
        @select="onSelect"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Type } from '@/components/workflow/nodes/llm/types'
import { getFieldType } from '@/components/workflow/nodes/llm/utils'
import type { Field as FieldType } from '@/components/workflow/nodes/llm/types'
import cn from '@/utils/classnames'
import TreeIndentLine from '@/components/workflow/nodes/_base/variable/object-child-tree-panel/tree-indent-line.vue'
import { RiMoreFill } from '@remixicon/vue'
import Tooltip from '@/components/base/tooltip/index.vue'
import type { ValueSelector } from '@/types'

const MAX_DEPTH = 10

interface Props {
  valueSelector: ValueSelector
  name: string
  payload: FieldType
  depth?: number
  readonly?: boolean
  onSelect?: (valueSelector: ValueSelector) => void
}

const props = withDefaults(defineProps<Props>(), {
  depth: 1,
})

const { t } = useI18n()

const isLastFieldHighlight = computed(() => props.readonly)
const hasChildren = computed(() => props.payload.type === Type.object && props.payload.properties)
const isHighlight = computed(() => isLastFieldHighlight.value && !hasChildren.value)
const fieldType = computed(() => getFieldType(props.payload))

const handleMouseDown = () => {
  if (!props.readonly) {
    props.onSelect?.([...props.valueSelector, props.name])
  }
}
</script>

