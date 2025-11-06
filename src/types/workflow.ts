import type { BlockEnum, Node } from './node';
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

export type WorkflowContext = {
  id?: string;
}

export enum ErrorHandleMode {
  Terminated = 'terminated',
  ContinueOnError = 'continue-on-error',
  RemoveAbnormalOutput = 'remove-abnormal-output',
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
