import type { NodeDefault } from '@/types'
import type { BacktestNodeType } from './types.ts'
import { genNodeMetaData } from '@/components/workflow/utils'
import { BlockEnum } from '@/types'

const metaData = genNodeMetaData({
  sort: 2.1,
  type: BlockEnum.Backtest,
  isRequired: false,
  _isBelongToCalculator: true,
})
const nodeDefault: NodeDefault<BacktestNodeType> = {
  metaData,
  defaultValue: {
  },
  checkValid() {
    return {
      isValid: true,
      errorMessage: '',
    }
  },
}

export default nodeDefault
