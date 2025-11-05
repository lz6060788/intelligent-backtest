import type { NodeDefault } from '@/types'
import type { LoopStartNodeType } from './types'
import { genNodeMetaData } from '@/components/workflow/utils'
import { BlockEnum } from '@/types'

const metaData = genNodeMetaData({
  sort: -1,
  type: BlockEnum.LoopStart,
})
const nodeDefault: NodeDefault<LoopStartNodeType> = {
  metaData,
  defaultValue: {},
  checkValid() {
    return {
      isValid: true,
    }
  },
}

export default nodeDefault
