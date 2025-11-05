import type { NodeDefault } from '@/types'
import type {
  SimpleNodeType,
} from '../../simple-node/types'
import { genNodeMetaData } from '../../utils/gen-node-meta-data'
import { BlockEnum } from '@/types'
import { BlockClassificationEnum } from '@/types'

const metaData = genNodeMetaData({
  classification: BlockClassificationEnum.Logic,
  sort: 2,
  type: BlockEnum.LoopEnd,
  isSingleton: true,
})
const nodeDefault: NodeDefault<SimpleNodeType> = {
  metaData,
  defaultValue: {},
  checkValid() {
    return {
      isValid: true,
    }
  },
}

export default nodeDefault
