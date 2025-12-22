<template>
  <div :class="cn(props.className, !props.readonly && 'cursor-pointer')">
    <el-popover
      v-model:visible="open"
      :placement="props.isAddBtnTrigger ? 'bottom-end' : 'bottom-start'"
      :width="props.isAddBtnTrigger ? 260 : (props.minWidth || triggerWidth)"
      :offset="4"
      trigger="click"
      teleported
      :persistent="false"
      :show-arrow="false"
      popper-class="custom-popover"
      :style="{ zIndex: props.zIndex || 100 }"
    >
      <template #reference>
        <div
          @click="handleWrapClick"
          :class="cn('group/picker-trigger-wrap relative !flex')"
        >
          <template v-if="props.isAddBtnTrigger">
            <div>
              <AddButton />
            </div>
          </template>
          <template v-else>
            <div
              :ref="!props.isSupportConstantValue ? triggerRef : null"
              :class="cn(
                (open || isFocus) ? 'border-blue-500' : 'border-gray-600',
                'group/wrap relative flex h-8 w-full items-center border border-solid',
                !props.isSupportConstantValue && 'rounded-[4px] bg-gray-700 p-1',
                props.isInTable && 'border-none bg-transparent',
                props.readonly && 'bg-gray-900'
              )"
            >
              <template v-if="props.isSupportConstantValue">
                <div
                  @click.stop="handleTypeSelectorClick"
                  class="mr-1 flex h-full items-center space-x-1"
                >
                  <el-select :model-value="varKindType" :options="varKindTypes" @change="handleVarKindTypeChange" />
                </div>
              </template>
              <template v-else>
                <div v-if="!hasValue" class="ml-1.5 mr-1">
                  <Variable02
                    :class="`h-4 w-4 text-gray-400`"
                  />
                </div>
              </template>

              <template v-if="isConstant">
                <!-- <ConstantField
                  :value="value as string"
                  :schema="schemaWithDynamicSelect as CredentialFormSchema"
                  :readonly="props.readonly"
                  :is-loading="isLoading"
                  @change="handleConstantChange"
                /> -->
              </template>
              <template v-else>
                <div
                  @click="handleVarPickerClick"
                  class="h-full grow max-w-full"
                >
                  <div
                    :ref="props.isSupportConstantValue ? triggerRef : null"
                    :class="cn('h-full', props.isSupportConstantValue && 'flex items-center rounded-lg bg-components-panel-bg py-1 pl-1')"
                  >
                    <el-tooltip
                      :content="tooltipPopupText"
                      :disabled="!tooltipPopupText"
                      placement="top"
                    >
                      <div
                        :class="cn(
                          'h-full items-center rounded-[5px] px-1.5 max-w-full',
                          hasValue ? 'inline-flex bg-gray-600' : 'flex'
                        )"
                      >
                        <template v-if="hasValue">
                          <template v-if="props.isShowNodeName && !varInfo.isEnv && !varInfo.isChatVar && !varInfo.isRagVar">
                            <div
                              class="flex items-center"
                              @click.stop="handleNodeNameClick"
                            >
                              <div class="h-4 px-[1px]">
                                <BlockIcon
                                  v-if="outputVarNode?.type"
                                  class="!text-text-primary"
                                  :type="outputVarNode?.type"
                                  size="xs"
                                />
                              </div>
                              <div
                                class="mx-0.5 truncate text-xs font-medium text-text-secondary"
                                :title="outputVarNode?.title"
                                :style="{ maxWidth: `${maxNodeNameWidth}px` }"
                              >
                                {{ outputVarNode?.title }}
                              </div>
                              <Line3 class="mr-0.5" />
                            </div>
                          </template>
                          <template v-if="isShowAPart">
                            <div class="flex items-center">
                              <RiMoreLine class="h-3 w-3 text-text-secondary" />
                              <Line3 class="mr-0.5 text-divider-deep" />
                            </div>
                          </template>
                          <div class="flex items-center text-text-accent overflow-hidden">
                            <!-- <RiLoader4Line
                              v-if="isLoading"
                              class="h-3.5 w-3.5 animate-spin text-text-secondary"
                            /> -->
                            <VariableIconWithColor
                              :variable-category="variableCategory"
                              :is-exception-variable="varInfo.isException"
                            />
                            <div
                              :class="cn(
                                'ml-0.5 truncate text-xs font-medium',
                                varInfo.isEnv && '!text-text-secondary',
                                varInfo.isChatVar && 'text-util-colors-teal-teal-700',
                                varInfo.isException && 'text-text-warning'
                              )"
                              :title="varName"
                              :style="{ maxWidth: `${maxVarNameWidth}px` }"
                            >
                              {{ varName }}
                            </div>
                          </div>
                          <div
                            class="text-xs ml-0.5 truncate text-center capitalize text-text-tertiary shrink-0"
                            :title="type"
                            :style="{ maxWidth: `${maxTypeWidth}px` }"
                          >
                            {{ type }}
                          </div>
                          <RiErrorWarningFill
                            v-if="!varInfo.isValidVar"
                            class="ml-0.5 h-3 w-3 text-text-destructive"
                          />
                        </template>
                        <template v-else>
                          <div
                            :class="`overflow-hidden text-gray-400 text-sm system-sm-regular text-ellipsis`"
                          >
                            <!-- <template v-if="isLoading">
                              <div class="flex items-center">
                                <RiLoader4Line class="mr-1 h-3.5 w-3.5 animate-spin text-text-secondary" />
                                <span>{{ props.placeholder ?? t('workflow.common.setVarValuePlaceholder') }}</span>
                              </div>
                            </template> -->
                            {{ placeholder ?? t('workflow.common.setVarValuePlaceholder') }}
                          </div>
                        </template>
                      </div>
                    </el-tooltip>
                  </div>
                </div>
              </template>

              <template v-if="hasValue && !props.readonly && !props.isInTable">
                <div
                  class="group invisible absolute right-1 top-[50%] h-5 translate-y-[-50%] cursor-pointer rounded-md px-0.5 hover:bg-gray-600 group-hover/wrap:visible"
                  @click.stop="handleClearVar"
                >
                  <RiCloseLine class="h-4 w-4 text-text-tertiary group-hover:text-text-secondary" />
                </div>
              </template>
              <template v-if="!hasValue && props.valueTypePlaceHolder">
                <Badge
                  class="absolute right-1 top-[50%] translate-y-[-50%] capitalize shrink-0"
                  :text="props.valueTypePlaceHolder"
                  :uppercase="false"
                />
              </template>
            </div>
          </template>

          <template v-if="!props.readonly && props.isInTable">
            <RemoveButton
              class="absolute right-1 top-0.5 hidden group-hover/picker-trigger-wrap:block"
              @click="removeHandle"
            />
          </template>

          <template v-if="!hasValue && props.typePlaceHolder">
            <Badge
              class="absolute right-2 top-1.5"
              :text="props.typePlaceHolder"
              :uppercase="false"
            />
          </template>
        </div>
      </template>

      <template v-if="!isConstant">
        <VarReferencePopup
          :vars="outputVars"
          :popup-for="props.popupFor"
          :item-width="props.isAddBtnTrigger ? 260 : (props.minWidth || triggerWidth)"
          :is-support-file-var="props.isSupportFileVar"
          :z-index="props.zIndex"
          :prefer-schema-type="props.preferSchemaType"
          @change="handleVarReferenceChange"
        />
      </template>
    </el-popover>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted, nextTick, toRefs } from 'vue'
import { useI18n } from 'vue-i18n'
import { useVueFlow, type GraphNode } from '@vue-flow/core'
import {
  RiArrowDownSLine,
  RiCloseLine,
  RiErrorWarningFill,
  RiLoader4Line,
  RiMoreLine,
} from '@remixicon/vue'
import RemoveButton from '@/components/base/remove-button/index.vue'
import useAvailableVarList from '@/components/workflow/nodes/_base/hooks/use-available-var-list.ts'
// VarReferencePopup 组件需要根据实际实现调整
import VarReferencePopup from './var-reference-popup.vue'
import {
  getNodeInfoById,
  isConversationVar,
  isENV,
  isRagVariableVar,
  isSystemVar,
  removeFileVars,
  varTypeToStructType,
} from './utils'
// ConstantField 组件需要根据实际实现调整
// import ConstantField from '@/components/workflow/nodes/_base/variable/constant-field.vue'
import cn from '@/utils/classnames'
import type {
  CommonNodeType,
  Node,
  NodeOutPutVar,
  // ToolWithProvider,
  ValueSelector,
  Var,
} from '@/types'
import { BlockEnum } from '@/types'
import BlockIcon from '@/components/workflow/block-icon.vue'
import { Line3 } from '@/components/base/icons/src/public/common'
import { Variable02 } from '@/components/base/icons/src/vender/solid/development'
import { useWorkflowVariables } from '@/components/workflow/hooks'
import { VarType as VarKindType } from '../../tool/types'
// import TypeSelector from '@/components/workflow/nodes/_base/selector'
import AddButton from '@/components/base/add-button/index.vue'
import Badge from '@/components/base/badge/index.vue'
import { isExceptionVariable } from '@/components/workflow/utils'
// VarFullPathPanel 组件需要根据实际实现调整
// import VarFullPathPanel from './var-full-path-panel'
import { useWorkflowInstance } from '@/components/workflow/hooks/use-workflow-instance'
import { VariableIconWithColor } from '@/components/workflow/nodes/_base/variable/variable-label'
import { cloneDeep } from 'lodash-es'

const TRIGGER_DEFAULT_WIDTH = 227

interface Props {
  /** 自定义类名 */
  className?: string
  /** 节点ID */
  nodeId: string
  /** 是否显示节点名称 */
  isShowNodeName?: boolean
  /** 是否只读 */
  readonly: boolean
  /** 当前值 */
  value: ValueSelector | string
  /** 是否支持常量值 */
  isSupportConstantValue?: boolean
  /** 默认变量类型 */
  defaultVarKindType?: VarKindType
  /** 是否只显示叶子节点变量 */
  onlyLeafNodeVar?: boolean
  /** 变量过滤函数 */
  filterVar?: (payload: Var, valueSelector: ValueSelector) => boolean
  /** 是否过滤文件变量 */
  isFilterFileVar?: boolean
  /** 可用节点列表 */
  availableNodes?: Node[]
  /** 可用变量列表 */
  availableVars?: NodeOutPutVar[]
  /** 是否使用添加按钮触发 */
  isAddBtnTrigger?: boolean
  /** Schema配置 */
  // schema?: Partial<CredentialFormSchema>
  /** 值类型占位符 */
  valueTypePlaceHolder?: string
  /** 是否在表格中 */
  isInTable?: boolean
  /** 类型占位符 */
  typePlaceHolder?: string
  /** 是否支持文件变量 */
  isSupportFileVar?: boolean
  /** 占位符文本 */
  placeholder?: string
  /** 最小宽度 */
  minWidth?: number
  /** 弹出框用途 */
  popupFor?: 'assigned' | 'toAssigned'
  /** 层级 */
  zIndex?: number
  // /** 当前工具 */
  // currentTool?: Tool
  // /** 当前提供者 */
  // currentProvider?: ToolWithProvider
  /** 是否优先使用Schema类型 */
  preferSchemaType?: boolean
}

const emit = defineEmits<{
  (e: 'change', value: ValueSelector | string, varKindType: VarKindType, varInfo?: Var): void;
  (e: 'open', value: boolean): void;
  (e: 'remove'): () => void;
}>()

const removeHandle = () => {
  emit('remove')
}

const props = withDefaults(defineProps<Props>(), {
  isShowNodeName: true,
  value: () => [],
  defaultVarKindType: VarKindType.constant,
  filterVar: () => true,
  isSupportFileVar: true,
})

const { t } = useI18n()
const { instanceId } = useWorkflowInstance()
const { nodes } = useVueFlow(instanceId)
const { getCurrentVariableType } = useWorkflowVariables()

const availableData = ref(useAvailableVarList(props.nodeId, {
  onlyLeafNodeVar: props.onlyLeafNodeVar,
  passedInAvailableNodes: props.availableNodes,
  filterVar: props.filterVar,
}))

// 监听 props 变化
watch([() => props.nodeId, () => props.onlyLeafNodeVar, () => props.availableNodes, () => props.filterVar], () => {
  availableData.value = useAvailableVarList(props.nodeId, {
    onlyLeafNodeVar: props.onlyLeafNodeVar,
    passedInAvailableNodes: props.availableNodes,
    filterVar: props.filterVar,
  }, instanceId)
}, { deep: true })

const availableVars = computed(() => availableData.value.availableVars)
const availableNodes = computed(() => availableData.value.availableNodesWithParent)

const startNode = availableNodes.value.find((node: Node) => node.data!.type === BlockEnum.Start || node.data!.type === BlockEnum.OperatorStart)

const node = computed(() => nodes.value.find(n => n.id === props.nodeId))
const isInIteration = computed(() => !!(node.value?.data as any)?.isInIteration)
const iterationNode = computed(() =>
  isInIteration.value ? nodes.value.find(n => n.id === node.value?.parentNode) : null
)

const isInLoop = computed(() => !!(node.value?.data as any)?.isInLoop)
const loopNode = computed(() =>
  isInLoop.value ? nodes.value.find(n => n.id === node.value?.parentNode) : null
)

const triggerRef = ref()
const triggerWidth = ref(TRIGGER_DEFAULT_WIDTH)

onMounted(() => {
  nextTick(() => {
    if (triggerRef.value) {
      triggerWidth.value = triggerRef.value.clientWidth
    }
  })
})

watch(triggerRef, () => {
  nextTick(() => {
    if (triggerRef.value) {
      triggerWidth.value = triggerRef.value.clientWidth
    }
  })
})

const varKindType = ref<VarKindType>(props.defaultVarKindType)
const isConstant = computed(() => props.isSupportConstantValue && varKindType.value === VarKindType.constant)

const outputVars = computed(() => {
  const results = props.availableVars || availableVars.value
  return props.isFilterFileVar ? removeFileVars(results) : results
})

const open = ref(false)

watch(open, () => {
  emit('open', open.value)
})

const hasValue = computed(() => !isConstant.value && (Array.isArray(props.value) ? props.value.length > 0 : false))

const isIterationVar = computed(() => {
  if (!isInIteration.value) return false
  if (Array.isArray(props.value) && props.value[0] === node.value?.parentNode && ['item', 'index'].includes(props.value[1] as string))
    return true
  return false
})

const isLoopVar = computed(() => {
  if (!isInLoop.value) return false
  if (Array.isArray(props.value) && props.value[0] === node.value?.parentNode && ['item', 'index'].includes(props.value[1] as string))
    return true
  return false
})

const outputVarNodeId = computed(() => (hasValue.value && Array.isArray(props.value) ? props.value[0] : '') as string)

const outputVarNode = computed(() => {
  if (!hasValue.value || isConstant.value) return null

  if (isIterationVar.value) return iterationNode.value?.data

  if (isLoopVar.value) return loopNode.value?.data

  if (Array.isArray(props.value) && isSystemVar(props.value as ValueSelector))
    return startNode?.data

  const node = getNodeInfoById(availableNodes.value, outputVarNodeId.value)?.data
  if (node) {
    return {
      ...node,
      id: outputVarNodeId.value,
    }
  }
  return null
})

const isShowAPart = computed(() =>
  Array.isArray(props.value) && props.value.length > 2 && !isRagVariableVar(props.value as ValueSelector)
)

const varName = computed(() => {
  if (!hasValue.value) return ''

  const isSystem = Array.isArray(props.value) && isSystemVar(props.value as ValueSelector)
  const name = Array.isArray(props.value) ? props.value[props.value.length - 1] : ''
  return `${isSystem ? 'sys.' : ''}${name}`
})

const varKindTypes = [
  {
    label: 'Variable',
    value: VarKindType.variable,
  },
  {
    label: 'Constant',
    value: VarKindType.constant,
  },
]

const handleVarKindTypeChange = (value: VarKindType) => {
  varKindType.value = value
  if (value === VarKindType.constant)
    emit('change', '', value)
  else
    emit('change', [], value)
}

const inputRef = ref<HTMLInputElement | null>(null)
const isFocus = ref(false)
const controlFocus = ref(0)

watch(controlFocus, () => {
  if (controlFocus.value && inputRef.value) {
    inputRef.value.focus()
    isFocus.value = true
  }
})

const handleVarReferenceChange = (value: ValueSelector, varInfo: Var) => {
  const newValue = cloneDeep(value)
  if (newValue[1] && typeof newValue[1] === 'string' && newValue[1].startsWith('sys.')) {
    newValue.shift()
    const paths = (newValue[0] as string).split('.')
    paths.forEach((p, i) => {
      newValue[i] = p
    })
  }
  emit('change', newValue, varKindType.value, varInfo)
  open.value = false
}

const handleClearVar = () => {
  if (varKindType.value === VarKindType.constant)
    emit('change', '', varKindType.value)
  else
    emit('change', [], varKindType.value)
}

const handleVariableJump = (nodeId: string | undefined) => {
  if (!nodeId) return
  const currentNodeIndex = availableNodes.value.findIndex(node => node.id === nodeId)
  const currentNode = availableNodes.value[currentNodeIndex] as GraphNode

  const workflowContainer = document.getElementById('workflow-container')
  if (!workflowContainer || !currentNode) return

  const { clientWidth, clientHeight } = workflowContainer
  const { viewport } = useVueFlow(instanceId)
  const zoom = viewport.value.zoom
  const position = currentNode.position

  viewport.value = {
    x: (clientWidth - 400 - (currentNode.dimensions.width || 0) * zoom) / 2 - position.x * zoom,
    y: (clientHeight - (currentNode.dimensions.height || 0) * zoom) / 2 - position.y * zoom,
    zoom: viewport.value.zoom,
  }
}

const isChatMode = computed(() => false)

const type = computed(() =>
  getCurrentVariableType({
    parentNode: (isInIteration.value ? iterationNode.value : loopNode.value) as any,
    valueSelector: props.value as ValueSelector,
    availableNodes: availableNodes.value,
    isChatMode: isChatMode.value,
    isConstant: !!isConstant.value,
    preferSchemaType: props.preferSchemaType,
  })
)

const varInfo = computed(() => {
  const env = Array.isArray(props.value) && isENV(props.value as ValueSelector)
  const chatVar = Array.isArray(props.value) && isConversationVar(props.value as ValueSelector)
  const ragVar = Array.isArray(props.value) && isRagVariableVar(props.value as ValueSelector)
  const validVar = Boolean(outputVarNode.value) || env || chatVar || ragVar
  const exception = isExceptionVariable(varName.value, outputVarNode.value?.type)
  return {
    isEnv: env,
    isChatVar: chatVar,
    isRagVar: ragVar,
    isValidVar: validVar,
    isException: exception,
  }
})

// 8(left/right-padding) + 14(icon) + 4 + 14 + 2 = 42 + 17 buff
const availableWidth = computed(() => triggerWidth.value - 56)

const maxNodeNameWidth = computed(() => {
  const totalTextLength = ((outputVarNode.value?.title || '') + (varName.value || '') + (type.value || '')).length
  if (totalTextLength === 0) return 0
  const PRIORITY_WIDTH = 15
  return PRIORITY_WIDTH + Math.floor(((outputVarNode.value?.title?.length || 0) / totalTextLength) * availableWidth.value)
})

const maxVarNameWidth = computed(() => {
  const totalTextLength = ((outputVarNode.value?.title || '') + (varName.value || '') + (type.value || '')).length
  if (totalTextLength === 0) return 0
  const PRIORITY_WIDTH = 15
  return -PRIORITY_WIDTH + Math.floor(((varName.value?.length || 0) / totalTextLength) * availableWidth.value)
})

const maxTypeWidth = computed(() => {
  const totalTextLength = ((outputVarNode.value?.title || '') + (varName.value || '') + (type.value || '')).length
  if (totalTextLength === 0) return 0
  return Math.floor(((type.value?.length || 0) / totalTextLength) * availableWidth.value)
})


const tooltipPopupText = computed(() => {
  if (varInfo.value.isValidVar && isShowAPart.value) {
    // VarFullPathPanel 组件用于显示完整路径，这里返回空字符串，实际使用时需要根据组件实现调整
    return ''
  }
  if (!varInfo.value.isValidVar && hasValue.value)
    return t('workflow.errorMsg.invalidVariable')

  return ''
})


const variableCategory = computed(() => {
  if (varInfo.value.isEnv) return 'environment'
  if (varInfo.value.isChatVar) return 'conversation'
  if (isLoopVar.value) return 'loop'
  if (varInfo.value.isRagVar) return 'rag'
  return 'system'
})

const handleWrapClick = (e: MouseEvent) => {
  // if (props.readonly) return
  // e.stopPropagation()
  // if (!isConstant.value)
  //   open.value = !open.value
  // else
  //   controlFocus.value = Date.now()
}

const handleTypeSelectorClick = () => {
  open.value = false
  controlFocus.value = Date.now()
}

const handleVarPickerClick = (e: MouseEvent) => {
  if (props.readonly) return
  e.stopPropagation()
  if (!isConstant.value)
    open.value = !open.value
  else
    controlFocus.value = Date.now()
}

const handleNodeNameClick = (e: MouseEvent) => {
  if (e.metaKey || e.ctrlKey) {
    e.stopPropagation()
    handleVariableJump(outputVarNode.value?.id as string)
  }
}

const handleConstantChange = (value: string | number) => {
  emit('change', value.toString(), VarKindType.constant)
}
</script>

