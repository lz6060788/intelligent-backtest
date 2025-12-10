import startDefault from '@/components/workflow/nodes/start/default';
import ifElseDefault from '@/components/workflow/nodes/if-else/default';
import codeDefault from '@/components/workflow/nodes/code/default';
import httpDefault from '@/components/workflow/nodes/http/default';
import loopStartDefault from '@/components/workflow/nodes/loop-start/default';
import loopDefault from '@/components/workflow/nodes/loop/default';
import loopEndDefault from '@/components/workflow/nodes/loop-end/default';
import llmDefault from '@/components/workflow/nodes/llm/default';
import variableAssignerDefault from '@/components/workflow/nodes/variable-assigner/default';
import endDefault from '@/components/workflow/nodes/end/default';
import calculatorDefault from '@/components/workflow/nodes/calculator/default';
import calculatorStartDefault from '@/components/workflow/nodes/calculator-start/default';
import calculatorBacktestDefault from '@/components/workflow/nodes/calculator-backtest/default';
import calculatorOverviewDefault from '@/components/workflow/nodes/calculator-overview/default';
import { TransferMethod } from '@/types'
import type { NodeDefault, Var } from '@/types'
import { BlockEnum, VarType } from '@/types'


export const WORKFLOW_COMMON_NODES = [
  startDefault,
  ifElseDefault,
  codeDefault,
  httpDefault,
  loopStartDefault,
  loopDefault,
  loopEndDefault,
  llmDefault,
  variableAssignerDefault,
  endDefault,
  calculatorDefault,
  calculatorStartDefault,
  calculatorBacktestDefault,
  calculatorOverviewDefault,
] as NodeDefault[]


export const FILE_TYPE_OPTIONS = [
  { value: 'image', i18nKey: 'image' },
  { value: 'document', i18nKey: 'doc' },
  { value: 'audio', i18nKey: 'audio' },
  { value: 'video', i18nKey: 'video' },
]

export const TRANSFER_METHOD = [
  { value: TransferMethod.local_file, i18nKey: 'localUpload' },
  { value: TransferMethod.remote_url, i18nKey: 'url' },
]

export const SUB_VARIABLES = ['type', 'size', 'name', 'url', 'extension', 'mime_type', 'transfer_method', 'related_id']
export const OUTPUT_FILE_SUB_VARIABLES = SUB_VARIABLES.filter(key => key !== 'transfer_method')

export const NODE_PADDING_X = 16;
export const NODE_PADDING_Y = 12;

export const CUSTOM_LOOP_START_NODE = 'custom-loop-start'

export const MAX_ITERATION_PARALLEL_NUM = 10
export const MIN_ITERATION_PARALLEL_NUM = 1
export const DEFAULT_ITER_TIMES = 1
export const DEFAULT_LOOP_TIMES = 1
export const NODE_WIDTH = 240
export const X_OFFSET = 60
export const NODE_WIDTH_X_OFFSET = NODE_WIDTH + X_OFFSET
export const Y_OFFSET = 39
export const START_INITIAL_POSITION = { x: 80, y: 282 }
export const AUTO_LAYOUT_OFFSET = {
  x: -42,
  y: 243,
}
export const ITERATION_NODE_Z_INDEX = 1
export const ITERATION_CHILDREN_Z_INDEX = 1002
export const ITERATION_PADDING = {
  top: 65,
  right: 16,
  bottom: 20,
  left: 16,
}

export const LOOP_NODE_Z_INDEX = 1
export const LOOP_CHILDREN_Z_INDEX = 1002
export const LOOP_PADDING = {
  top: 65,
  right: 16,
  bottom: 20,
  left: 16,
}

export const NODE_LAYOUT_HORIZONTAL_PADDING = 60
export const NODE_LAYOUT_VERTICAL_PADDING = 60
export const NODE_LAYOUT_MIN_DISTANCE = 100

export const RETRIEVAL_OUTPUT_STRUCT = `{
  "content": "",
  "title": "",
  "url": "",
  "icon": "",
  "metadata": {
    "dataset_id": "",
    "dataset_name": "",
    "document_id": [],
    "document_name": "",
    "document_data_source_type": "",
    "segment_id": "",
    "segment_position": "",
    "segment_word_count": "",
    "segment_hit_count": "",
    "segment_index_node_hash": "",
    "score": ""
  }
}`

export const SUPPORT_OUTPUT_VARS_NODE = [
  BlockEnum.Start, BlockEnum.LLM, BlockEnum.Code, BlockEnum.Calculator,
  BlockEnum.HttpRequest, BlockEnum.Tool, BlockEnum.VariableAggregator,
  BlockEnum.Loop, BlockEnum.Agent, BlockEnum.DataSource, BlockEnum.CalculatorStart,
]

export const AGENT_OUTPUT_STRUCT: Var[] = [
  {
    variable: 'usage',
    type: VarType.object,
  },
]

export const LLM_OUTPUT_STRUCT: Var[] = [
  {
    variable: 'text',
    type: VarType.string,
  },
  {
    variable: 'reasoning_content',
    type: VarType.string,
  },
  {
    variable: 'usage',
    type: VarType.object,
  },
]

export const KNOWLEDGE_RETRIEVAL_OUTPUT_STRUCT: Var[] = [
  {
    variable: 'result',
    type: VarType.arrayObject,
  },
]

export const TEMPLATE_TRANSFORM_OUTPUT_STRUCT: Var[] = [
  {
    variable: 'output',
    type: VarType.string,
  },
]

export const QUESTION_CLASSIFIER_OUTPUT_STRUCT = [
  {
    variable: 'class_name',
    type: VarType.string,
  },
  {
    variable: 'usage',
    type: VarType.object,
  },
]

export const HTTP_REQUEST_OUTPUT_STRUCT: Var[] = [
  {
    variable: 'body',
    type: VarType.string,
  },
  {
    variable: 'status_code',
    type: VarType.number,
  },
  {
    variable: 'headers',
    type: VarType.object,
  },
  {
    variable: 'files',
    type: VarType.arrayFile,
  },
]

export const TOOL_OUTPUT_STRUCT: Var[] = [
  {
    variable: 'text',
    type: VarType.string,
  },
  {
    variable: 'files',
    type: VarType.arrayFile,
  },
  {
    variable: 'json',
    type: VarType.arrayObject,
  },
]

export const PARAMETER_EXTRACTOR_COMMON_STRUCT: Var[] = [
  {
    variable: '__is_success',
    type: VarType.number,
  },
  {
    variable: '__reason',
    type: VarType.string,
  },
  {
    variable: '__usage',
    type: VarType.object,
  },
]

export const FILE_STRUCT: Var[] = [
  {
    variable: 'name',
    type: VarType.string,
  },
  {
    variable: 'size',
    type: VarType.number,
  },
  {
    variable: 'type',
    type: VarType.string,
  },
  {
    variable: 'extension',
    type: VarType.string,
  },
  {
    variable: 'mime_type',
    type: VarType.string,
  },
  {
    variable: 'transfer_method',
    type: VarType.string,
  },
  {
    variable: 'url',
    type: VarType.string,
  },
  {
    variable: 'related_id',
    type: VarType.string,
  },
]

export const DEFAULT_FILE_UPLOAD_SETTING = {
  allowed_file_upload_methods: ['local_file', 'remote_url'],
  max_length: 5,
  allowed_file_types: ['image'],
  allowed_file_extensions: [],
}

export const WORKFLOW_DATA_UPDATE = 'WORKFLOW_DATA_UPDATE'
export const CUSTOM_NODE = 'custom'
export const CUSTOM_EDGE = 'custom'
export const DSL_EXPORT_CHECK = 'DSL_EXPORT_CHECK'
export const DEFAULT_RETRY_MAX = 3
export const DEFAULT_RETRY_INTERVAL = 100
