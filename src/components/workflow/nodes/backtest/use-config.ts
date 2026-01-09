import { PriceType } from './types'
import type { BacktestNodeType, PoolPresetConfig, PoolSourceType, PoolTypeEnum, RiskControl, SignalVariable, TickerPickerMode } from './types'
import type { ValueSelector, Var } from '@/types'
import useNodeCrud from '@/components/workflow/nodes/_base/hooks/use-node-crud.ts'
import {
  useNodesReadOnly,
  useWorkflow,
} from '@/components/workflow/hooks'
import { computed, onMounted, ref, type Ref } from 'vue'
import { cloneDeep } from 'lodash-es'

const useConfig = (id: string, payload: Ref<BacktestNodeType>) => {
  const { nodesReadOnly: readOnly } = useNodesReadOnly()

  const { setInputs } = useNodeCrud<BacktestNodeType>(id)
  const inputs = computed(() => payload.value)

  onMounted(() => {
    inputs.value.ticker.custom_config.reference_path.filter(item => item.length === 0)
  })

  const updatePoolType = (poolType: PoolTypeEnum) => {
    const newInputs = cloneDeep(inputs.value)
    newInputs.ticker.pool_type = poolType
    setInputs(newInputs)
  }

  const updatePresetCode = (preset_code: string[]) => {
    const newInputs = cloneDeep(inputs.value)
    newInputs.ticker.preset_config = {
      preset_code,
    }
    setInputs(newInputs)
  }

  const updateCustomPoolSourceType = (source_type: PoolSourceType) => {
    const newInputs = cloneDeep(inputs.value)
    newInputs.ticker.custom_config.source_type = source_type
    setInputs(newInputs)
  }

  const updateCustomPoolTickers = (tickers: string[]) => {
    const newInputs = cloneDeep(inputs.value)
    newInputs.ticker.custom_config.tickers = tickers
    setInputs(newInputs)
  }

  const addCustomPoolReferencePath = () => {
    const newInputs = cloneDeep(inputs.value)
    newInputs.ticker.custom_config.reference_path.push([])
    setInputs(newInputs)
  }

  const updateCustomPoolReferencePath = (index: number, reference_path: ValueSelector) => {
    const newInputs = cloneDeep(inputs.value)
    newInputs.ticker.custom_config.reference_path[index] = reference_path
    setInputs(newInputs)
  }

  const removeCustomPoolReferencePath = (index: number) => {
    const newInputs = cloneDeep(inputs.value)
    newInputs.ticker.custom_config.reference_path.splice(index, 1)
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
    updatePoolType,
    updatePresetCode,
    updateCustomPoolSourceType,
    updateCustomPoolTickers,
    addCustomPoolReferencePath,
    updateCustomPoolReferencePath,
    removeCustomPoolReferencePath,
    updateStartDate,
    updateEndDate,
    updatePriceType,
    updateExecutionSignals,
    updateRiskControl,
  }
}

export default useConfig
