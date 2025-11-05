<template>
  <div v-if="conditions">
    <div
      :class="cn(
        'group relative rounded-[10px] bg-components-panel-bg',
        !isSubVariable && 'min-h-[40px] px-3 py-1 ',
        isSubVariable && 'px-1 py-2',
      )"
    >
      <div v-if="conditions && !!conditions.length" class="mb-2">
        <ConditionList
          :disabled="readOnly"
          :condition-id="conditionId"
          :conditions="conditions"
          :logical-operator="logicalOperator"
          :on-update-condition="handleUpdateCondition"
          :on-remove-condition="handleRemoveCondition"
          :on-toggle-condition-logical-operator="handleToggleConditionLogicalOperator"
          :node-id="id"
          :available-nodes="availableNodes"
          :number-variables="numberVariables"
          :on-add-sub-variable-condition="handleAddSubVariableCondition"
          :on-remove-sub-variable-condition="handleRemoveSubVariableCondition"
          :on-update-sub-variable-condition="handleUpdateSubVariableCondition"
          :on-toggle-sub-variable-condition-logical-operator="handleToggleSubVariableConditionLogicalOperator"
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
            :on-select="(value: any) => handleAddSubVariableCondition?.(conditionId!, value.value as string)"
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
            :on-select-variable="handleAddCondition!"
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
  HandleAddCondition,
  HandleAddSubVariableCondition,
  HandleRemoveCondition,
  HandleToggleConditionLogicalOperator,
  HandleToggleSubVariableConditionLogicalOperator,
  HandleUpdateCondition,
  HandleUpdateSubVariableCondition,
  LogicalOperator,
  handleRemoveSubVariableCondition,
} from '../type'
import type { Node, NodeOutPutVar, Var } from '@/types/node'
import { VarType } from '@/types'
import { useGetAvailableVars } from '../../variable-assigner/hooks'
import ConditionList from './condition-list/index.vue'
import ConditionAdd from './condition-add.vue'
import { SUB_VARIABLES } from '../default'
import cn from '@/utils/classnames'
import { PortalSelect as Select } from '@/components/base/select.vue'

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
  /** 添加条件回调 */
  handleAddCondition?: HandleAddCondition
  /** 删除条件回调 */
  handleRemoveCondition?: HandleRemoveCondition
  /** 更新条件回调 */
  handleUpdateCondition?: HandleUpdateCondition
  /** 切换条件逻辑操作符回调 */
  handleToggleConditionLogicalOperator?: HandleToggleConditionLogicalOperator
  /** 添加子变量条件回调 */
  handleAddSubVariableCondition?: HandleAddSubVariableCondition
  /** 删除子变量条件回调 */
  handleRemoveSubVariableCondition?: handleRemoveSubVariableCondition
  /** 更新子变量条件回调 */
  handleUpdateSubVariableCondition?: HandleUpdateSubVariableCondition
  /** 切换子变量条件逻辑操作符回调 */
  handleToggleSubVariableConditionLogicalOperator?: HandleToggleSubVariableConditionLogicalOperator
  /** 节点ID */
  nodeId: string
  /** 可用节点列表 */
  availableNodes: Node[]
  /** 可用变量列表 */
  availableVars: NodeOutPutVar[]
}

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

