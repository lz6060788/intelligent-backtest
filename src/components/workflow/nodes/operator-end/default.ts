import type { NodeDefault } from '@/types'
import type { OperatorEndNodeType } from './types.ts'
import { genNodeMetaData } from '@/components/workflow/utils'
import { BlockEnum } from '@/types'

const metaData = genNodeMetaData({
  sort: 2.1,
  type: BlockEnum.OperatorEnd,
  isRequired: true,
  _isBelongToCalculator: true,
})
const nodeDefault: NodeDefault<OperatorEndNodeType> = {
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
