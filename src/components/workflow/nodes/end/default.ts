import type { NodeDefault } from '@/types'
import type { EndNodeType } from './types.ts'
import { genNodeMetaData } from '@/components/workflow/utils'
import { BlockEnum } from '@/types'

const metaData = genNodeMetaData({
  sort: 2.1,
  type: BlockEnum.End,
  isRequired: true,
})
const nodeDefault: NodeDefault<EndNodeType> = {
  metaData,
  defaultValue: {
    outputs: [],
  },
  checkValid() {
    return {
      isValid: true,
      errorMessage: '',
    }
  },
}

export default nodeDefault
