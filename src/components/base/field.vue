<template>
  <div :class="[className, inline && 'flex w-full items-center justify-between']">
    <div @click="supportFold && toggleFold" :class="['flex items-center justify-between', supportFold && 'cursor-pointer']">
      <div class="flex h-6 items-center">
        <div :class="[isSubTitle? 'system-xs-medium-uppercase text-text-tertiary' :'system-sm-semibold-uppercase text-text-secondary']">
          <template v-if="slots.title">
            <slot name="title" />
          </template>
          <template v-else>{{ title }}</template>
          <span v-if="required" class="text-text-destructive">*</span>
        </div>
        <el-tooltip v-if="slots.tooltip || tooltip" :content="tooltip" placement="top">
          <template v-if="slots.tooltip">
            <slot name="tooltip" />
          </template>
          <template v-else>{{ tooltip }}</template>
        </el-tooltip>
      </div>
      <div class="flex">
        <slot name="operations" />
        <el-icon v-if="supportFold" class="h-4 w-4 cursor-pointer text-text-tertiary transition-transform" :style="{ transform: fold? 'rotate(-90deg)' : 'rotate(0deg)' }"><ArrowDown /></el-icon>
      </div>
    </div>
    <div v-if="slots.default && (!supportFold || (supportFold &&!fold))" :class="!inline &&'mt-1'">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, useSlots, type Component } from 'vue'
import { ArrowDown } from '@element-plus/icons-vue'

type Props = {
  className?: string
  title?: string
  tooltip?: string
  isSubTitle?: boolean
  supportFold?: boolean
  children?: string | null
  inline?: boolean
  required?: boolean
}

defineProps<Props>()

const slots = useSlots()

const fold = ref(true)
const toggleFold = () => {
  fold.value =!fold.value
}
</script>

<style scoped lang="css">
</style>