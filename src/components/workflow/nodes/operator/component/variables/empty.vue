<template>
  <div class="text-xs flex h-10 items-center justify-center rounded-[10px] bg-background-section text-text-tertiary">
    {{ t('workflow.nodes.operator.setVariables') }}
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

