<template>
    <div :class="cn('break-all text-xs', className)">
      <template v-for="(item, index) in renderedContent" :key="index">
        <component :is="item" />
      </template>
    </div>
  </template>

<script setup lang="ts">
import { computed, h } from 'vue'
import cn from 'classnames'
import { useWorkflow } from '../../../hooks'
import { BlockEnum } from '@/types'
import { getNodeInfoById, isENV, isSystemVar } from '../variable/utils'
import { VariableLabelInText } from '@/components/workflow/nodes/_base/variable/variable-label'
import { useI18n } from 'vue-i18n';

const { t } = useI18n()

interface Props {
  nodeId: string
  value: string
  className?: string
}

const props = defineProps<Props>()

const VAR_PLACEHOLDER = '@#!@#!'

const { getBeforeNodesInSameBranchIncludeParent } = useWorkflow()

const renderedContent = computed(() => {
  const availableNodes = getBeforeNodesInSameBranchIncludeParent(props.nodeId)
  const startNode = availableNodes.find((node: any) => {
    return node.data.type === BlockEnum.Start
  })

  const vars: string[] = []
  const strWithVarPlaceholder = props.value.replaceAll(/{{#([^#]*)#}}/g, (_match, p1) => {
    vars.push(p1)
    return VAR_PLACEHOLDER
  })

  return strWithVarPlaceholder.split(VAR_PLACEHOLDER).map((str, index) => {
    if (!vars[index]) {
      return {
        render: () => h('span', { class: 'relative leading-[16px]' }, str)
      }
    }

    const value = vars[index].split('.')
    const isSystem = isSystemVar(value)
    const node = (isSystem ? startNode : getNodeInfoById(availableNodes, value[0] ?? ''))?.data
    const isShowAPart = value.length > 2

    const isEnv = isENV(value)

    const isValid = () => {
      return Boolean(node) || isEnv
    }

    return {
      render: () => h(
        'span',
        null,
        [
          h('span', { class: 'relative top-[-3px] leading-[16px]' }, str),
          h(VariableLabelInText, {
            nodeTitle: node?.title,
            nodeType: node?.type,
            notShowFullPath: isShowAPart,
            'error-msg': !isValid() ? t('workflow.errorMsg.invalidVariable') : undefined,
            variables: value
          })
        ]
      )
    }
  })
})
</script>