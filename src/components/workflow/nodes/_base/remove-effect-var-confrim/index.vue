<template>
</template>

<script setup lang="ts">
import { ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { watch, ref } from 'vue'

const props = defineProps<{
  isShow: boolean
  onConfirm: () => void
  onCancel: () => void
}>()

const { t } = useI18n()
const i18nPrefix = 'workflow.common.effectVarConfirm'
// 用于避免重复触发的标记
const isVisible = ref(false)

watch(
  () => props.isShow,
  (newVal) => {
    if (newVal && !isVisible.value) {
      isVisible.value = true
      ElMessageBox.confirm(
        t(`${i18nPrefix}.content`),
        t(`${i18nPrefix}.title`),
        {
          confirmButtonText: t('common.confirm'), // 假设通用确认文本键名
          cancelButtonText: t('common.cancel'),   // 假设通用取消文本键名
          type: 'warning'
        }
      )
        .then(() => {
          props.onConfirm()
        })
        .catch(() => {
          props.onCancel()
        })
        .finally(() => {
          isVisible.value = false
        })
    }
  }
)
</script>