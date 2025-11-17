<template>
  <component
    :is="iconComponent"
    :class="iconClass"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  RiFile3Fill,
  RiFileCodeFill,
  RiFileExcelFill,
  RiFileGifFill,
  RiFileImageFill,
  RiFileMusicFill,
  RiFilePdf2Fill,
  RiFilePpt2Fill,
  RiFileTextFill,
  RiFileVideoFill,
  RiFileWordFill,
  RiMarkdownFill,
} from '@remixicon/vue'
import cn from '@/utils/classnames'

// 文件外观类型枚举
enum FileAppearanceTypeEnum {
  pdf = 'pdf',
  image = 'image',
  video = 'video',
  audio = 'audio',
  document = 'document',
  code = 'code',
  markdown = 'markdown',
  custom = 'custom',
  excel = 'excel',
  word = 'word',
  ppt = 'ppt',
  gif = 'gif',
}

// 文件外观类型
type FileAppearanceType = FileAppearanceTypeEnum

// 文件类型图标映射配置
const FILE_TYPE_ICON_MAP = {
  [FileAppearanceTypeEnum.pdf]: {
    component: RiFilePdf2Fill,
    color: 'text-[#EA3434]',
  },
  [FileAppearanceTypeEnum.image]: {
    component: RiFileImageFill,
    color: 'text-[#00B2EA]',
  },
  [FileAppearanceTypeEnum.video]: {
    component: RiFileVideoFill,
    color: 'text-[#844FDA]',
  },
  [FileAppearanceTypeEnum.audio]: {
    component: RiFileMusicFill,
    color: 'text-[#FF3093]',
  },
  [FileAppearanceTypeEnum.document]: {
    component: RiFileTextFill,
    color: 'text-[#6F8BB5]',
  },
  [FileAppearanceTypeEnum.code]: {
    component: RiFileCodeFill,
    color: 'text-[#BCC0D1]',
  },
  [FileAppearanceTypeEnum.markdown]: {
    component: RiMarkdownFill,
    color: 'text-[#309BEC]',
  },
  [FileAppearanceTypeEnum.custom]: {
    component: RiFile3Fill,
    color: 'text-[#BCC0D1]',
  },
  [FileAppearanceTypeEnum.excel]: {
    component: RiFileExcelFill,
    color: 'text-[#01AC49]',
  },
  [FileAppearanceTypeEnum.word]: {
    component: RiFileWordFill,
    color: 'text-[#2684FF]',
  },
  [FileAppearanceTypeEnum.ppt]: {
    component: RiFilePpt2Fill,
    color: 'text-[#FF650F]',
  },
  [FileAppearanceTypeEnum.gif]: {
    component: RiFileGifFill,
    color: 'text-[#00B2EA]',
  },
} as const

// 尺寸映射
const SizeMap = {
  sm: 'size-4',
  md: 'size-[18px]',
  lg: 'size-5',
  xl: 'size-6',
} as const

// 组件属性类型定义
interface FileTypeIconProps {
  /** 文件类型 */
  type: FileAppearanceType
  /** 图标尺寸 */
  size?: 'sm' | 'md' | 'lg' | 'xl'
  /** 自定义类名 */
  className?: string
}

// 定义组件属性，设置默认值
const props = withDefaults(defineProps<FileTypeIconProps>(), {
  size: 'sm',
  className: '',
})

// 计算图标组件
const iconComponent = computed(() => {
  return FILE_TYPE_ICON_MAP[props.type]?.component || FILE_TYPE_ICON_MAP[FileAppearanceTypeEnum.document].component
})

// 计算图标类名
const iconClass = computed(() => {
  const color = FILE_TYPE_ICON_MAP[props.type]?.color || FILE_TYPE_ICON_MAP[FileAppearanceTypeEnum.document].color
  return cn('shrink-0', SizeMap[props.size], color, props.className)
})
</script>
