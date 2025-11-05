import path from 'node:path'
import { access, appendFile, mkdir, open, readdir, rm, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { parseXml } from '@rgrove/parse-xml'
import { camelCase, template } from 'lodash-es'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// 创建目录工具函数
const generateDir = async (currentPath) => {
  try {
    await mkdir(currentPath, { recursive: true })
  } catch (err) {
    console.error(err.message)
  }
}

// 处理 SVG 结构（替换颜色为 currentColor）
const processSvgStructure = (svgStructure, replaceFillOrStrokeColor) => {
  if (svgStructure?.children.length) {
    svgStructure.children = svgStructure.children.filter(c => c.type !== 'text')

    svgStructure.children.forEach((child) => {
      if (child?.name === 'path' && replaceFillOrStrokeColor) {
        if (child?.attributes?.stroke)
          child.attributes.stroke = 'currentColor'
        if (child?.attributes.fill)
          child.attributes.fill = 'currentColor'
      }
      if (child?.children.length)
        processSvgStructure(child, replaceFillOrStrokeColor)
    })
  }
}

// 生成 SVG 图标组件（Vue3 版本）
const generateSvgComponent = async (fileHandle, entry, pathList, replaceFillOrStrokeColor) => {
  const currentPath = path.resolve(__dirname, 'src', ...pathList.slice(2))
  await generateDir(currentPath)

  // 解析 SVG 为 JSON 结构
  const svgString = await fileHandle.readFile({ encoding: 'utf8' })
  const svgJson = parseXml(svgString).toJSON()
  const svgStructure = svgJson.children[0]
  processSvgStructure(svgStructure, replaceFillOrStrokeColor)
  
  // 处理文件名（驼峰+首字母大写）
  const prefixFileName = camelCase(entry.split('.')[0])
  const fileName = prefixFileName.charAt(0).toUpperCase() + prefixFileName.slice(1)
  const svgData = {
    icon: svgStructure,
    name: fileName,
  }

  // Vue 组件模板
  const componentTemplate = template(`
<!-- GENERATE BY script -->
<!-- DO NOT EDIT IT MANUALLY -->
<template>
  <IconBase v-bind="$attrs" :data="data" />
</template>

<script setup lang="ts">
import IconBase from '@/components/base/icons/IconBase.vue'
import data from './<%= svgName %>.json'
import type { IconData } from '@/components/base/icons/IconBase.vue'

const iconData = data as IconData
</script>

<script lang="ts">
export default {
  name: '<%= svgName %>Icon'
}
</script>
  `.trim())

  // 写入 JSON 数据和 Vue 组件
  await writeFile(
    path.resolve(currentPath, `${fileName}.json`),
    `${JSON.stringify(svgData, '', '\t')}\n`
  )
  await writeFile(
    path.resolve(currentPath, `${fileName}.vue`),
    `${componentTemplate({ svgName: fileName })}\n`
  )

  // 生成索引文件
  const indexTemplate = template(`
export { default as <%= svgName %> } from './<%= svgName %>.vue'
  `.trim())
  await appendFile(
    path.resolve(currentPath, 'index.ts'),
    `${indexTemplate({ svgName: fileName })}\n`
  )
}

// 生成图片图标组件（Vue3 版本，处理 PNG）
const generateImageComponent = async (entry, pathList) => {
  const currentPath = path.resolve(__dirname, 'src', ...pathList.slice(2))
  await generateDir(currentPath)

  // 处理文件名
  const prefixFileName = camelCase(entry.split('.')[0])
  const fileName = prefixFileName.charAt(0).toUpperCase() + prefixFileName.slice(1)

  // CSS 模块模板
  const cssTemplate = template(`
.wrapper {
  display: inline-flex;
  background: url(<%= assetPath %>) center center no-repeat;
  background-size: contain;
}
  `.trim())
  await writeFile(
    path.resolve(currentPath, `${fileName}.module.css`),
    `${cssTemplate({
      assetPath: path.posix.join('~@/components/base/icons/assets', ...pathList.slice(2), entry)
    })}\n`
  )

  // Vue 组件模板
  const componentTemplate = template(`
<!-- GENERATE BY script -->
<!-- DO NOT EDIT IT MANUALLY -->
<template>
  <span 
    :class="[s.wrapper, className]" 
    v-bind="$attrs"
    ref="ref"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import cn from '@/utils/classnames'
import s from './<%= fileName %>.module.css'

const props = defineProps<{
  className?: string
  ref?: any
}>()
</script>

<script lang="ts">
export default {
  name: '<%= fileName %>Icon'
}
</script>
  `.trim())

  // 写入组件和索引
  await writeFile(
    path.resolve(currentPath, `${fileName}.vue`),
    `${componentTemplate({ fileName })}\n`
  )

  const indexTemplate = template(`
export { default as <%= fileName %> } from './<%= fileName %>.vue'
  `.trim())
  await appendFile(
    path.resolve(currentPath, 'index.ts'),
    `${indexTemplate({ fileName })}\n`
  )
}

// 遍历目录处理文件
const walk = async (entry, pathList, replaceFillOrStrokeColor) => {
  const currentPath = path.resolve(...pathList, entry)
  let fileHandle

  try {
    fileHandle = await open(currentPath)
    const stat = await fileHandle.stat()

    if (stat.isDirectory()) {
      const files = await readdir(currentPath)
      for (const file of files) {
        await walk(file, [...pathList, entry], replaceFillOrStrokeColor)
      }
    }

    // 处理 SVG 文件
    if (stat.isFile() && /.+\.svg$/g.test(entry)) {
      await generateSvgComponent(fileHandle, entry, pathList, replaceFillOrStrokeColor)
    }

    // 处理 PNG 文件
    if (stat.isFile() && /.+\.png$/g.test(entry)) {
      await generateImageComponent(entry, pathList)
    }
  } finally {
    fileHandle?.close()
  }
}

// 执行生成流程
(async () => {
  // 清空旧文件
  await rm(path.resolve(__dirname, 'src'), { recursive: true, force: true })
  // 遍历资源目录生成组件
  await walk('public', [__dirname, 'assets'])
  await walk('vender', [__dirname, 'assets'], true)
  await walk('image', [__dirname, 'assets'])
})()