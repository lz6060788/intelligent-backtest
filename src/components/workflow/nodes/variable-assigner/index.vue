<template>
  <div class="relative mb-1 space-y-0.5 w-60" ref="containerRef">
    <NodeGroupItem
      v-for="item in groups"
      :key="item.title"
      :item="item"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import NodeGroupItem from './components/node-group-item.vue'
import type { VariableAssignerNodeType } from './types'
import type { NodeProps } from '@/types'

const props = defineProps<NodeProps<VariableAssignerNodeType>>()

const { t } = useI18n()
const containerRef = ref<HTMLDivElement | null>(null)

const i18nPrefix = 'workflow.nodes.variableAssigner'

const groups = computed(() => {
  const { advanced_settings } = props.data
  const { id, data } = props

  if (!advanced_settings?.group_enabled) {
    return [{
      groupEnabled: false,
      targetHandleId: 'target',
      title: t(`${i18nPrefix}.title`),
      type: data.output_type,
      variables: data.variables,
      variableAssignerNodeId: id,
      variableAssignerNodeData: data,
    }]
  }

  return advanced_settings.groups.map((group) => ({
    groupEnabled: true,
    targetHandleId: group.groupId,
    title: group.group_name,
    type: group.output_type,
    variables: group.variables,
    variableAssignerNodeId: id,
    variableAssignerNodeData: data,
  }))
})
</script>