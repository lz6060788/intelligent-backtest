<template>
  <div>
    <div
      v-for="(item, index) in sortedCases"
      :key="item.case_id"
    >
      <div
        :class="cn(
          'group relative rounded-[10px] bg-gray-800',
          willDeleteCaseId === item.case_id && 'bg-[#4b1515]',
          !isSubVariable && 'min-h-[40px] px-3 py-1 ',
          isSubVariable && 'px-1 py-2',
        )"
      >
        <template v-if="!isSubVariable">
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
              @update-condition="(caseId: string, conditionId: string, condition: Condition) => emit('updateCondition', caseId, conditionId, condition)"
              @remove-condition="(caseId: string, conditionId: string) => emit('removeCondition', caseId, conditionId)"
              @toggle-condition-logical-operator="(caseId: string) => emit('toggleConditionLogicalOperator', caseId)"
              :node-id="id"
              :nodes-output-vars="nodesOutputVars"
              :available-nodes="availableNodes"
              :filter-var="filterVar"
              :number-variables="getAvailableVars(id, '', filterNumberVar)"
              :vars-is-var-file-attribute="varsIsVarFileAttribute"
              @add-sub-variable-condition="(caseId: string, conditionId: string, key?: string) => emit('addSubVariableCondition', caseId, conditionId, key)"
              @remove-sub-variable-condition="(caseId: string, conditionId: string, subConditionId: string) => emit('removeSubVariableCondition', caseId, conditionId, subConditionId)"
              @update-sub-variable-condition="(caseId: string, conditionId: string, subConditionId: string, newSubCondition: Condition) => emit('updateSubVariableCondition', caseId, conditionId, subConditionId, newSubCondition)"
              @toggle-sub-variable-condition-logical-operator="(caseId: string, conditionId: string) => emit('toggleSubVariableConditionLogicalOperator', caseId, conditionId)"
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
            <PartialSelect
              popupInnerClassName='w-[165px] max-h-none'
              @select="value => emit('addSubVariableCondition', caseId!, conditionId!, value.value as string)"
              :items="subVarOptions"
              value=""
            >
              <template #trigger>
                <el-button
                  size="small"
                  :disabled="readOnly"
                >
                  <RiAddLine class="mr-1 h-3.5 w-3.5" />
                  {{ t('workflow.nodes.ifElse.addSubVariable') }}
                </el-button>
              </template>
            </PartialSelect>
          </template>
          <template v-else>
            <ConditionAdd
              :disabled="readOnly"
              :case-id="item.case_id"
              :variables="getAvailableVars(id, '', filterVar)"
              @select-variable="(caseId: string, valueSelector: ValueSelector, varItem: Var) => emit('addCondition', caseId, valueSelector, varItem)"
            />
          </template>

          <template v-if="(index === 0 && casesLength > 1) || (index > 0)">
            <el-button
              size="small"
              type="danger"
              :disabled="readOnly"
              @click="emit('removeCase', item.case_id)"
              @mouseenter="willDeleteCaseId = item.case_id"
              @mouseleave="willDeleteCaseId = ''"
            >
              <RiDeleteBinLine class='mr-1 h-3.5 w-3.5' />
              {{ t('common.operation.remove') }}
            </el-button>
          </template>
        </div>
      </div>
      <div
        v-if="!isSubVariable"
        class="mx-3 my-2 h-px bg-divider-subtle"
      />
    </div>
    <template v-if="cases.length === 0">
      <el-button
        size="small"
        :disabled="readOnly"
        @click="emit('addSubVariableCondition', caseId!, conditionId!)"
      >
        <RiAddLine class='mr-1 h-3.5 w-3.5' />
        {{ t('workflow.nodes.ifElse.addSubVariable') }}
      </el-button>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  RiAddLine,
  RiDeleteBinLine,
  RiDraggable,
} from '@remixicon/vue'
import type { CaseItem, Condition } from '../types'
import type { Node, NodeOutPutVar, ValueSelector, Var } from '@/types'
import { VarType } from '@/types'
import { useGetAvailableVars } from '../../variable-assigner/hooks'
import { SUB_VARIABLES } from '@/components/workflow/constant'
import ConditionList from './condition-list/index.vue'
import ConditionAdd from './condition-add.vue'
import { noop } from 'lodash-es'
import cn from '@/utils/classnames'
import PartialSelect from '@/components/base/select/partal-select/index.vue'

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

const emit = defineEmits<{
  (e: 'removeCase', caseId: string): void
  (e: 'addCondition', caseId: string, valueSelector: ValueSelector, varItem: Var): void
  (e: 'removeCondition', caseId: string, conditionId: string): void
  (e: 'updateCondition', caseId: string, conditionId: string, condition: Condition): void
  (e: 'toggleConditionLogicalOperator', caseId: string): void
  (e: 'addSubVariableCondition', caseId: string, conditionId: string, key?: string): void
  (e: 'removeSubVariableCondition', caseId: string, conditionId: string, subConditionId: string): void
  (e: 'updateSubVariableCondition', caseId: string, conditionId: string, subConditionId: string, newSubCondition: Condition): void
  (e: 'toggleSubVariableConditionLogicalOperator', caseId: string, conditionId: string): void
}>()

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
</script>

