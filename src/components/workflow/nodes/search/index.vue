<template>
</template>

<script setup lang="ts">
import { BlockEnum, type NodeProps, type ValueSelector } from '@/types'
import { type SearchNodeType } from './types'
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'
import { useVueFlow } from '@vue-flow/core'
import { isSystemVar } from '../_base/variable/utils'
import {
  VariableLabelInNode,
} from '@/components/workflow/nodes/_base/variable/variable-label'

const i18nPrefix = 'workflow.nodes.backtest'

const { t } = useI18n()


</script>
