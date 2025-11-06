<template>
  <el-popover
    v-model:visible="open"
    placement="left-start"
    :offset="4"
    trigger="hover"
    teleported
    :persistent="false"
    :show-arrow="false"
    popper-class="custom-popover"
    :style="{ zIndex: props.zIndex || 100 }"
  >
    <template #reference>
      <div
        ref="itemRef"
        :class="cn(
          (isObj || isStructureOutput) ? 'pr-1' : 'pr-[18px]',
          isHovering && ((isObj || isStructureOutput) ? 'bg-components-panel-on-panel-item-bg-hover' : 'bg-state-base-hover'),
          'relative flex h-6 w-full cursor-pointer items-center rounded-md pl-3',
          props.className,
        )"
        @click="handleChosen"
        @mousedown.prevent
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave"
      >
        <div class="flex w-0 grow items-center">
          <VariableIconWithColor
            v-if="!isFlat"
            :variable-category="variableCategory"
            :is-exception-variable="isException"
          />
          <component
            v-if="isFlat && flatVarIcon"
            :is="flatVarIcon"
            :class="flatVarIconClass"
          />
          <div
            v-if="!isEnv && !isChatVar && !isRagVariable"
            :title="itemData.variable"
            class="system-sm-medium ml-1 w-0 grow truncate text-text-secondary"
          >
            {{ varName }}
          </div>
          <div
            v-if="isEnv"
            :title="itemData.variable"
            class="system-sm-medium ml-1 w-0 grow truncate text-text-secondary"
          >
            {{ itemData.variable.replace('env.', '') }}
          </div>
          <div
            v-if="isChatVar"
            :title="itemData.des"
            class="system-sm-medium ml-1 w-0 grow truncate text-text-secondary"
          >
            {{ itemData.variable.replace('conversation.', '') }}
          </div>
          <div
            v-if="isRagVariable"
            :title="itemData.des"
            class="system-sm-medium ml-1 w-0 grow truncate text-text-secondary"
          >
            {{ itemData.variable.split('.').slice(-1)[0] }}
          </div>
        </div>
        <div class="ml-1 shrink-0 text-xs font-normal capitalize text-text-tertiary">
          {{ (preferSchemaType && itemData.schemaType) ? itemData.schemaType : itemData.type }}
        </div>
        <ChevronRight
          v-if="isObj || isStructureOutput"
          :class="cn('ml-0.5 h-3 w-3 text-text-quaternary', isHovering && 'text-text-tertiary')"
        />
      </div>
    </template>
    <PickerStructurePanel
      v-if="isStructureOutput || isObj"
      ref="pickerRef"
      :root="{ nodeId: props.nodeId, nodeName: props.title, attrName: props.itemData.variable, attrAlias: props.itemData.schemaType }"
      :payload="structuredOutput!"
      @hovering="setIsChildrenHovering"
      @select="handleSelect"
    />
  </el-popover>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ElPopover } from 'element-plus'
import cn from '@/utils/classnames'
import { VarType } from '@/types'
import type { ValueSelector, Var } from '@/types'
import { ChevronRight } from '@/components/base/icons/src/vender/line/arrows'
import { CodeAssistant, MagicEdit } from '@/components/base/icons/src/vender/line/general'
import { Variable02 } from '@/components/base/icons/src/vender/solid/development'
import { VariableIconWithColor } from '@/components/workflow/nodes/_base/variable/variable-label'
import { varTypeToStructType } from '../utils'
import type { StructuredOutput } from '../../../llm/types'
import { Type } from '../../../llm/types'
import type { Field } from '../../../llm/types'
import PickerStructurePanel from '@/components/workflow/nodes/_base/variable/object-child-tree-panel/picker/index.vue'

interface Props {
  nodeId: string
  title: string
  objPath: string[]
  itemData: Var
  onChange: (value: ValueSelector, item: Var) => void
  onHovering?: (value: boolean) => void
  itemWidth?: number
  isSupportFileVar?: boolean
  isException?: boolean
  isLoopVar?: boolean
  isFlat?: boolean
  isInCodeGeneratorInstructionEditor?: boolean
  zIndex?: number
  className?: string
  preferSchemaType?: boolean
}

const props = defineProps<Props>()

const isStructureOutput = computed(() => 
  props.itemData.type === VarType.object && (props.itemData.children as StructuredOutput)?.schema?.properties
)
const isFile = computed(() => 
  props.itemData.type === VarType.file && !isStructureOutput.value
)
const isObj = computed(() => 
  ([VarType.object, VarType.file].includes(props.itemData.type) && props.itemData.children && (props.itemData.children as Var[]).length > 0)
)
const isSys = computed(() => props.itemData.variable.startsWith('sys.'))
const isEnv = computed(() => props.itemData.variable.startsWith('env.'))
const isChatVar = computed(() => props.itemData.variable.startsWith('conversation.'))
const isRagVariable = computed(() => props.itemData.isRagVariable)

const flatVarIcon = computed(() => {
  if (!props.isFlat)
    return null
  const variable = props.itemData.variable
  switch (variable) {
    case 'current':
      return props.isInCodeGeneratorInstructionEditor ? CodeAssistant : MagicEdit
    case 'error_message':
      return Variable02
    default:
      return Variable02
  }
})

const flatVarIconClass = computed(() => {
  if (!props.isFlat)
    return ''
  const variable = props.itemData.variable
  switch (variable) {
    case 'current':
      return 'h-3.5 w-3.5 shrink-0 text-util-colors-violet-violet-600'
    case 'error_message':
      return 'h-3.5 w-3.5 shrink-0 text-util-colors-orange-dark-orange-dark-600'
    default:
      return 'h-3.5 w-3.5 shrink-0 text-text-accent'
  }
})

const varName = computed(() => {
  if (!props.isFlat)
    return props.itemData.variable
  if (props.itemData.variable === 'current')
    return props.isInCodeGeneratorInstructionEditor ? 'current_code' : 'current_prompt'
  return props.itemData.variable
})

const objStructuredOutput = computed((): StructuredOutput | null => {
  if (!isObj.value) return null
  const properties: Record<string, Field> = {}
  const childrenVars = (props.itemData.children as Var[]) || []
  childrenVars.forEach((c) => {
    properties[c.variable] = {
      type: varTypeToStructType(c.type),
    }
  })
  return {
    schema: {
      type: Type.object,
      properties,
      required: [],
      additionalProperties: false,
    },
  }
})

const structuredOutput = computed(() => {
  if (isStructureOutput.value)
    return props.itemData.children as StructuredOutput
  return objStructuredOutput.value
})

const itemRef = ref<HTMLDivElement>()
const isItemHovering = ref(false)
const isChildrenHovering = ref(false)

const handleMouseEnter = () => {
  isItemHovering.value = true
}

const handleMouseLeave = () => {
  if (isObj.value || isStructureOutput.value) {
    setTimeout(() => {
      isItemHovering.value = false
    }, 100)
  }
  else {
    isItemHovering.value = false
  }
}

const isHovering = computed(() => isItemHovering.value || isChildrenHovering.value)
const open = computed(() => (isObj.value || isStructureOutput.value) && isHovering.value)

watch(isHovering, (newVal) => {
  props.onHovering?.(newVal)
})

const setIsChildrenHovering = (value: boolean) => {
  isChildrenHovering.value = value
}

const handleChosen = (e: MouseEvent) => {
  e.stopPropagation()
  if (!props.isSupportFileVar && isFile.value)
    return

  if (props.isFlat) {
    props.onChange([props.itemData.variable], props.itemData)
  }
  else if (isSys.value || isEnv.value || isChatVar.value || isRagVariable.value) {
    props.onChange([...props.objPath, ...props.itemData.variable.split('.')], props.itemData)
  }
  else {
    props.onChange([props.nodeId, ...props.objPath, props.itemData.variable], props.itemData)
  }
}

const variableCategory = computed(() => {
  if (isEnv.value) return 'environment'
  if (isChatVar.value) return 'conversation'
  if (props.isLoopVar) return 'loop'
  if (isRagVariable.value) return 'rag'
  return 'system'
})

const handleSelect = (valueSelector: ValueSelector) => {
  props.onChange(valueSelector, props.itemData)
}
</script>

