<template>
  <div>
    <template v-if="isChatModel && Array.isArray(payload)">
      <div>
        <div class="space-y-2">
          <Draggable
            v-model="payloadWithIds"
            class="space-y-1"
            :handle="'.handle'"
            :ghost-class="'opacity-50'"
            :animation="150"
            :disabled="readOnly"
            item-key="id"
          >
            <div
              v-for="(itemWrapper, index) in payloadWithIds"
              :key="itemWrapper.id"
              class="group relative"
            >
              <template v-if="canDrag(index, itemWrapper.p)">
                <DragHandle class="absolute left-[-14px] top-2 hidden h-3.5 w-3.5 text-text-quaternary group-hover:block" />
              </template>
              <ConfigPromptItem
                :instance-id="itemWrapper.p.role === PromptRole.system ? `${nodeId}-chat-workflow-llm-prompt-editor` : `${nodeId}-chat-workflow-llm-prompt-editor-${index}`"
                :class-name="cn(canDrag(index, itemWrapper.p) && 'handle')"
                :header-class-name="cn(canDrag(index, itemWrapper.p) && 'cursor-grab')"
                :can-not-choose-system-role="!canChooseSystemRole"
                :can-remove="payload.length > 1 && !(index === 0 && itemWrapper.p.role === PromptRole.system)"
                :read-only="readOnly"
                :id="itemWrapper.p.id!"
                :node-id="nodeId"
                @chat-mode-message-role-change="(role: PromptRole) => handleChatModeMessageRoleChange(index, role)"
                :is-chat-model="isChatModel"
                :payload="itemWrapper.p"
                @prompt-change="(prompt: string) => handleChatModePromptChange(index, prompt)"
                @edition-type-change="(editionType: EditionType) => handleChatModeEditionTypeChange(index, editionType)"
                @remove="handleRemove(index)"
                :is-show-context="isShowContext"
                :has-set-block-status="hasSetBlockStatus"
                :available-vars="availableVars"
                :available-nodes="availableNodesWithParent"
                :var-list="varList"
                @add-variable="emit('addVariable', $event)"
                :model-config="modelConfig"
              />
            </div>
          </Draggable>
        </div>
        <!-- 原 AddButton 组件不支持 text 属性，使用 el-button 替代 -->
        <el-button
          class="mt-2"
          size="small"
          type="primary"
          @click="handleAddPrompt"
        >
          {{ t(`${i18nPrefix}.addMessage`) }}
        </el-button>
      </div>
    </template>
    <template v-else>
      <div>
        <Editor
          :instance-id="`${nodeId}-chat-workflow-llm-prompt-editor`"
          :value="((payload as PromptItem).edition_type === EditionType.basic || !(payload as PromptItem).edition_type) ? (payload as PromptItem).text : ((payload as PromptItem).jinja2_text || '')"
          @change="handleCompletionPromptChange"
          :read-only="readOnly"
          :is-chat-model="isChatModel"
          :is-show-context="isShowContext"
          :has-set-block-status="hasSetBlockStatus"
          :nodes-output-vars="availableVars"
          :available-nodes="availableNodesWithParent"
          :is-support-prompt-generator="true"
          :is-support-jinja="true"
          :edition-type="(payload as PromptItem).edition_type"
          :var-list="varList"
          @edition-type-change="handleCompletionEditionTypeChange"
          @add-variable="emit('addVariable', $event)"
          @generated="handleGenerated"
          :model-config="modelConfig"
        >
          <template #title>
            <span class="capitalize">{{ t(`${i18nPrefix}.prompt`) }}</span>
          </template>
        </Editor>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { v4 as uuid4 } from 'uuid'
import { VueDraggable as Draggable } from 'vue-draggable-plus'
import type { ModelConfig, PromptItem, ValueSelector, Var, Variable } from '@/types'
import { EditionType, PromptRole } from '@/types'
import useAvailableVarList from '../../_base/hooks/use-available-var-list'
import ConfigPromptItem from './config-prompt-item.vue'
import cn from '@/utils/classnames'
import Editor from '@/components/workflow/nodes/_base/prompt/editor.vue'
import { ElButton } from 'element-plus'
import DragHandle from '@/components/base/icons/src/vender/line/others/DragHandle.vue'

const i18nPrefix = 'workflow.nodes.llm'

/**
 * 组件属性定义
 */
interface Props {
  /** 是否只读 */
  readOnly: boolean
  /** 节点ID */
  nodeId: string
  /** 变量过滤函数 */
  filterVar: (payload: Var, selector: ValueSelector) => boolean
  /** 是否为聊天模型 */
  isChatModel: boolean
  /** Prompt项数据，可以是单个或数组 */
  payload: PromptItem | PromptItem[]
  /** 是否显示上下文 */
  isShowContext: boolean
  /** 已设置的块状态 */
  hasSetBlockStatus: {
    context: boolean
    history: boolean
    query: boolean
  }
  /** 变量列表 */
  varList?: Variable[]
  /** 模型配置 */
  modelConfig: ModelConfig
}

const emit = defineEmits<{
  (e: 'change', payload: PromptItem | PromptItem[]): void;
  (e: 'addVariable', payload: any): void;
}>()

const props = withDefaults(defineProps<Props>(), {
  varList: () => [],
})

const { t } = useI18n()

/**
 * 将 payload 转换为带 id 的格式，用于拖拽排序
 */
const payloadWithIds = computed({
  get: () => {
    if (props.isChatModel && Array.isArray(props.payload)) {
      return props.payload.map((item) => {
        const id = item.id || uuid4()
        return {
          id,
          p: {
            ...item,
            id,
          },
        }
      })
    }
    return []
  },
  set: (newList) => {
    if (!Array.isArray(props.payload)) return
    // 检查第一个项是否为 system role，如果是则不允许移动到其他位置
    if ((props.payload as PromptItem[])?.[0]?.role === PromptRole.system && newList[0]?.p?.role !== PromptRole.system) {
      return
    }
    emit('change', newList.map(item => item.p))
  },
})

const {
  availableVars,
  availableNodesWithParent,
} = useAvailableVarList(props.nodeId, {
  onlyLeafNodeVar: false,
  filterVar: props.filterVar,
})


/**
 * 处理聊天模式下的 Prompt 变更
 */
const handleChatModePromptChange = (index: number, prompt: string) => {
  if (!Array.isArray(props.payload)) return
  const newPrompt = [...props.payload]
  newPrompt[index] = { ...newPrompt[index], text: prompt }
  emit('change', newPrompt)
}

/**
 * 处理聊天模式下的编辑类型变更
 */
const handleChatModeEditionTypeChange = (index: number, editionType: EditionType) => {
    if (!Array.isArray(props.payload)) return
    const newPrompt = [...props.payload]
    const currentItem = newPrompt[index]
    if (currentItem) {
      newPrompt[index] = { ...currentItem, edition_type: editionType, text: currentItem.text || '' }
      emit('change', newPrompt)
    }
}

/**
 * 处理聊天模式下的消息角色变更
 */
const handleChatModeMessageRoleChange = (index: number, role: PromptRole) => {
    if (!Array.isArray(props.payload)) return
    const newPrompt = [...props.payload]
    const currentItem = newPrompt[index]
    if (currentItem) {
      newPrompt[index] = { ...currentItem, role, text: currentItem.text || '' }
      emit('change', newPrompt)
    }
}

/**
 * 添加新的 Prompt 项
 */
const handleAddPrompt = () => {
  if (!Array.isArray(props.payload)) return
  const newPrompt = [...props.payload]
  if (newPrompt.length === 0) {
    newPrompt.push({ id: uuid4(), role: PromptRole.system, text: '' })
  } else {
    const lastItem = newPrompt[newPrompt.length - 1]
    const isLastItemUser = lastItem?.role === PromptRole.user
    newPrompt.push({ id: uuid4(), role: isLastItemUser ? PromptRole.assistant : PromptRole.user, text: '' })
  }
  emit('change', newPrompt)
}

/**
 * 删除 Prompt 项
 */
const handleRemove = (index: number) => {
  if (!Array.isArray(props.payload)) return
  const newPrompt = [...props.payload]
  newPrompt.splice(index, 1)
  emit('change', newPrompt)
}

/**
 * 处理完成模式下的 Prompt 变更
 */
const handleCompletionPromptChange = (prompt: string) => {
  if (Array.isArray(props.payload)) return
  const payload = props.payload as PromptItem
  const newPrompt = {
    ...payload,
    [payload.edition_type === EditionType.jinja2 ? 'jinja2_text' : 'text']: prompt,
  }
  emit('change', newPrompt)
}

/**
 * 处理生成完成
 */
const handleGenerated = (prompt: string) => {
  handleCompletionPromptChange(prompt)
  // 注意：setControlPromptEditorRerenderKey 在 store 中已被注释，如果需要可以取消注释
  // setTimeout(() => setControlPromptEditorRerenderKey(Date.now()))
}

/**
 * 处理完成模式下的编辑类型变更
 */
const handleCompletionEditionTypeChange = (editionType: EditionType) => {
  if (Array.isArray(props.payload)) return
  const payload = props.payload as PromptItem
  const newPrompt = {
    ...payload,
    edition_type: editionType,
  }
  emit('change', newPrompt)
}

/**
 * 判断是否可以选择系统角色
 */
const canChooseSystemRole = computed(() => {
  if (props.isChatModel && Array.isArray(props.payload))
    return !props.payload.find(item => item.role === PromptRole.system)
  return false
})

/**
 * 判断是否可以拖拽
 */
const canDrag = (index: number, item: PromptItem) => {
  if (props.readOnly)
    return false
  if (index === 0 && item.role === PromptRole.system)
    return false
  return true
}
</script>

