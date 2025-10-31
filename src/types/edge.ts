import type { BlockEnum } from "./node"
import type { Edge as VueflowEdge } from '@vue-flow/core'

export type CommonEdgeType = {
  _hovering?: boolean
  _connectedNodeIsHovering?: boolean
  _connectedNodeIsSelected?: boolean
  _isBundled?: boolean
  _waitingRun?: boolean
  isInIteration?: boolean
  iteration_id?: string
  isInLoop?: boolean
  loop_id?: string
  sourceType: BlockEnum
  targetType: BlockEnum,
  _isTemp?: boolean,
}

export type Edge = VueflowEdge<CommonEdgeType>
