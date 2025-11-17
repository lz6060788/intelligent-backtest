<template>
  <div :class="[className, readonly ? '' : 'cursor-pointer select-none']">
    <el-popover
      v-model="open"
      placement="bottom-start"
      :offset="4"
      :popper-options="{ zIndex: 100 }"
      popper-class="custom-popover"
    >
      <template #reference>
        <div
          class="w-[120px] cursor-pointer"
        >
          <div class="flex h-8 items-center justify-between rounded-lg border-0 bg-gray-700 px-2.5 text-[13px] text-white">
            <div class="w-0 grow truncate capitalize" :title="value">{{ value }}</div>
            <RiArrowDownSLine class="h-3.5 w-3.5 shrink-0 text-text-secondary" />
          </div>
        </div>
      </template>
      <div class="w-[120px] rounded-lg bg-gray-700 p-1 shadow-sm">
        <div
          v-for="type in TYPES"
          :key="type"
          class="flex h-[30px] cursor-pointer items-center justify-between rounded-lg pl-3 pr-2 text-[13px] text-white hover:bg-gray-600"
          @click="handleChange(type)"
        >
          <div class="w-0 grow truncate capitalize">{{ type }}</div>
          <Check v-if="type === value" class="h-4 w-4 shrink-0 text-text-accent" />
        </div>
      </div>
    </el-popover>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElPopover } from 'element-plus'
import { RiArrowDownSLine } from '@remixicon/vue'
import { Check } from '@/components/base/icons/src/vender/line/general'
import { VarType } from '@/types'

interface Props {
  className?: string
  readonly: boolean
  value: string
}

const emit = defineEmits(['change'])

defineProps<Props>()
const open = ref(false)
const TYPES = [VarType.string, VarType.number, VarType.boolean, VarType.arrayNumber, VarType.arrayString, VarType.arrayBoolean, VarType.arrayObject, VarType.object]

const handleChange = (type: string) =>{
  open.value = false
  emit('change', type)
}
</script>
