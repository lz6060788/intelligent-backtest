<template>
  <el-tooltip :content="popupContent" placement="top">
    <div :class="cn([className, 'cursor-pointer select-none rounded-md p-1 hover:bg-gray-600'])" @click="onClick">
      <RiRefreshLine className='h-4 w-4 text-text-tertiary' />
    </div>
  </el-tooltip>
</template>

<script setup lang="ts">
import { ElTooltip } from 'element-plus';
import { RiRefreshLine } from '@remixicon/vue'
import cn from '@/utils/classnames';

interface Props {
  className?: string;
  popupContent?: string;
  onClick: () => void;
}

withDefaults(defineProps<Props>(), {
  className: '',
  popupContent: '',
  onClick: () => {}
});
</script>

