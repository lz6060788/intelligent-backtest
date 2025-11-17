import type { BlockEnum, CommonNodeType, Node } from './node';
import type { Edge } from './edge';
import type { ViewportTransform } from '@vue-flow/core';

export enum WorkflowVersion {
  Draft = 'draft',
  Latest = 'latest',
}

export type WorkflowProps = {
  id: string
  nodes: Node[]
  edges: Edge[]
  viewport?: ViewportTransform
}

export type WorkflowDataUpdater = {
  nodes: Node[]
  edges: Edge[]
  viewport: ViewportTransform
}

export type WorkflowContext = {
  id?: string;
}

export enum ErrorHandleMode {
  Terminated = 'terminated',
  ContinueOnError = 'continue-on-error',
  RemoveAbnormalOutput = 'remove-abnormal-output',
}

export enum ControlMode {
  Pointer = 'pointer',
  Hand = 'hand',
}

export type WorkflowRunningData = {
  task_id?: string
  message_id?: string
  conversation_id?: string
  result: {
    workflow_id?: string
    inputs?: string
    inputs_truncated: boolean
    process_data?: string
    process_data_truncated: boolean
    outputs?: string
    outputs_truncated: boolean
    outputs_full_content?: {
      download_url: string
    }
    status: string
    error?: string
    elapsed_time?: number
    total_tokens?: number
    created_at?: number
    created_by?: string
    finished_at?: number
    steps?: number
    showSteps?: boolean
    total_steps?: number
    files?: FileResponse[]
    exceptions_count?: number
  }
  // tracing?: NodeTracing[]
}

export type FileResponse = {
  related_id: string
  extension: string
  filename: string
  size: number
  mime_type: string
  // transfer_method: TransferMethod
  type: string
  url: string
  upload_file_id: string
  remote_url: string
}

export type OnNodeAdd = (
  newNodePayload: {
    nodeType: BlockEnum
    sourceHandle?: string
    targetHandle?: string
  },
  oldNodesPayload: {
    prevNodeId?: string
    prevNodeSourceHandle?: string
    nextNodeId?: string
    nextNodeTargetHandle?: string
  }
) => void

export enum ErrorHandleTypeEnum {
  none = 'none',
  failBranch = 'fail-branch',
  defaultValue = 'default-value',
}

export type WorkflowRetryConfig = {
  max_retries: number
  retry_interval: number
  retry_enabled: boolean
}

export enum VarInInspectType {
  environment = 'environment',
  conversation = 'conversation',
}

export type EnvironmentVariable = {
  id: string
  name: string
  value: any
  value_type: 'string' | 'number' | 'secret'
  description: string
}

export enum WorkflowRunningStatus {
  Waiting = 'waiting',
  Running = 'running',
  Succeeded = 'succeeded',
  Failed = 'failed',
  Stopped = 'stopped',
}

export type NodeTracing = {
  id: string
  index: number
  predecessor_node_id: string
  node_id: string
  iteration_id?: string
  loop_id?: string
  node_type: BlockEnum
  title: string
  inputs: any
  inputs_truncated: boolean
  process_data: any
  process_data_truncated: boolean
  outputs?: Record<string, any>
  outputs_truncated: boolean
  outputs_full_content?: {
    download_url: string
  }
  status: string
  parallel_run_id?: string
  error?: string
  elapsed_time: number
  execution_metadata?: {
    total_tokens: number
    total_price: number
    currency: string
    iteration_id?: string
    iteration_index?: number
    loop_id?: string
    loop_index?: number
    parallel_id?: string
    parallel_start_node_id?: string
    parent_parallel_id?: string
    parent_parallel_start_node_id?: string
    parallel_mode_run_id?: string
    iteration_duration_map?: IterationDurationMap
    loop_duration_map?: LoopDurationMap
    error_strategy?: ErrorHandleTypeEnum
    agent_log?: AgentLogItem[]
    tool_info?: {
      agent_strategy?: string
      icon?: string
    }
    loop_variable_map?: Record<string, any>
  }
  metadata: {
    iterator_length: number
    iterator_index: number
    loop_length: number
    loop_index: number
  }
  created_at: number
  created_by: {
    id: string
    name: string
    email: string
  }
  iterDurationMap?: IterationDurationMap
  loopDurationMap?: LoopDurationMap
  finished_at: number
  extras?: any
  expand?: boolean // for UI
  details?: NodeTracing[][] // iteration or loop detail
  retryDetail?: NodeTracing[] // retry detail
  retry_index?: number
  parallelDetail?: { // parallel detail. if is in parallel, this field will be set
    isParallelStartNode?: boolean
    parallelTitle?: string
    branchTitle?: string
    children?: NodeTracing[]
  }
  parallel_id?: string
  parallel_start_node_id?: string
  parent_parallel_id?: string
  parent_parallel_start_node_id?: string
  agentLog?: AgentLogItemWithChildren[] // agent log
}

export type NodeRunResult = NodeTracing

export enum ChangeType {
  changeVarName = 'changeVarName',
  remove = 'remove',
}

export type MoreInfo = {
  type: ChangeType
  payload?: {
    beforeKey: string
    afterKey?: string
  }
}

export type NodePanelProps<T> = {
  id: string
  data: CommonNodeType<T>
}