<template>
  <div>
    <div v-if="options.length > 0" class="mb-1">
      <div
        v-for="(o, index) in options"
        :key="index"
        :class="[
          'group relative flex items-center border overflow-hidden mb-1',
          deletingID === index? 'bg-red-5/20 border-red-7' : ''
        ]"
      >
        <el-input
          :key="index"
          v-model="options[index]"
          @input="handleInputChange(index)"
          class="h-9 w-full grow text-sm leading-9 overflow-hidden"
        />
        <div
          role="button"
          class="absolute right-1.5 top-1/2 block translate-y-[-50%] cursor-pointer rounded-md p-1 text-text-tertiary hover:text-red-7"
          @click="handleDeleteOption(index)"
          @mouseenter="() => deletingID = index"
          @mouseleave="() => deletingID = null"
        >
          <el-icon class="h-3.5 w-3.5"><Delete /></el-icon>
        </div>
      </div>
    </div>
    <div
      @click="handleAddOption"
      class="mt-1 flex h-9 cursor-pointer items-center gap-2 rounded-lg bg-components-button-tertiary-bg px-3  text-components-button-tertiary-text hover:bg-components-button-tertiary-bg-hover"
    >
      <el-icon class="h-4 w-4"><Plus /></el-icon>
      <div class="system-sm-medium text-[13px]">{{ $t('appDebug.variableConfig.addOption') }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Delete, Plus } from '@element-plus/icons-vue'
import cn from '@/utils/classnames'

export type Options = string[]
export type IConfigSelectProps = {
  options: Options
}

const props = defineProps<IConfigSelectProps>()
const emit = defineEmits<{
  (e: 'change', options: Options): void
}>()

const { t } = useI18n()
const deletingID = ref<number | null>(null)

const handleInputChange = (index: number) => (e: Event) => {
  const value = (e.target as HTMLInputElement).value
  emit('change', props.options.map((item, i) => {
    if (index === i) return value
    return item
  }))
}

const handleDeleteOption = (index: number) => {
  emit('change', props.options.filter((_, i) => index!== i))
}

const handleAddOption = () => {
  emit('change', [...props.options, ''])
}
</script>
