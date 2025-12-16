import { type Node as VueFlowNode, type Position, type XYPosition, type GraphNode as VueFlowGraphNode } from '@vue-flow/core';
import type { ErrorHandleTypeEnum, VarType, WorkflowRetryConfig } from '.';


export type DefaultValueForm = {
  key: string
  type: VarType
  value?: any
}

export const enum BlockEnum {
  Start = 'start',
  End = 'end',
  IfElse = 'if-else',
  VariableAggregator = 'variable-aggregator',
  HttpRequest = 'http-request',
  Code = 'code',
  LLM = 'llm',
  Agent = 'agent',
  Loop = 'loop',
  LoopStart = 'loop-start',
  LoopEnd = 'loop-end',
  DataSource = 'DataSource',
  Operator = 'operator',
  Tool = 'tool',
  OperatorStart = 'operator-start',
  Backtest = 'backtest',
  OperatorOverview = 'operator-overview',
}

export type Branch = {
  id: string
  name: string
}

export enum NodeRunningStatus {
  NotStart = 'not-start',
  Waiting = 'waiting',
  Running = 'running',
  Succeeded = 'succeeded',
  Failed = 'failed',
  Exception = 'exception',
  Retry = 'retry',
  Stopped = 'stopped',
}

export type CommonNodeType<T = {}> = {
  _connectedSourceHandleIds?: string[]
  _connectedTargetHandleIds?: string[]
  _targetBranches?: Branch[]
  _isSingleRun?: boolean
  _runningStatus?: NodeRunningStatus
  _runningBranchId?: string
  _singleRunningStatus?: NodeRunningStatus
  _isCandidate?: boolean
  _isBundled?: boolean
  _children?: { nodeId: string; nodeType: BlockEnum }[]
  _isEntering?: boolean
  // _showAddVariablePopup?: boolean
  // _holdAddVariablePopup?: boolean
  // _iterationLength?: number
  // _iterationIndex?: number
  _waitingRun?: boolean
  _retryIndex?: number
  _dataSourceStartToAdd?: boolean
  _isTempNode?: boolean
  // isInIteration?: boolean
  // iteration_id?: string
  selected?: boolean
  title: string
  desc: string
  type: BlockEnum
  width?: number
  height?: number
  position?: XYPosition
  _loopLength?: number
  _loopIndex?: number
  isInLoop?: boolean
  loop_id?: string
  error_strategy?: ErrorHandleTypeEnum
  retry_config?: WorkflowRetryConfig
  default_value?: DefaultValueForm[]
  credential_id?: string
  _dimmed?: boolean
  _isBelongToCalculator?: boolean
  // _dimmed?: boolean
} & T;

export type Node<T = {}> = VueFlowNode<CommonNodeType<T>>

export type GraphNode = VueFlowGraphNode<CommonNodeType>

export type NodeProps<T = unknown> = { id: string; data: CommonNodeType<T> }

export type  HandleProps = {
  handleId: string;
  handleClassName?: string;
  nodeSelectorClassName?: string
  showExceptionStatus?: boolean
} & NodeProps;

export type NodeDefault<T = {}> = {
  metaData: {
    classification: BlockClassificationEnum
    sort: number
    type: BlockEnum
    title: string
    author: string
    description?: string
    helpLinkUri?: string
    isRequired?: boolean
    isUndeletable?: boolean
    isStart?: boolean
    isSingleton?: boolean
    isTypeFixed?: boolean
    _isBelongToCalculator?: boolean
  }
  defaultValue: Partial<T>
  defaultRunInputData?: Record<string, any>
  checkValid: (payload: T, t: any, moreDataForCheckValid?: any) => { isValid: boolean; errorMessage?: string }
  // getOutputVars?: (payload: T, allPluginInfoList: Record<string, ToolWithProvider[]>, ragVariables?: Var[], utils?: {
  //   schemaTypeDefinitions?: SchemaTypeDefinition[]
  // }) => Var[]
}

export enum BlockClassificationEnum {
  Default = '-',
  QuestionUnderstand = 'question-understand',
  Logic = 'logic',
  Transform = 'transform',
  Utilities = 'utilities',
}

