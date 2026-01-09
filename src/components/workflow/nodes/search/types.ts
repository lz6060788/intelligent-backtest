import type { CommonNodeType, ValueSelector, ValueType, VarType } from '@/types'

export type SearchItemValue = {
  type: ValueType
  value: string | ValueSelector
}

export type SearchItem = {
  search_query: SearchItemValue
  start_date: SearchItemValue
  end_date: SearchItemValue
}

export type SearchNodeType = CommonNodeType & {
  retrieve_params: {
    items: SearchItem[]
  }
}
