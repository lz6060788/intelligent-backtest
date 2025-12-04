<template>
  <div :class="cn(open && '!flex', variableAssignerNodeData.selected && '!flex')">
    <el-popover
      v-model:visible="open"
      placement="right"
      :offset="4"
      trigger="click"
      teleported
      :persistent="false"
      :show-arrow="false"
      popper-class="custom-popover"
    >
      <template #reference>
        <div
          :class="cn(
            'group/addvariable flex items-center justify-center',
            'h-4 w-4 cursor-pointer',
            'hover:rounded-full hover:bg-blue-600',
            open && '!rounded-full !bg-blue-600',
          )"
        >
          <Plus02
            :class="cn(
              'h-2.5 w-2.5 text-gray-4',
              'group-hover/addvariable:text-white',
              open && '!text-white',
            )"
          />
        </div>
      </template>
      <div class="z-[1000] popper-default w-60">
        <AddVariablePopup
          @select="handleSelectVariable"
          :available-vars="availableVars"
        />
      </div>
    </el-popover>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElPopover } from 'element-plus'
import { useVariableAssigner } from '../../hooks'
import type { VariableAssignerNodeType } from '../../types'
import cn from '@/utils/classnames'
import { Plus02 } from '@/components/base/icons/src/vender/line/general'
import AddVariablePopup from '@/components/workflow/nodes/_base/add-variable-popup/index.vue'
import type {
  NodeOutPutVar,
  ValueSelector,
  Var,
} from '@/types'

export interface AddVariableProps {
  variableAssignerNodeId: string
  variableAssignerNodeData: VariableAssignerNodeType
  availableVars: NodeOutPutVar[]
  handleId?: string
}

const props = defineProps<AddVariableProps>()

const open = ref(false)
const { handleAssignVariableValueChange } = useVariableAssigner()

const handleSelectVariable = (v: ValueSelector, varDetail: Var) => {
  handleAssignVariableValueChange(
    props.variableAssignerNodeId,
    v,
    varDetail,
    props.handleId,
  )
  open.value = false
}
</script>

