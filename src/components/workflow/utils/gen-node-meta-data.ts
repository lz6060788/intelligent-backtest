import { BlockClassificationEnum } from '@/types'
import type { BlockEnum } from '@/types'

export type GenNodeMetaDataParams = {
  classification?: BlockClassificationEnum
  sort: number
  type: BlockEnum
  title?: string
  author?: string
  helpLinkUri?: string
  isRequired?: boolean
  isUndeletable?: boolean
  isStart?: boolean
  isSingleton?: boolean
  isTypeFixed?: boolean
  _isBelongToCalculator?: boolean
}
export const genNodeMetaData = ({
  classification = BlockClassificationEnum.Default,
  sort,
  type,
  title = '',
  author = '',
  helpLinkUri,
  isRequired = false,
  isUndeletable = false,
  isStart = false,
  isSingleton = false,
  isTypeFixed = false,
  _isBelongToCalculator = false,
}: GenNodeMetaDataParams) => {
  return {
    classification,
    sort,
    type,
    title,
    author,
    helpLinkUri: helpLinkUri || type,
    isRequired,
    isUndeletable,
    isStart,
    isSingleton,
    isTypeFixed,
    _isBelongToCalculator,
  }
}
