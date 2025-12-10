import type { NodeDefault } from '@/types'
import type { CalculatorBacktestNodeType } from './types.ts'
import { genNodeMetaData } from '@/components/workflow/utils'
import { BlockEnum } from '@/types'

const metaData = genNodeMetaData({
  sort: 2.1,
  type: BlockEnum.CalculatorBacktest,
  isRequired: false,
})
const nodeDefault: NodeDefault<CalculatorBacktestNodeType> = {
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
