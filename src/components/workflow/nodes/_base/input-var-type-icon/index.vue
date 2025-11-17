<template>
  <component :is="Icon" :class="className" />
</template>

<script setup lang="ts">
import {
  RiAlignLeft,
  RiBracesLine,
  RiCheckboxLine,
  RiCheckboxMultipleLine,
  RiFileCopy2Line,
  RiFileList2Line,
  RiHashtag,
  RiTextSnippet,
} from '@remixicon/vue'
import { InputVarType } from '@/types'

const props = defineProps<{
  className?: string
  type: InputVarType
}>()

const getIcon = (type: InputVarType) => {
  const iconMap: Record<InputVarType, any> = {
    [InputVarType.textInput]: RiTextSnippet,
    [InputVarType.paragraph]: RiAlignLeft,
    [InputVarType.select]: RiCheckboxMultipleLine,
    [InputVarType.number]: RiHashtag,
    [InputVarType.checkbox]: RiCheckboxLine,
    [InputVarType.jsonObject]: RiBracesLine,
    [InputVarType.singleFile]: RiFileList2Line,
    [InputVarType.multiFiles]: RiFileCopy2Line,
  }
  return iconMap[type] || RiTextSnippet
}

const Icon = getIcon(props.type)
</script>