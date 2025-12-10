import type { NodeDefault } from '@/types'
import type { CalculatorOverviewNodeType } from './types.ts'
import { genNodeMetaData } from '@/components/workflow/utils'
import { BlockEnum } from '@/types'

const metaData = genNodeMetaData({
  sort: 2.1,
  type: BlockEnum.CalculatorOverview,
  isRequired: false,
})
const nodeDefault: NodeDefault<CalculatorOverviewNodeType> = {
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
