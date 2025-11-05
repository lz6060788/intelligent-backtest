import { InputVarType } from '@/types'
// import { AgentStrategy } from '@/types'
import { PromptRole } from '@/types'
// import { DatasetAttr } from '@/types'
// import pkg from '../package.json'
// import type { ModelParameterRule } from '@/types'


export const DEFAULT_CHAT_PROMPT_CONFIG = {
  prompt: [
    {
      role: PromptRole.system,
      text: '',
    },
  ],
}

export const DEFAULT_COMPLETION_PROMPT_CONFIG = {
  prompt: {
    text: '',
  },
  conversation_histories_role: {
    user_prefix: '',
    assistant_prefix: '',
  },
}

export const getMaxToken = (modelId: string) => {
  return modelId === 'gpt-4' || modelId === 'gpt-3.5-turbo-16k' ? 8000 : 4000
}

export const LOCALE_COOKIE_NAME = 'locale'

export const DEFAULT_VALUE_MAX_LEN = 48
export const DEFAULT_PARAGRAPH_VALUE_MAX_LEN = 1000

export const zhRegex = /^[\u4E00-\u9FA5]$/m
export const emojiRegex = /^[\uD800-\uDBFF][\uDC00-\uDFFF]$/m
export const emailRegex = /^[\w.!#$%&'*+\-/=?^{|}~]+@([\w-]+\.)+[\w-]{2,}$/m
const MAX_ZN_VAR_NAME_LENGTH = 8
const MAX_EN_VAR_VALUE_LENGTH = 30
export const getMaxVarNameLength = (value: string) => {
  if (zhRegex.test(value)) return MAX_ZN_VAR_NAME_LENGTH

  return MAX_EN_VAR_VALUE_LENGTH
}

export const MAX_VAR_KEY_LENGTH = 30

export const MAX_PROMPT_MESSAGE_LENGTH = 10

export const VAR_ITEM_TEMPLATE = {
  key: '',
  name: '',
  type: 'string',
  max_length: DEFAULT_VALUE_MAX_LEN,
  required: true,
}

export const VAR_ITEM_TEMPLATE_IN_WORKFLOW = {
  variable: '',
  label: '',
  type: InputVarType.textInput,
  max_length: DEFAULT_VALUE_MAX_LEN,
  required: true,
  options: [],
}

// export const VAR_ITEM_TEMPLATE_IN_PIPELINE = {
//   variable: '',
//   label: '',
//   type: PipelineInputVarType.textInput,
//   max_length: DEFAULT_VALUE_MAX_LEN,
//   required: true,
//   options: [],
// }

export const appDefaultIconBackground = '#D5F5F6'

export const NEED_REFRESH_APP_LIST_KEY = 'needRefreshAppList'

export const DATASET_DEFAULT = {
  top_k: 4,
  score_threshold: 0.8,
}

export const LOOP_NODE_MAX_COUNT = 100

export const APP_PAGE_LIMIT = 10

export const ANNOTATION_DEFAULT = {
  score_threshold: 0.9,
}

export enum AgentStrategy {
    functionCall = 'function_call',
    react = 'react',
  }

export const DEFAULT_AGENT_SETTING = {
  enabled: false,
  max_iteration: 10,
  strategy: AgentStrategy.functionCall,
  tools: [],
}

export const DEFAULT_AGENT_PROMPT = {
  chat: `Respond to the human as helpfully and accurately as possible.

{{instruction}}

You have access to the following tools:

{{tools}}

Use a json blob to specify a tool by providing an {{TOOL_NAME_KEY}} key (tool name) and an {{ACTION_INPUT_KEY}} key (tool input).
Valid "{{TOOL_NAME_KEY}}" values: "Final Answer" or {{tool_names}}

Provide only ONE action per $JSON_BLOB, as shown:

\`\`\`
{
  "{{TOOL_NAME_KEY}}": $TOOL_NAME,
  "{{ACTION_INPUT_KEY}}": $ACTION_INPUT
}
\`\`\`

Follow this format:

Question: input question to answer
Thought: consider previous and subsequent steps
Action:
\`\`\`
$JSON_BLOB
\`\`\`
Observation: action result
... (repeat Thought/Action/Observation N times)
Thought: I know what to respond
Action:
\`\`\`
{
  "{{TOOL_NAME_KEY}}": "Final Answer",
  "{{ACTION_INPUT_KEY}}": "Final response to human"
}
\`\`\`

Begin! Reminder to ALWAYS respond with a valid json blob of a single action. Use tools if necessary. Respond directly if appropriate. Format is Action:\`\`\`$JSON_BLOB\`\`\`then Observation:.`,
  completion: `
Respond to the human as helpfully and accurately as possible.

{{instruction}}

You have access to the following tools:

{{tools}}

Use a json blob to specify a tool by providing an {{TOOL_NAME_KEY}} key (tool name) and an {{ACTION_INPUT_KEY}} key (tool input).
Valid "{{TOOL_NAME_KEY}}" values: "Final Answer" or {{tool_names}}

Provide only ONE action per $JSON_BLOB, as shown:

\`\`\`
{{{{
  "{{TOOL_NAME_KEY}}": $TOOL_NAME,
  "{{ACTION_INPUT_KEY}}": $ACTION_INPUT
}}}}
\`\`\`

Follow this format:

Question: input question to answer
Thought: consider previous and subsequent steps
Action:
\`\`\`
$JSON_BLOB
\`\`\`
Observation: action result
... (repeat Thought/Action/Observation N times)
Thought: I know what to respond
Action:
\`\`\`
{{{{
  "{{TOOL_NAME_KEY}}": "Final Answer",
  "{{ACTION_INPUT_KEY}}": "Final response to human"
}}}}
\`\`\`

Begin! Reminder to ALWAYS respond with a valid json blob of a single action. Use tools if necessary. Respond directly if appropriate. Format is Action:\`\`\`$JSON_BLOB\`\`\`then Observation:.
Question: {{query}}
Thought: {{agent_scratchpad}}
  `,
}

export const VAR_REGEX
  = /\{\{(#[a-zA-Z0-9_-]{1,50}(\.\d+)?(\.[a-zA-Z_]\w{0,29}){1,10}#)\}\}/gi

export const resetReg = () => (VAR_REGEX.lastIndex = 0)

export const FULL_DOC_PREVIEW_LENGTH = 50

export const JSON_SCHEMA_MAX_DEPTH = 10

