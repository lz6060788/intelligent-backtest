import type { NodeDefault } from '@/types'
import { type SearchNodeType, type SearchItem } from './types.ts'
import { genNodeMetaData } from '@/components/workflow/utils'
import { BlockEnum, ValueType } from '@/types'

const metaData = genNodeMetaData({
  sort: 2.1,
  type: BlockEnum.Search,
  isRequired: false,
})
const nodeDefault: NodeDefault<SearchNodeType> = {
  metaData,
  defaultValue: {
    retrieve_params: {
      items: [
        {
          search_query: {
            type: ValueType.constant,
            value: '',
          },
          start_date: {
            type: ValueType.constant,
            value: '',
          },
          end_date: {
            type: ValueType.constant,
            value: '',
          },
        },
      ]
    }
  },
  checkValid() {
    return {
      isValid: true,
      errorMessage: '',
    }
  },
}

export default nodeDefault
