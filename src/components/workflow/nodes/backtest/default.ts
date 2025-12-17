import type { NodeDefault } from '@/types'
import { PriceType, type BacktestNodeType } from './types.ts'
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
    ticker: '300033.SZ',
    start_date: '2025-01-01',
    end_date: '2025-12-17',
    price_type: PriceType.CLOSE,
    execution_signals: {
      open: {
        isManual: true,
        value: ['20251216', '20251214'],
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
