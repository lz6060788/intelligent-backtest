import type { NodeDefault } from '@/types'
import type { OperatorOverviewNodeType } from './types.ts'
import { genNodeMetaData } from '@/components/workflow/utils'
import { BlockEnum } from '@/types'

const metaData = genNodeMetaData({
  sort: 2.1,
  type: BlockEnum.OperatorOverview,
  isRequired: false,
})
const nodeDefault: NodeDefault<OperatorOverviewNodeType> = {
  metaData,
  defaultValue: {
    graph: { nodes: [], edges: [], viewport: { x: 0, y: 0, zoom: 0.25 } },
  },
  checkValid() {
    return {
      isValid: true,
      errorMessage: '',
    }
  },
}

export default nodeDefault
