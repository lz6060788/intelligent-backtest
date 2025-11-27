<template>
  <Editor
    :class-name="className"
    :header-class-name="headerClassName"
    :instance-id="instanceId"
    :key="instanceId"
    :value="payload.text"
    @change="emit('promptChange', $event)"
    :read-only="readOnly"
    :show-remove="canRemove"
    @remove="emit('remove')"
    :is-chat-model="isChatModel"
    :is-show-context="isShowContext"
    :has-set-block-status="hasSetBlockStatus"
    :nodes-output-vars="availableVars"
    :available-nodes="availableNodes"
    :node-id="nodeId"
    :editor-id="id"
    @edition-type-change="emit('editionTypeChange', $event)"
    :var-list="varList"
    @add-variable="emit('addVariable', $event)"
    :is-support-file-var="true"
  >
    <template #title>
      <div :class="cn('relative left-1 flex items-center')">
        <div
          v-if="payload.role === PromptRole.system"
          :class="cn('relative left-[-4px] text-xs font-semibold uppercase text-text-secondary')"
        >
          SYSTEM
        </div>
        <TypeSelector
          v-else
          :value="payload.role as string"
          :all-options="roleOptions"
          :options="canNotChooseSystemRole ? roleOptionsWithoutSystemRole : roleOptions"
          @change="emit('changeChatModeMessageRole', $event)"
          trigger-class-name="text-xs font-semibold text-text-secondary uppercase"
          item-class-name="text-[13px] font-medium text-text-secondary"
        />
        <el-tooltip>
          <template #content>
            <div class="max-w-[180px]">{{ t(`${i18nPrefix}.roleDescription.${payload.role}`) }}</div>
          </template>
          <RiInformationLine class="w-4 h-4 text-text-tertiary hover:text-text-tertiary-hover cursor-pointer" />
        </el-tooltip>
      </div>
    </template>
  </Editor>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ElTooltip } from 'element-plus'
import type { ModelConfig, PromptItem, Variable } from '@/types'
import { EditionType } from '@/types'
import { PromptRole } from '@/types'
import Editor from '@/components/workflow/nodes/_base/prompt/editor.vue'
import TypeSelector from './type-selector.vue'
import cn from '@/utils/classnames'
import { RiInformationLine  } from '@remixicon/vue'

const i18nPrefix = 'workflow.nodes.llm'

/**
 * 组件属性定义
 */
interface Props {
  /** 实例ID */
  instanceId: string
  /** 自定义样式类名 */
  className?: string
  /** 头部样式类名 */
  headerClassName?: string
  /** 是否不能选择系统角色 */
  canNotChooseSystemRole?: boolean
  /** 是否只读 */
  readOnly: boolean
  /** 编辑器ID */
  id: string
  /** 节点ID */
  nodeId: string
  /** 是否可以删除 */
  canRemove: boolean
  /** 是否为聊天模型 */
  isChatModel: boolean
  /** Prompt项数据 */
  payload: PromptItem
  /** 是否显示上下文 */
  isShowContext: boolean
  /** 已设置的块状态 */
  hasSetBlockStatus: {
    context: boolean
    history: boolean
    query: boolean
  }
  /** 可用变量 */
  availableVars: any
  /** 可用节点 */
  availableNodes: any
  /** 变量列表 */
  varList: Variable[]
  /** 模型配置 */
  modelConfig?: ModelConfig
}

const emit = defineEmits<{
  (e: 'changeChatModeMessageRole', role: PromptRole): void;
  (e: 'promptChange', prompt: string): void;
  (e: 'editionTypeChange', editionType: EditionType): void;
  (e: 'remove'): void;
  (e: 'addVariable', payload: any): void;
}>()

defineProps<Props>()

const { t } = useI18n()

/**
 * 角色选项列表
 */
const roleOptions = [
  {
    label: 'system',
    value: PromptRole.system,
  },
  {
    label: 'user',
    value: PromptRole.user,
  },
  {
    label: 'assistant',
    value: PromptRole.assistant,
  },
]

/**
 * 不包含系统角色的选项列表
 */
const roleOptionsWithoutSystemRole = roleOptions.filter(item => item.value !== PromptRole.system)

</script>

