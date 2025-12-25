import { computed, type Ref } from 'vue'
import { cloneDeep } from 'lodash-es'
import {
  useNodesReadOnly,
  useWorkflow,
} from '../../hooks'
import { VarType } from '@/types'
import type { ErrorHandleMode, ValueSelector, Var } from '@/types'
import { useNodeCrud } from '../_base/hooks'
import type { IterationNodeType } from './types'
import { toNodeOutputVars } from '../_base/variable/utils'
import type { VarType as VarKindType } from '@/components/workflow/nodes/tool/types'
// import type { Item } from '@/components/base/select'
import { isEqual } from 'lodash-es'
import { useWorkflowInstance } from '@/components/workflow/hooks/use-workflow-instance'

/**
 * 使用配置的composable
 * @param id 节点ID
 * @param payload 迭代节点类型数据
 */
const useConfig = (id: string, payload: Ref<IterationNodeType>) => {
  const { instanceId } = useWorkflowInstance()
  // 注释：useInspectVarsCrud 不存在，暂时忽略
  // const {
  //   deleteNodeInspectorVars,
  // } = useInspectVarsCrud()
  const { nodesReadOnly: readOnly } = useNodesReadOnly(instanceId)
  const isChatMode = false

  const { setInputs } = useNodeCrud<IterationNodeType>(id)

  const filterInputVar = (varPayload: Var) => {
    return [VarType.array, VarType.arrayString, VarType.arrayBoolean, VarType.arrayNumber, VarType.arrayObject, VarType.arrayFile].includes(varPayload.type)
  }

  const handleInputChange = (input: ValueSelector | string, varKindType?: VarKindType, varInfo?: Var) => {
    const draft = cloneDeep(payload.value)
    draft.iterator_selector = input as ValueSelector || []
    draft.iterator_input_type = varInfo?.type || VarType.arrayString
    setInputs(draft)
  }

  // output
  const { getIterationNodeChildren } = useWorkflow(instanceId)
  const iterationChildrenNodes = computed(() => getIterationNodeChildren(id))
  const allPluginInfoList = {
    buildInTools: [],
    customTools: [],
    workflowTools: [],
    mcpTools: [],
    dataSourceList: [],
  }
  const childrenNodeVars = computed(() => {
    return toNodeOutputVars(
      iterationChildrenNodes.value,
      isChatMode,
      undefined,
      [],
      [],
      allPluginInfoList,
    )
  })

  const handleOutputVarChange = (output: ValueSelector | string, varKindType?: VarKindType, varInfo?: Var) => {
    if (isEqual(payload.value.output_selector, output as ValueSelector))
      return

    const draft = cloneDeep(payload.value)
    draft.output_selector = output as ValueSelector || []
    const outputItemType = varInfo?.type || VarType.string

    draft.output_type = ({
      [VarType.string]: VarType.arrayString,
      [VarType.number]: VarType.arrayNumber,
      [VarType.object]: VarType.arrayObject,
      [VarType.file]: VarType.arrayFile,
      // list operator node can output array
      [VarType.array]: VarType.array,
      [VarType.arrayFile]: VarType.arrayFile,
      [VarType.arrayString]: VarType.arrayString,
      [VarType.arrayNumber]: VarType.arrayNumber,
      [VarType.arrayObject]: VarType.arrayObject,
    } as Record<VarType, VarType>)[outputItemType] || VarType.arrayString
    setInputs(draft)
    // 注释：deleteNodeInspectorVars 不存在，暂时忽略
    // deleteNodeInspectorVars(id)
  }

  const changeParallel = (value: boolean) => {
    const draft = cloneDeep(payload.value)
    draft.is_parallel = value
    setInputs(draft)
  }

  const changeErrorResponseMode = (value: ErrorHandleMode) => {
    const draft = cloneDeep(payload.value)
    draft.error_handle_mode = value
    setInputs(draft)
  }

  const changeParallelNums = (num: number) => {
    const draft = cloneDeep(payload.value)
    draft.parallel_nums = num
    setInputs(draft)
  }

  const changeFlattenOutput = (value: boolean) => {
    const draft = cloneDeep(payload.value)
    draft.flatten_output = value
    setInputs(draft)
  }

  const inputs = computed(() => payload.value)

  return {
    readOnly,
    inputs,
    filterInputVar,
    handleInputChange,
    childrenNodeVars,
    iterationChildrenNodes,
    handleOutputVarChange,
    changeParallel,
    changeErrorResponseMode,
    changeParallelNums,
    changeFlattenOutput,
  }
}

export default useConfig
