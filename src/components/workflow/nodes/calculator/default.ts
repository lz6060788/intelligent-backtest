import { type NodeDefault, VarType } from '@/types'
import { type CalculatorNodeType } from './types'
import { CalculatorArgumentValueTypeEnum, CalculatorOutputValueTypeEnum } from './constant/enums'
import { genNodeMetaData } from '@/components/workflow/utils'
import { BlockEnum } from '@/types'
import { BlockClassificationEnum } from '@/types'
const i18nPrefix = 'workflow.errorMsg'

const metaData = genNodeMetaData({
  classification: BlockClassificationEnum.Logic,
  sort: 1,
  type: BlockEnum.Calculator,
  helpLinkUri: 'calculator',
})
const nodeDefault: NodeDefault<CalculatorNodeType> = {
  metaData,
  defaultValue: {
    calculator: '',
    alias: '',
    variables: []
  },
  checkValid(payload: CalculatorNodeType, t: any) {
    let errorMessages = ''
    return {
      isValid: !errorMessages,
      errorMessage: errorMessages,
    }
  },
}

export default nodeDefault
