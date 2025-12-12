import useOneStepRun from '@/components/workflow/nodes/_base/hooks/use-one-step-run'
import type { Params as OneStepRunParams } from '@/components/workflow/nodes/_base/hooks/use-one-step-run'
import { ref, watch } from 'vue'
import { TabType } from '../tab'
import type { Props as FormProps } from '@/app/components/workflow/nodes/_base/components/before-run-form/form'
import useStartSingleRunFormParams from '@/app/components/workflow/nodes/start/use-single-run-form-params'
import useLLMSingleRunFormParams from '@/app/components/workflow/nodes/llm/use-single-run-form-params'
import useKnowledgeRetrievalSingleRunFormParams from '@/app/components/workflow/nodes/knowledge-retrieval/use-single-run-form-params'
import useCodeSingleRunFormParams from '@/app/components/workflow/nodes/code/use-single-run-form-params'
import useTemplateTransformSingleRunFormParams from '@/app/components/workflow/nodes/template-transform/use-single-run-form-params'
import useQuestionClassifierSingleRunFormParams from '@/app/components/workflow/nodes/question-classifier/use-single-run-form-params'
import useParameterExtractorSingleRunFormParams from '@/app/components/workflow/nodes/parameter-extractor/use-single-run-form-params'
import useHttpRequestSingleRunFormParams from '@/app/components/workflow/nodes/http/use-single-run-form-params'
import useToolSingleRunFormParams from '@/app/components/workflow/nodes/tool/use-single-run-form-params'
import useIterationSingleRunFormParams from '@/app/components/workflow/nodes/iteration/use-single-run-form-params'
import useAgentSingleRunFormParams from '@/app/components/workflow/nodes/agent/use-single-run-form-params'
import useDocExtractorSingleRunFormParams from '@/app/components/workflow/nodes/document-extractor/use-single-run-form-params'
import useLoopSingleRunFormParams from '@/app/components/workflow/nodes/loop/use-single-run-form-params'
import useIfElseSingleRunFormParams from '@/app/components/workflow/nodes/if-else/use-single-run-form-params'
import useVariableAggregatorSingleRunFormParams from '@/app/components/workflow/nodes/variable-assigner/use-single-run-form-params'
import useVariableAssignerSingleRunFormParams from '@/app/components/workflow/nodes/assigner/use-single-run-form-params'
import useKnowledgeBaseSingleRunFormParams from '@/app/components/workflow/nodes/knowledge-base/use-single-run-form-params'

import useToolGetDataForCheckMore from '@/app/components/workflow/nodes/tool/use-get-data-for-check-more'
import { VALUE_SELECTOR_DELIMITER as DELIMITER } from '@/config'

// import
import type { CommonNodeType, ValueSelector } from '@/app/components/workflow/types'
import { BlockEnum } from '@/app/components/workflow/types'
import {
  useNodesSyncDraft,
} from '@/app/components/workflow/hooks'
import useInspectVarsCrud from '@/app/components/workflow/hooks/use-inspect-vars-crud'
import { useInvalidLastRun } from '@/service/use-workflow'
import { useStore, useWorkflowStore } from '@/app/components/workflow/store'
import { isSupportCustomRunForm } from '@/app/components/workflow/utils'

/**
 * 单步运行表单参数 hooks 映射表
 */
const singleRunFormParamsHooks: Record<BlockEnum, any> = {
  [BlockEnum.LLM]: useLLMSingleRunFormParams,
  [BlockEnum.KnowledgeRetrieval]: useKnowledgeRetrievalSingleRunFormParams,
  [BlockEnum.Code]: useCodeSingleRunFormParams,
  [BlockEnum.TemplateTransform]: useTemplateTransformSingleRunFormParams,
  [BlockEnum.QuestionClassifier]: useQuestionClassifierSingleRunFormParams,
  [BlockEnum.HttpRequest]: useHttpRequestSingleRunFormParams,
  [BlockEnum.Tool]: useToolSingleRunFormParams,
  [BlockEnum.ParameterExtractor]: useParameterExtractorSingleRunFormParams,
  [BlockEnum.Iteration]: useIterationSingleRunFormParams,
  [BlockEnum.Agent]: useAgentSingleRunFormParams,
  [BlockEnum.DocExtractor]: useDocExtractorSingleRunFormParams,
  [BlockEnum.Loop]: useLoopSingleRunFormParams,
  [BlockEnum.Start]: useStartSingleRunFormParams,
  [BlockEnum.IfElse]: useIfElseSingleRunFormParams,
  [BlockEnum.VariableAggregator]: useVariableAggregatorSingleRunFormParams,
  [BlockEnum.Assigner]: useVariableAssignerSingleRunFormParams,
  [BlockEnum.KnowledgeBase]: useKnowledgeBaseSingleRunFormParams,
  [BlockEnum.VariableAssigner]: undefined,
  [BlockEnum.End]: undefined,
  [BlockEnum.Answer]: undefined,
  [BlockEnum.ListFilter]: undefined,
  [BlockEnum.IterationStart]: undefined,
  [BlockEnum.LoopStart]: undefined,
  [BlockEnum.LoopEnd]: undefined,
  [BlockEnum.DataSource]: undefined,
  [BlockEnum.DataSourceEmpty]: undefined,
}

/**
 * 获取单步运行表单参数 hooks
 * @param nodeType 节点类型
 */
const useSingleRunFormParamsHooks = (nodeType: BlockEnum) => {
  return (params: any) => {
    return singleRunFormParamsHooks[nodeType]?.(params) || {}
  }
}

/**
 * 获取检查更多数据的 hooks 映射表
 */
const getDataForCheckMoreHooks: Record<BlockEnum, any> = {
  [BlockEnum.Tool]: useToolGetDataForCheckMore,
  [BlockEnum.LLM]: undefined,
  [BlockEnum.KnowledgeRetrieval]: undefined,
  [BlockEnum.Code]: undefined,
  [BlockEnum.TemplateTransform]: undefined,
  [BlockEnum.QuestionClassifier]: undefined,
  [BlockEnum.HttpRequest]: undefined,
  [BlockEnum.ParameterExtractor]: undefined,
  [BlockEnum.Iteration]: undefined,
  [BlockEnum.Agent]: undefined,
  [BlockEnum.DocExtractor]: undefined,
  [BlockEnum.Loop]: undefined,
  [BlockEnum.Start]: undefined,
  [BlockEnum.IfElse]: undefined,
  [BlockEnum.VariableAggregator]: undefined,
  [BlockEnum.End]: undefined,
  [BlockEnum.Answer]: undefined,
  [BlockEnum.VariableAssigner]: undefined,
  [BlockEnum.ListFilter]: undefined,
  [BlockEnum.IterationStart]: undefined,
  [BlockEnum.Assigner]: undefined,
  [BlockEnum.LoopStart]: undefined,
  [BlockEnum.LoopEnd]: undefined,
  [BlockEnum.DataSource]: undefined,
  [BlockEnum.DataSourceEmpty]: undefined,
  [BlockEnum.KnowledgeBase]: undefined,
}

/**
 * 获取检查更多数据的 hooks
 * @param nodeType 节点类型
 */
const useGetDataForCheckMoreHooks = <T>(nodeType: BlockEnum) => {
  return (id: string, payload: CommonNodeType<T>) => {
    return getDataForCheckMoreHooks[nodeType]?.({ id, payload }) || {
      getData: () => {
        return {}
      },
    }
  }
}

/**
 * useLastRun 的参数类型
 */
type Params<T> = Omit<OneStepRunParams<T>, 'isRunAfterSingleRun'>

/**
 * 使用最后一次运行结果的 composable
 * @param oneStepRunParams 单步运行参数
 */
const useLastRun = <T>({
  ...oneStepRunParams
}: Params<T>) => {
  const { conversationVars, systemVars, hasSetInspectVar } = useInspectVarsCrud()
  const blockType = oneStepRunParams.data.type
  const isStartNode = blockType === BlockEnum.Start || blockType === BlockEnum.CalculatorStart
  const isIterationNode = blockType === BlockEnum.Iteration
  const isLoopNode = blockType === BlockEnum.Loop
  const isAggregatorNode = blockType === BlockEnum.VariableAggregator
  const isCustomRunNode = isSupportCustomRunForm(blockType)
  const { handleSyncWorkflowDraft } = useNodesSyncDraft()
  const {
    getData: getDataForCheckMore,
  } = useGetDataForCheckMoreHooks<T>(blockType)(oneStepRunParams.id, oneStepRunParams.data)
  const isRunAfterSingleRun = ref(false)

  const {
    id,
    flowId,
    flowType,
    data,
  } = oneStepRunParams

  const oneStepRunRes = useOneStepRun({
    ...oneStepRunParams,
    iteratorInputKey: blockType === BlockEnum.Iteration ? `${id}.input_selector` : '',
    moreDataForCheckValid: getDataForCheckMore(),
    isRunAfterSingleRun: isRunAfterSingleRun.value,
  })

  const {
    hideSingleRun,
    handleRun: doCallRunApi,
    getInputVars,
    toVarInputs,
    varSelectorsToVarInputs,
    runInputData,
    runInputDataRef,
    setRunInputData,
    showSingleRun,
    runResult,
    iterationRunResult,
    loopRunResult,
    setNodeRunning,
    checkValid,
  } = oneStepRunRes

  const nodeInfo = runResult
  
  const singleRunParams = useSingleRunFormParamsHooks(blockType)({
    id,
    payload: data,
    runInputData,
    runInputDataRef,
    getInputVars,
    setRunInputData,
    toVarInputs,
    varSelectorsToVarInputs,
    runResult,
    iterationRunResult,
    loopRunResult,
  })

  /**
   * 转换提交数据
   * @param data 原始数据
   */
  const toSubmitData = (data: Record<string, any>) => {
    if (!isIterationNode && !isLoopNode)
      return data

    const allVarObject = singleRunParams?.allVarObject || {}
    const formattedData: Record<string, any> = {}
    Object.keys(allVarObject).forEach((key) => {
      const [varSectorStr, nodeId] = key.split(DELIMITER)
      formattedData[`${nodeId}.${allVarObject[key].inSingleRunPassedKey}`] = data[varSectorStr!]
    })
    if (isIterationNode) {
      const iteratorInputKey = `${id}.input_selector`
      formattedData[iteratorInputKey] = data[iteratorInputKey]
    }
    return formattedData
  }

  /**
   * 调用运行 API
   * @param data 运行数据
   * @param cb 回调函数
   */
  const callRunApi = (data: Record<string, any>, cb?: () => void) => {
    handleSyncWorkflowDraft(true, true, {
      onSuccess() {
        doCallRunApi(toSubmitData(data))
        cb?.()
      },
    })
  }
  
  const workflowStore = useWorkflowStore()
  const { setInitShowLastRunTab } = workflowStore.getState()
  const initShowLastRunTab = useStore((s: any) => s.initShowLastRunTab)
  const tabType = ref<TabType>(initShowLastRunTab.value ? TabType.lastRun : TabType.settings)
  
  watch(
    () => initShowLastRunTab.value,
    () => {
      if (initShowLastRunTab.value)
        tabType.value = TabType.lastRun

      setInitShowLastRunTab(false)
    },
    { immediate: true }
  )
  
  const invalidLastRun = useInvalidLastRun(flowType, flowId, id)

  /**
   * 使用参数运行
   * @param data 运行数据
   */
  const handleRunWithParams = async (data: Record<string, any>) => {
    const { isValid } = checkValid()
    if (!isValid)
      return
    setNodeRunning()
    isRunAfterSingleRun.value = true
    tabType.value = TabType.lastRun
    callRunApi(data, () => {
      invalidLastRun()
    })
    hideSingleRun()
  }

  /**
   * 处理标签页点击
   * @param type 标签页类型
   */
  const handleTabClicked = (type: TabType) => {
    isRunAfterSingleRun.value = false
    tabType.value = type
  }

  /**
   * 获取表单中已存在的变量值
   * @param forms 表单数组
   */
  const getExistVarValuesInForms = (forms: FormProps[]) => {
    if (!forms || forms.length === 0)
      return []

    const valuesArr = forms.map((form) => {
      const values: Record<string, boolean> = {}
      form.inputs.forEach(({ variable, getVarValueFromDependent }: any) => {
        const isGetValueFromDependent = getVarValueFromDependent || !variable.includes('.')
        if (isGetValueFromDependent && !singleRunParams?.getDependentVar)
          return

        const selector = isGetValueFromDependent ? (singleRunParams?.getDependentVar(variable) || []) : variable.slice(1, -1).split('.')
        if (!selector || selector.length === 0)
          return
        const [nodeId, varName] = selector.slice(0, 2)
        if (!isStartNode && nodeId === id) { // inner vars like loop vars
          values[variable] = true
          return
        }
        const inspectVarValue = hasSetInspectVar(nodeId, varName, systemVars.value, conversationVars.value) // also detect system var , env and  conversation var
        if (inspectVarValue)
          values[variable] = true
      })
      return values
    })
    return valuesArr
  }

  /**
   * 检查所有变量是否有值
   * @param vars 变量选择器数组
   */
  const isAllVarsHasValue = (vars?: ValueSelector[]) => {
    if (!vars || vars.length === 0)
      return true
    return vars.every((varItem) => {
      const [nodeId, varName] = varItem.slice(0, 2)
      const inspectVarValue = hasSetInspectVar(nodeId, varName, systemVars.value, conversationVars.value) // also detect system var , env and  conversation var
      return inspectVarValue
    })
  }

  /**
   * 检查部分变量是否有值
   * @param vars 变量选择器数组
   */
  const isSomeVarsHasValue = (vars?: ValueSelector[]) => {
    if (!vars || vars.length === 0)
      return true
    return vars.some((varItem) => {
      const [nodeId, varName] = varItem.slice(0, 2)
      const inspectVarValue = hasSetInspectVar(nodeId, varName, systemVars.value, conversationVars.value) // also detect system var , env and  conversation var
      return inspectVarValue
    })
  }

  /**
   * 获取过滤后的已存在变量表单
   * @param forms 表单数组
   */
  const getFilteredExistVarForms = (forms: FormProps[]) => {
    if (!forms || forms.length === 0)
      return []

    const existVarValuesInForms = getExistVarValuesInForms(forms)

    const res = forms.map((form, i) => {
      const existVarValuesInForm = existVarValuesInForms[i]
      const newForm = { ...form }
      const inputs = form.inputs.filter((input: any) => {
        return existVarValuesInForm && !(input.variable in existVarValuesInForm)
      })
      newForm.inputs = inputs
      return newForm
    }).filter(form => form.inputs.length > 0)
    return res
  }

  /**
   * 检查聚合器变量是否已设置
   * @param vars 变量选择器二维数组
   */
  const checkAggregatorVarsSet = (vars: ValueSelector[][]) => {
    if (!vars || vars.length === 0)
      return true
    // in each group, at last one set is ok
    return vars.every((varItem) => {
      return isSomeVarsHasValue(varItem)
    })
  }

  /**
   * 自定义单步运行后的处理
   */
  const handleAfterCustomSingleRun = () => {
    invalidLastRun()
    tabType.value = TabType.lastRun
    hideSingleRun()
  }

  /**
   * 处理单步运行
   */
  const handleSingleRun = () => {
    const { isValid } = checkValid()
    if (!isValid)
      return
    if (isCustomRunNode) {
      showSingleRun()
      return
    }
    const vars = singleRunParams?.getDependentVars?.()
    // no need to input params
    if (isAggregatorNode ? checkAggregatorVarsSet(vars) : isAllVarsHasValue(vars)) {
      callRunApi({}, async () => {
        isRunAfterSingleRun.value = true
        setNodeRunning()
        invalidLastRun()
        tabType.value = TabType.lastRun
      })
    }
    else {
      showSingleRun()
    }
  }

  return {
    ...oneStepRunRes,
    tabType,
    isRunAfterSingleRun,
    setIsRunAfterSingleRun: (value: boolean) => {
      isRunAfterSingleRun.value = value
    },
    setTabType: handleTabClicked,
    handleAfterCustomSingleRun,
    singleRunParams,
    nodeInfo,
    setRunInputData,
    handleSingleRun,
    handleRunWithParams,
    getExistVarValuesInForms,
    getFilteredExistVarForms,
  }
}

export default useLastRun
