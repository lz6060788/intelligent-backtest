import type { Ref } from 'vue'
import type { InputVar, ValueSelector, Variable } from '@/types/node'
import { computed } from 'vue'
import type { IterationNodeType } from './types'
import { useI18n } from 'vue-i18n'
import { useIsNodeInIteration, useWorkflow } from '../../hooks'
import { getNodeInfoById, getNodeUsedVarPassToServerKey, getNodeUsedVars, isSystemVar } from '../_base/variable/utils'
import { InputVarType, VarType } from '@/types/node'
import formatTracing from '@/components/workflow/run/utils/format-log'
import type { NodeTracing } from '@/types/workflow'
import { VALUE_SELECTOR_DELIMITER as DELIMITER } from '@/config'
import { useWorkflowInstance } from '@/components/workflow/hooks/use-workflow-instance'

const i18nPrefix = 'workflow.nodes.iteration'

type Params = {
  id: string
  payload: IterationNodeType
  runInputData: Ref<Record<string, any>>
  runInputDataRef: Ref<Record<string, any>>
  getInputVars: (textList: string[]) => InputVar[]
  setRunInputData: (data: Record<string, any>) => void
  toVarInputs: (variables: Variable[]) => InputVar[]
  iterationRunResult: NodeTracing[]
}

/**
 * 单次运行表单参数的composable
 */
const useSingleRunFormParams = ({
  id,
  payload,
  runInputData,
  toVarInputs,
  setRunInputData,
  iterationRunResult,
}: Params) => {
  const { t } = useI18n()
  const { instanceId } = useWorkflowInstance()
  const { isNodeInIteration } = useIsNodeInIteration(id, instanceId)

  const { getIterationNodeChildren, getBeforeNodesInSameBranch } = useWorkflow(instanceId)
  const iterationChildrenNodes = computed(() => getIterationNodeChildren(id))
  const beforeNodes = computed(() => getBeforeNodesInSameBranch(id))
  const canChooseVarNodes = computed(() => [...beforeNodes.value, ...iterationChildrenNodes.value])

  const iteratorInputKey = computed(() => `${id}.input_selector`)
  const iterator = computed(() => runInputData.value[iteratorInputKey.value])
  const setIterator = (newIterator: string[]) => {
    setRunInputData({
      ...runInputData.value,
      [iteratorInputKey.value]: newIterator,
    })
  }

  const { usedOutVars, allVarObject } = computed(() => {
    const vars: ValueSelector[] = []
    const varObjs: Record<string, boolean> = {}
    const allVarObject: Record<string, {
      inSingleRunPassedKey: string
    }> = {}
    iterationChildrenNodes.value.forEach((node) => {
      const nodeVars = getNodeUsedVars(node).filter(item => item && item.length > 0)
      nodeVars.forEach((varSelector) => {
        if (varSelector[0] === id) { // skip iteration node itself variable: item, index
          return
        }
        const isInIteration = isNodeInIteration(varSelector[0])
        if (isInIteration) // not pass iteration inner variable
          return

        const varSectorStr = varSelector.join('.')
        if (!varObjs[varSectorStr]) {
          varObjs[varSectorStr] = true
          vars.push(varSelector)
        }
        let passToServerKeys = getNodeUsedVarPassToServerKey(node, varSelector)
        if (typeof passToServerKeys === 'string')
          passToServerKeys = [passToServerKeys]

        passToServerKeys.forEach((key: string, index: number) => {
          allVarObject[[varSectorStr, node.id, index].join(DELIMITER)] = {
            inSingleRunPassedKey: key,
          }
        })
      })
    })
    const res = toVarInputs(vars.map((item) => {
      const varInfo = getNodeInfoById(canChooseVarNodes.value, item[0])
      return {
        label: {
          nodeType: varInfo?.data.type,
          nodeName: varInfo?.data.title || canChooseVarNodes.value[0]?.data.title, // default start node title
          variable: isSystemVar(item) ? item.join('.') : item[item.length - 1],
        },
        variable: `${item.join('.')}`,
        value_selector: item,
      }
    }))
    return {
      usedOutVars: res,
      allVarObject,
    }
  }).value

  const setInputVarValues = (newPayload: Record<string, any>) => {
    setRunInputData(newPayload)
  }
  const inputVarValues = computed(() => {
    const vars: Record<string, any> = {}
    Object.keys(runInputData.value)
      .forEach((key) => {
        vars[key] = runInputData.value[key]
      })
    return vars
  })

  const forms = computed(() => {
    return [
      {
        inputs: [...usedOutVars],
        values: inputVarValues.value,
        onChange: setInputVarValues,
      },
      {
        label: t(`${i18nPrefix}.input`)!,
        inputs: [{
          label: '',
          variable: iteratorInputKey.value,
          type: InputVarType.iterator,
          required: false,
          getVarValueFromDependent: true,
          isFileItem: payload.iterator_input_type === VarType.arrayFile,
        }],
        values: { [iteratorInputKey.value]: iterator.value },
        onChange: (keyValue: Record<string, any>) => setIterator(keyValue[iteratorInputKey.value]),
      },
    ]
  })

  const nodeInfo = computed(() => formatTracing(iterationRunResult, t)[0])

  const getDependentVars = () => {
    return [payload.iterator_selector]
  }
  const getDependentVar = (variable: string) => {
    if (variable === iteratorInputKey.value)
      return payload.iterator_selector
  }

  return {
    forms,
    nodeInfo,
    allVarObject,
    getDependentVars,
    getDependentVar,
  }
}

export default useSingleRunFormParams
