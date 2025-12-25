import type { NodeDefault } from '@/types'
import type { IterationStartNodeType } from './types'
import { genNodeMetaData } from '@/components/workflow/utils'
import { BlockEnum } from '@/types'

const metaData = genNodeMetaData({
  sort: -1,
  type: BlockEnum.IterationStart,
})
const nodeDefault: NodeDefault<IterationStartNodeType> = {
  metaData,
  defaultValue: {},
  checkValid() {
    return {
      isValid: true,
    }
  },
}

export default nodeDefault
