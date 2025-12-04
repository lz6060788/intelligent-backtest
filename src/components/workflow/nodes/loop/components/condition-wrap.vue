<template>
  <div v-if="conditions">
    <div
      :class="cn(
        'group relative rounded-[10px] bg-components-panel-bg',
        !isSubVariable && 'min-h-[40px] px-3 py-1 ',
        isSubVariable && 'px-1 py-2 bg-gray-800',
      )"
    >
      <div v-if="conditions && !!conditions.length" class="mb-2">
        <ConditionList
          :disabled="readOnly"
          :condition-id="conditionId"
          :conditions="conditions"
          :logical-operator="logicalOperator"
          @update-condition="(conditionId: string, newCondition: Condition) => emit('update-condition', conditionId, newCondition)"
          @remove-condition="(conditionId: string) => emit('remove-condition', conditionId)"
          @toggle-condition-logical-operator="emit('toggle-condition-logical-operator')"
          :node-id="nodeId"
          :available-nodes="availableNodes"
          :number-variables="numberVariables"
          @add-sub-variable-condition="(conditionId: string, key?: string) => emit('add-sub-variable-condition', conditionId, key)"
          @remove-sub-variable-condition="(conditionId: string, subConditionId: string) => emit('remove-sub-variable-condition', conditionId, subConditionId)"
          @update-sub-variable-condition="(conditionId: string, subConditionId: string, newSubCondition: Condition) => emit('update-sub-variable-condition', conditionId, subConditionId, newSubCondition)"
          @toggle-sub-variable-condition-logical-operator="(conditionId: string) => emit('toggle-sub-variable-condition-logical-operator', conditionId)"
          :is-sub-variable="isSubVariable"
          :available-vars="availableVars"
        />
      </div>

      <div
        :class="cn(
          'flex items-center justify-between pr-[30px]',
          !conditions.length && !isSubVariable && 'mt-1',
          !conditions.length && isSubVariable && 'mt-2',
          conditions.length > 1 && !isSubVariable && 'ml-[60px]',
        )"
      >
        <template v-if="isSubVariable">
          <Select
            popup-inner-class-name="w-[165px] max-h-none"
            @select="(value: any) => emit('add-sub-variable-condition', conditionId!, value.value as string)"
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
          </Select>
        </template>
        <template v-else>
          <ConditionAdd
            :disabled="readOnly"
            :variables="availableVars"
            @select-variable="(valueSelector: ValueSelector, varItem: Var) => emit('add-condition', valueSelector, varItem)"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { RiAddLine } from '@remixicon/vue'
import type {
  Condition,
  LogicalOperator,
} from '../type'
import type { Node, NodeOutPutVar, ValueSelector, Var } from '@/types'
import { VarType } from '@/types'
import { useGetAvailableVars } from '../../variable-assigner/hooks'
import ConditionList from './condition-list/index.vue'
import ConditionAdd from './condition-add.vue'
import { SUB_VARIABLES } from '../default'
import cn from '@/utils/classnames'
import Select from '@/components/base/select/partal-select/index.vue'

/**
 * 条件包装组件的属性定义
 */
interface ConditionWrapProps {
  /** 是否为子变量 */
  isSubVariable?: boolean
  /** 条件ID */
  conditionId?: string
  /** 条件列表 */
  conditions: Condition[]
  /** 逻辑操作符 */
  logicalOperator: LogicalOperator | undefined
  /** 是否只读 */
  readOnly: boolean
  /** 节点ID */
  nodeId: string
  /** 可用节点列表 */
  availableNodes: Node[]
  /** 可用变量列表 */
  availableVars: NodeOutPutVar[]
}

const emit = defineEmits<{
  (e: 'add-condition', valueSelector: ValueSelector, varItem: Var): void
  (e: 'remove-condition', conditionId: string): void
  (e: 'update-condition', conditionId: string, newCondition: Condition): void
  (e: 'toggle-condition-logical-operator'): void
  (e: 'add-sub-variable-condition', conditionId: string, key?: string): void
  (e: 'remove-sub-variable-condition', conditionId: string, subConditionId: string): void
  (e: 'update-sub-variable-condition', conditionId: string, subConditionId: string, newSubCondition: Condition): void
  (e: 'toggle-sub-variable-condition-logical-operator', conditionId: string): void
}>()

const props = withDefaults(defineProps<ConditionWrapProps>(), {
  nodeId: '',
  availableNodes: () => [],
  availableVars: () => [],
})

const { t } = useI18n()

const getAvailableVars = useGetAvailableVars()

const filterNumberVar = (varPayload: Var) => {
  return varPayload.type === VarType.number
}

const subVarOptions = computed(() => SUB_VARIABLES.map(item => ({
  name: item,
  value: item,
})))

const numberVariables = computed(() => {
  return getAvailableVars(props.nodeId, '', filterNumberVar)
})
</script>

