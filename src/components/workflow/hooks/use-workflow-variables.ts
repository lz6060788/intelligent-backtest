import { useWorkflowInstance } from '../hooks/use-workflow-instance'
import { getVarType, toNodeAvailableVars, type SchemaTypeDefinition } from '@/components/workflow/nodes/_base/variable/utils'
import type {
  Node,
  NodeOutPutVar,
  ValueSelector,
  Var,
} from '@/types'
// import { useIsChatMode } from './use-workflow'
import { useVueFlow } from '@vue-flow/core'
import type { Type } from '../nodes/llm/types'
import { computed, ref } from 'vue'
import type { ToolWithProvider } from '../block-selector/types'
import i18n from '@/locales'

export const useWorkflowVariables = (id?: string) => {
  const t = i18n.global.t
  const { instance: workflowStore, instanceId } = useWorkflowInstance(id)
  const environmentVariables = computed(() => workflowStore.environmentVariables.value)
  // const { schemaTypeDefinitions } = useMatchSchemaType()
  // TODO: 需要后续完善协议获取，用于工具节点的变量输出
  const schemaTypeDefinitions: SchemaTypeDefinition[] = []

  // const { data: buildInTools } = api.workflow.getAllBuiltInTools()
  // const { data: customTools } = api.workflow.getAllCustomTools()
  // const { data: workflowTools } = api.workflow.getAllWorkflowTools()
  // const { data: mcpTools } = api.workflow.getAllMCPTools()
  // TODO: 需要后续完善各类工具的获取
  const buildInTools: ToolWithProvider[] = []
  const customTools: ToolWithProvider[] = []
  const workflowTools: ToolWithProvider[] = []
  const mcpTools: ToolWithProvider[] = []

  const getNodeAvailableVars = ({
    parentNode,
    beforeNodes,
    isChatMode,
    filterVar,
    hideEnv,
    hideChatVar,
  }: {
    parentNode?: Node | null
    beforeNodes: Node[]
    isChatMode: boolean
    filterVar: (payload: Var, selector: ValueSelector) => boolean
    hideEnv?: boolean
    hideChatVar?: boolean
  }): NodeOutPutVar[] => {
    return toNodeAvailableVars({
      parentNode,
      t,
      beforeNodes,
      isChatMode,
      environmentVariables: hideEnv ? [] : environmentVariables.value,
      conversationVariables: [],
      // ragVariables: [],
      filterVar,
      allPluginInfoList: {
        buildInTools: buildInTools || [],
        customTools: customTools || [],
        workflowTools: workflowTools || [],
        mcpTools: mcpTools || [],
        dataSourceList: [],
      },
      schemaTypeDefinitions,
    })
  }

  const getCurrentVariableType = ({
    parentNode,
    valueSelector,
    isIterationItem,
    isLoopItem,
    availableNodes,
    isChatMode,
    isConstant,
    preferSchemaType,
  }: {
    valueSelector: ValueSelector
    parentNode?: Node | null
    isIterationItem?: boolean
    isLoopItem?: boolean
    availableNodes: any[]
    isChatMode: boolean
    isConstant?: boolean
    preferSchemaType?: boolean
  }) => {
    const {
      // conversationVariables,
      environmentVariables,
      // ragPipelineVariables,
      // dataSourceList,
    } = workflowStore
    return getVarType({
      parentNode,
      valueSelector,
      // isIterationItem,
      isLoopItem,
      availableNodes,
      isChatMode,
      isConstant,
      environmentVariables: environmentVariables.value,
      // conversationVariables,
      // ragVariables: ragPipelineVariables,
      allPluginInfoList: {
        buildInTools: buildInTools || [],
        customTools: customTools || [],
        workflowTools: workflowTools || [],
        mcpTools: mcpTools || [],
        dataSourceList: [],
      },
      schemaTypeDefinitions,
      preferSchemaType,
    })
  }

  return {
    getNodeAvailableVars,
    getCurrentVariableType,
  }
}

export const useWorkflowVariableType = (id?: string) => {
  const { instanceId } = useWorkflowInstance(id)
  const store = useVueFlow(instanceId)
  const {
    nodes,
  } = store
  const { getCurrentVariableType } = useWorkflowVariables(instanceId)

  const isChatMode = ref(false)

  const getVarType = ({
    nodeId,
    valueSelector,
  }: {
    nodeId: string,
    valueSelector: ValueSelector,
  }) => {
    const node = nodes.value.find(n => n.id === nodeId)
    const isInIteration = !!node?.data.isInIteration
    const iterationNode = isInIteration ? nodes.value.find(n => n.id === node.parentNode) : null
    const availableNodes = [node]

    const type = getCurrentVariableType({
      parentNode: iterationNode,
      valueSelector,
      availableNodes,
      isChatMode: isChatMode.value,
      isConstant: false,
    })
    return type as unknown as Type
  }

  return getVarType
}
