import { PriceType } from './types'
import type { BacktestNodeType, RiskControl, SignalVariable } from './types'
import type { ValueSelector, Var } from '@/types'
import useNodeCrud from '@/components/workflow/nodes/_base/hooks/use-node-crud.ts'
import {
  useNodesReadOnly,
  useWorkflow,
} from '@/components/workflow/hooks'
import { computed, ref, type Ref } from 'vue'
import { cloneDeep } from 'lodash-es'

const useConfig = (id: string, payload: Ref<BacktestNodeType>) => {
  const { nodesReadOnly: readOnly } = useNodesReadOnly()

  const { setInputs } = useNodeCrud<BacktestNodeType>(id)
  const inputs = computed(() => payload.value)

  const updateTicker = (ticker: string) => {
    const newInputs = cloneDeep(inputs.value)
    newInputs.ticker = ticker
    setInputs(newInputs)
  }

  const updateStartDate = (startDate: string) => {
    console.log('startDate', startDate)
    const newInputs = cloneDeep(inputs.value)
    newInputs.start_date = startDate
    setInputs(newInputs)
  }

  const updateEndDate = (endDate: string) => {
    const newInputs = cloneDeep(inputs.value)
    newInputs.end_date = endDate
    setInputs(newInputs)
  }

  const updatePriceType = (priceType: PriceType) => {
    console.log('priceType', priceType)
    const newInputs = cloneDeep(inputs.value)
    newInputs.price_type = priceType
    setInputs(newInputs)
  }

  const updateExecutionSignals = (key: PriceType, executionSignals: SignalVariable) => {
    const newInputs = cloneDeep(inputs.value)
    newInputs.execution_signals[key] = executionSignals
    setInputs(newInputs)
  }

  const updateRiskControl = (riskControl: RiskControl) => {
    const newInputs = cloneDeep(inputs.value)
    newInputs.risk_control = riskControl
    setInputs(newInputs)
  }

  return {
    readOnly,
    inputs,
    updateTicker,
    updateStartDate,
    updateEndDate,
    updatePriceType,
    updateExecutionSignals,
    updateRiskControl,
    // updateOutput,
  }
}

export default useConfig
