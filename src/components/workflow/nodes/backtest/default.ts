import type { NodeDefault } from '@/types'
import { PoolSourceType, PoolTypeEnum, PriceType, TickerPickerMode, type BacktestNodeType } from './types.ts'
import { genNodeMetaData } from '@/components/workflow/utils'
import { BlockEnum, VarType } from '@/types'

const metaData = genNodeMetaData({
  sort: 2.1,
  type: BlockEnum.Backtest,
  isRequired: false,
})
const nodeDefault: NodeDefault<BacktestNodeType> = {
  metaData,
  defaultValue: {
    ticker: {
      pool_type: PoolTypeEnum.preset,
      preset_config: {
        preset_code: []
      },
      custom_config: {
        source_type: PoolSourceType.manual_list,
        tickers: [],
        reference_path: []
      },
    },
    start_date: '2025-01-01',
    end_date: '2025-12-17',
    price_type: PriceType.CLOSE,
    execution_signals: {
      open: {
        isManual: false,
        value: [],
      },
      close: {
        isManual: false,
        value: [],
      },
    },
    risk_control: {},
  },
  checkValid() {
    return {
      isValid: true,
      errorMessage: '',
    }
  },
}

export default nodeDefault
