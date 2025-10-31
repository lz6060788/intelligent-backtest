import type { StructuredOutput } from "@/components/workflow/nodes/llm/types"
import type { BlockEnum } from "."

export type ValueSelector = string[] // [nodeId, key | obj key path]

export enum VarKindType {
  variable = 'variable',
  constant = 'constant',
  mixed = 'mixed',
}

export enum ChatVarType {
  Number = 'number',
  String = 'string',
  Boolean = 'boolean',
  Object = 'object',
  ArrayString = 'array[string]',
  ArrayNumber = 'array[number]',
  ArrayBoolean = 'array[boolean]',
  ArrayObject = 'array[object]',
}

export type Variable = {
  variable: string
  label?: string | {
    nodeType: BlockEnum
    nodeName: string
    variable: string
  }
  value_selector: ValueSelector
  value_type?: VarType
  variable_type?: VarKindType
  value?: string
  options?: string[]
  required?: boolean
  isParagraph?: boolean
}

export type EnvironmentVariable = {
  id: string
  name: string
  value: any
  value_type: 'string' | 'number' | 'secret'
  description: string
}

export type ConversationVariable = {
  id: string
  name: string
  value_type: ChatVarType
  value: any
  description: string
}

export type GlobalVariable = {
  name: string
  value_type: 'string' | 'number'
  description: string
}

export type VariableWithValue = {
  key: string
  value: string
}

export enum InputVarType {
  textInput = 'text-input',
  paragraph = 'paragraph',
  select = 'select',
  number = 'number',
  checkbox = 'checkbox',
  url = 'url',
  files = 'files',
  json = 'json', // obj, array
  jsonObject = 'json_object', // only object support define json schema
  contexts = 'contexts', // knowledge retrieval
  iterator = 'iterator', // iteration input
  singleFile = 'file',
  multiFiles = 'file-list',
  loop = 'loop', // loop input
}

export type InputVar = {
  type: InputVarType
  label: string | {
    nodeType: BlockEnum
    nodeName: string
    variable: string
    isChatVar?: boolean
  }
  variable: string
  max_length?: number
  default?: string | number
  required: boolean
  hint?: string
  options?: string[]
  value_selector?: ValueSelector
  placeholder?: string
  unit?: string
  getVarValueFromDependent?: boolean
  hide?: boolean
  isFileItem?: boolean
  json_schema?: string // for jsonObject type
} & Partial<UploadFileSetting>

export type ModelConfig = {
  provider: string
  name: string
  mode: string
  completion_params: Record<string, any>
}

export enum PromptRole {
  system = 'system',
  user = 'user',
  assistant = 'assistant',
}

export enum EditionType {
  basic = 'basic',
  jinja2 = 'jinja2',
}

export type PromptItem = {
  id?: string
  role?: PromptRole
  text: string
  edition_type?: EditionType
  jinja2_text?: string
}

export enum MemoryRole {
  user = 'user',
  assistant = 'assistant',
}

export type RolePrefix = {
  user: string
  assistant: string
}

export type Memory = {
  role_prefix?: RolePrefix
  window: {
    enabled: boolean
    size: number | string | null
  }
  query_prompt_template: string
}

export enum VarType {
  string = 'string',
  number = 'number',
  integer = 'integer',
  secret = 'secret',
  boolean = 'boolean',
  object = 'object',
  file = 'file',
  array = 'array',
  arrayString = 'array[string]',
  arrayNumber = 'array[number]',
  arrayObject = 'array[object]',
  arrayBoolean = 'array[boolean]',
  arrayFile = 'array[file]',
  any = 'any',
  arrayAny = 'array[any]',
}

export enum ValueType {
  variable = 'variable',
  constant = 'constant',
}

export type Var = {
  variable: string
  type: VarType
  children?: Var[] | StructuredOutput // if type is obj, has the children struct
  isParagraph?: boolean
  isSelect?: boolean
  options?: string[]
  required?: boolean
  des?: string
  isException?: boolean
  isLoopVariable?: boolean
  nodeId?: string
  isRagVariable?: boolean
  schemaType?: string
}

export type NodeOutPutVar = {
  nodeId: string
  title: string
  vars: Var[]
  isStartNode?: boolean
  isLoop?: boolean
  isFlat?: boolean
}

export enum SupportUploadFileTypes {
  image = 'image',
  document = 'document',
  audio = 'audio',
  video = 'video',
  custom = 'custom',
}

export enum TransferMethod {
  all = 'all',
  local_file = 'local_file',
  remote_url = 'remote_url',
}

export type UploadFileSetting = {
  allowed_file_upload_methods: TransferMethod[]
  allowed_file_types: SupportUploadFileTypes[]
  allowed_file_extensions?: string[]
  max_length: number
  number_limits?: number
}

export enum Resolution {
  low = 'low',
  high = 'high',
}

export type VisionSetting = {
  variable_selector: ValueSelector
  detail: Resolution
}

