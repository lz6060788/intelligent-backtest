import type { NodeDefault } from '@/types'
import type { OperatorStartNodeType } from './types'
import { genNodeMetaData } from '@/components/workflow/utils'
import { BlockEnum, InputVarType, VarType } from '@/types'
import i18n from '@/locales'

const t = i18n.global.t

const i18nPrefix = 'workflow.nodes.operatorStart'

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
    inputs: [
      {
        variable: 'start_date',
        type: InputVarType.textInput,
        label: t(`${i18nPrefix}.startDate`),
        placeholder: t(`${i18nPrefix}.startDatePlaceholder`),
        required: false
      },
      {
        variable: 'end_date',
        type: InputVarType.textInput,
        label: t(`${i18nPrefix}.endDate`),
        placeholder: t(`${i18nPrefix}.endDatePlaceholder`),
        required: false
      },
    ],
    variables: [],
  },
  checkValid() {
    return {
      isValid: true,
    }
  },
}

export default nodeDefault
