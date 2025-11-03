<template>
  <div>
    <div
      v-for="(item, index) in sortedCases"
      :key="item.case_id"
    >
      <div
        :class="cn(
          'group relative rounded-[10px] bg-components-panel-bg',
          willDeleteCaseId === item.case_id && 'bg-state-destructive-hover',
          !isSubVariable && 'min-h-[40px] px-3 py-1 ',
          isSubVariable && 'px-1 py-2',
        )"
      >
        <template v-if="!isSubVariable">
          <i
            :class="cn(
              'handle absolute left-1 top-2 h-3 w-3 cursor-pointer text-text-quaternary',
              casesLength > 1 && 'group-hover:block',
              casesLength === 1 && 'hidden',
            )"
            :data-sortable-handle="true"
          >
            <i class="i-ri-drag-move-line" />
          </i>
          <div
            :class="cn(
              'absolute left-4 text-[13px] font-semibold leading-4 text-text-secondary',
              casesLength === 1 ? 'top-2.5' : 'top-1',
            )"
          >
            {{ index === 0 ? 'IF' : 'ELIF' }}
            <div
              v-if="casesLength > 1"
              class="text-[10px] font-medium text-text-tertiary"
            >
              CASE {{ index + 1 }}
            </div>
          </div>
        </template>

        <template v-if="!!item.conditions.length">
          <div class="mb-2">
            <ConditionList
              :disabled="readOnly"
              :case-item="item"
              :case-id="isSubVariable ? caseId! : item.case_id"
              :condition-id="conditionId"
              :on-update-condition="handleUpdateCondition"
              :on-remove-condition="handleRemoveCondition"
              :on-toggle-condition-logical-operator="handleToggleConditionLogicalOperator"
              :node-id="id"
              :nodes-output-vars="nodesOutputVars"
              :available-nodes="availableNodes"
              :filter-var="filterVar"
              :number-variables="getAvailableVars(id, '', filterNumberVar)"
              :vars-is-var-file-attribute="varsIsVarFileAttribute"
              :on-add-sub-variable-condition="handleAddSubVariableCondition"
              :on-remove-sub-variable-condition="handleRemoveSubVariableCondition"
              :on-update-sub-variable-condition="handleUpdateSubVariableCondition"
              :on-toggle-sub-variable-condition-logical-operator="handleToggleSubVariableConditionLogicalOperator"
              :is-sub-variable="isSubVariable"
            />
          </div>
        </template>

        <div
          :class="cn(
            'flex items-center justify-between pr-[30px]',
            !item.conditions.length && !isSubVariable && 'mt-1',
            !item.conditions.length && isSubVariable && 'mt-2',
            !isSubVariable && ' pl-[60px]',
          )"
        >
          <template v-if="isSubVariable">
            <Select
              popup-inner-class-name="w-[165px] max-h-none"
              :on-select="(value: any) => handleAddSubVariableCondition?.(caseId!, conditionId!, value.value as string)"
              :items="subVarOptions"
              value=""
            >
              <template #trigger>
                <Button
                  size="small"
                  :disabled="readOnly"
                >
                  <i class="i-ri-add-line mr-1 h-3.5 w-3.5" />
                  {{ t('workflow.nodes.ifElse.addSubVariable') }}
                </Button>
              </template>
            </Select>
          </template>
          <template v-else>
            <ConditionAdd
              :disabled="readOnly"
              :case-id="item.case_id"
              :variables="getAvailableVars(id, '', filterVar)"
              :on-select-variable="handleAddCondition!"
            />
          </template>

          <template v-if="(index === 0 && casesLength > 1) || (index > 0)">
            <Button
              class="hover:bg-components-button-destructive-ghost-bg-hover hover:text-components-button-destructive-ghost-text"
              size="small"
              variant="ghost"
              :disabled="readOnly"
              @click="handleRemoveCase?.(item.case_id)"
              @mouseenter="willDeleteCaseId = item.case_id"
              @mouseleave="willDeleteCaseId = ''"
            >
              <i class="i-ri-delete-bin-line mr-1 h-3.5 w-3.5" />
              {{ t('common.operation.remove') }}
            </Button>
          </template>
        </div>
      </div>
      <div
        v-if="!isSubVariable"
        class="mx-3 my-2 h-px bg-divider-subtle"
      />
    </div>
    <template v-if="cases.length === 0">
      <Button
        size="small"
        :disabled="readOnly"
        @click="handleAddSubVariableCondition?.(caseId!, conditionId!)"
      >
        <i class="i-ri-add-line mr-1 h-3.5 w-3.5" />
        {{ t('workflow.nodes.ifElse.addSubVariable') }}
      </Button>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { CaseItem, HandleAddCondition, HandleAddSubVariableCondition, HandleRemoveCondition, HandleToggleConditionLogicalOperator, HandleToggleSubVariableConditionLogicalOperator, HandleUpdateCondition, HandleUpdateSubVariableCondition, handleRemoveSubVariableCondition } from '../types'
import type { Node, NodeOutPutVar, Var } from '@/types'
import { VarType } from '@/types'
import { useGetAvailableVars } from '../../variable-assigner/hooks'
import { SUB_VARIABLES } from '@/components/workflow/constant'
import ConditionList from './condition-list/index.vue'
import ConditionAdd from './condition-add.vue'
import Button from '@/components/base/button.vue'
import { PortalSelect as Select } from '@/components/base/select.vue'
import { noop } from 'lodash-es'

/**
 * 条件包装组件的属性定义
 */
interface Props {
  /** 是否为子变量 */
  isSubVariable?: boolean
  /** 案例ID */
  caseId?: string
  /** 条件ID */
  conditionId?: string
  /** 案例列表 */
  cases: CaseItem[]
  /** 是否只读 */
  readOnly: boolean
  /** 排序案例的回调 */
  handleSortCase?: (sortedCases: (CaseItem & { id: string })[]) => void
  /** 删除案例的回调 */
  handleRemoveCase?: (caseId: string) => void
  /** 添加条件的回调 */
  handleAddCondition?: HandleAddCondition
  /** 删除条件的回调 */
  handleRemoveCondition?: HandleRemoveCondition
  /** 更新条件的回调 */
  handleUpdateCondition?: HandleUpdateCondition
  /** 切换条件逻辑操作符的回调 */
  handleToggleConditionLogicalOperator?: HandleToggleConditionLogicalOperator
  /** 添加子变量条件的回调 */
  handleAddSubVariableCondition?: HandleAddSubVariableCondition
  /** 删除子变量条件的回调 */
  handleRemoveSubVariableCondition?: handleRemoveSubVariableCondition
  /** 更新子变量条件的回调 */
  handleUpdateSubVariableCondition?: HandleUpdateSubVariableCondition
  /** 切换子变量条件逻辑操作符的回调 */
  handleToggleSubVariableConditionLogicalOperator?: HandleToggleSubVariableConditionLogicalOperator
  /** 节点ID */
  nodeId: string
  /** 节点输出变量列表 */
  nodesOutputVars: NodeOutPutVar[]
  /** 可用节点列表 */
  availableNodes: Node[]
  /** 变量是否为文件属性的映射 */
  varsIsVarFileAttribute?: Record<string, boolean>
  /** 过滤变量的函数 */
  filterVar: (varPayload: Var) => boolean
}

const props = withDefaults(defineProps<Props>(), {
  handleSortCase: noop,
  filterVar: () => true,
  varsIsVarFileAttribute: () => ({}),
})

const { t } = useI18n()

const getAvailableVars = useGetAvailableVars()

const willDeleteCaseId = ref('')
const casesLength = computed(() => props.cases.length)

const filterNumberVar = (varPayload: Var) => {
  return varPayload.type === VarType.number
}

const subVarOptions = computed(() => SUB_VARIABLES.map(item => ({
  name: item,
  value: item,
})))

const sortedCases = computed(() => props.cases.map((caseItem: CaseItem) => ({ ...caseItem, id: caseItem.case_id })))

const handleSortCase = (newList: (CaseItem & { id: string })[]) => {
  props.handleSortCase?.(newList)
}

const id = computed(() => props.nodeId || '')

// 注意：如果需要拖拽排序功能，需要安装 sortablejs 和 @vueuse/integrations
// 目前暂时使用静态列表，拖拽功能需要在父组件中实现
</script>

