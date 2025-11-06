<template>
  <div
    :class="cn(
      'relative flex items-center gap-1 self-stretch rounded-md bg-workflow-block-parma-bg p-[3px] pl-[5px]',
      showBorder && '!bg-state-base-hover',
      className,
    )"
  >
    <div class="flex w-0 grow items-center">
      <template v-if="node">
        <div class="shrink-0 p-[1px]">
          <VarBlockIcon
            class="!text-text-primary"
            :type="node.data?.type as BlockEnum"
          />
        </div>
        <div
          class="mx-0.5 shrink-[1000] truncate text-xs font-medium text-text-secondary"
          :title="node?.data?.title"
        >
          {{ node?.data?.title }}
        </div>
        <Line3 class="mr-0.5 shrink-0" />
      </template>
      <component :is="VariableIcon" />
      <component :is="VariableName" />
    </div>
    <Badge v-if="writeMode" class="shrink-0" :text="t(`${i18nPrefix}.operations.${writeMode}`)" />
  </div>
</template>

<script setup lang="ts">
import { computed, h } from 'vue'
import { useI18n } from 'vue-i18n'
import cn from '@/utils/classnames'
import VarBlockIcon from '@/components/workflow/block-icon.vue'
import { Line3 } from '@/components/base/icons/src/public/common'
import { Variable02 } from '@/components/base/icons/src/vender/solid/development'
import { BubbleX, Env } from '@/components/base/icons/src/vender/line/others'
import Badge from '@/components/base/badge/index.vue'
import type { BlockEnum, Node, ValueSelector } from '@/types'
import { isConversationVar, isENV, isRagVariableVar, isSystemVar } from '@/components/workflow/nodes/_base/variable/utils'
import { InputField } from '@/components/base/icons/src/vender/pipeline'

interface NodeVariableItemProps {
  node: Node
  variable: ValueSelector
  writeMode?: string
  showBorder?: boolean
  className?: string
  isException?: boolean
}

const props = defineProps<NodeVariableItemProps>()

const i18nPrefix = 'workflow.nodes.assigner'

const { t } = useI18n()

const isSystem = computed(() => isSystemVar(props.variable))
const isEnv = computed(() => isENV(props.variable))
const isChatVar = computed(() => isConversationVar(props.variable))
const isRagVar = computed(() => isRagVariableVar(props.variable))

const varName = computed(() => {
  if (isSystem.value)
    return `sys.${props.variable[props.variable.length - 1]}`
  if (isRagVar.value)
    return props.variable[props.variable.length - 1]
  return props.variable.slice(1).join('.')
})

const VariableIcon = computed(() => {
  if (isEnv.value) {
    return () => h(Env, { class: 'h-3.5 w-3.5 shrink-0 text-util-colors-violet-violet-600' })
  }

  if (isChatVar.value) {
    return () => h(BubbleX, { class: 'h-3.5 w-3.5 shrink-0 text-util-colors-teal-teal-700' })
  }

  if (isRagVar.value) {
    return () => h(InputField, { class: 'h-3.5 w-3.5 shrink-0 text-text-accent' })
  }

  return () => h(Variable02, {
    class: cn(
      'h-3.5 w-3.5 shrink-0 text-text-accent',
      props.isException && 'text-text-warning',
    ),
  })
})

const VariableName = computed(() => {
  return () => h('div', {
    class: cn(
      'system-xs-medium ml-0.5 shrink truncate text-text-accent',
      isEnv.value && 'text-text-primary',
      props.isException && 'text-text-warning',
      isChatVar.value && 'text-util-colors-teal-teal-700',
    ),
    title: varName.value,
  }, varName.value)
})
</script>

