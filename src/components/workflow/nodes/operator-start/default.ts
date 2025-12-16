import type { NodeDefault } from '@/types'
import type { OperatorStartNodeType } from './types'
import { genNodeMetaData } from '@/components/workflow/utils'
import { BlockEnum } from '@/types'

const metaData = genNodeMetaData({
  sort: 0.1,
  type: BlockEnum.OperatorStart,
  isStart: false,
  isRequired: true,
  isUndeletable: true,
  isSingleton: true,
  isTypeFixed: true,
  _isBelongToCalculator: true,
})
const nodeDefault: NodeDefault<OperatorStartNodeType> = {
  metaData,
  defaultValue: {
    variables: [],
  },
  checkValid() {
    return {
      isValid: true,
    }
  },
}

export default nodeDefault
