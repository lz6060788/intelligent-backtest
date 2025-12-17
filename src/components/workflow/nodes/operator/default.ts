import { type NodeDefault, VarType } from '@/types'
import { type OperatorNodeType } from './types'
import { OperatorArgumentValueTypeEnum, OperatorOutputValueTypeEnum } from './constant/enums'
import { genNodeMetaData } from '@/components/workflow/utils'
import { BlockEnum } from '@/types'
import { BlockClassificationEnum } from '@/types'
const i18nPrefix = 'workflow.errorMsg'

const metaData = genNodeMetaData({
  classification: BlockClassificationEnum.Logic,
  sort: 1,
  type: BlockEnum.Operator,
  helpLinkUri: 'operator',
  _isBelongToCalculator: true,
})
const nodeDefault: NodeDefault<OperatorNodeType> = {
  metaData,
  defaultValue: {
    operator: '',
    alias: '',
    variables: []
  },
  checkValid(payload: OperatorNodeType, t: any) {
    let errorMessages = ''
    return {
      isValid: !errorMessages,
      errorMessage: errorMessages,
    }
  },
}

export default nodeDefault
