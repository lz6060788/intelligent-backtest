<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import FieldCollapse from '@/components/workflow/nodes/_base/collapse/field-collapse.vue'

type Props = {
  className?: string
  title?: string
  collapsed?: boolean
  defaultCollapsed?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  collapsed: undefined,
  defaultCollapsed: true
})


const emit = defineEmits<{
  (e: 'collapse', collapsed: boolean): void
}>()

const { t } = useI18n()

const handleCollapse = (collapsed: boolean) => {
  emit('collapse', collapsed)
}
</script>

<template>
  <FieldCollapse
    :class="className"
    :title="title || t('workflow.nodes.common.outputVars')"
    :collapsed="collapsed"
    :default-collapsed="defaultCollapsed"
    @collapse="handleCollapse"
  >
    <template #default>
      <slot />
    </template>

    <template v-if="$slots.operations" #operations>
      <slot name="operations" />
    </template>
  </FieldCollapse>
</template>