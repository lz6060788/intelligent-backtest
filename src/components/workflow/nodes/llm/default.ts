// import { RETRIEVAL_OUTPUT_STRUCT } from '../../constants'
import { BlockEnum, EditionType } from '@/types'
import { type NodeDefault, type PromptItem, PromptRole } from '@/types'
import type { LLMNodeType } from './types'
import { genNodeMetaData } from '@/components/workflow/utils'

const RETRIEVAL_OUTPUT_STRUCT = `{
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

const i18nPrefix = 'workflow.errorMsg'

const metaData = genNodeMetaData({
  sort: 1,
  type: BlockEnum.LLM,
})
const nodeDefault: NodeDefault<LLMNodeType> = {
  metaData,
  defaultValue: {
    model: {
      provider: '',
      name: '',
      mode: 'chat',
      completion_params: {
        // temperature: 0.7,
      },
    },
    prompt_template: [
      {
        id: 'system',
        role: PromptRole.system,
        text: 'You are a helpful AI assistant.',
      },
      {
        id: 'user',
        role: PromptRole.user,
        text: 'Hello, how are you?',
      },
    ],
    context: {
      enabled: false,
      variable_selector: [],
    },
    // vision: {
    //   enabled: false,
    // },
  },
  defaultRunInputData: {
    '#context#': [RETRIEVAL_OUTPUT_STRUCT],
    '#files#': [],
  },
  checkValid(payload: LLMNodeType, t: any) {
    let errorMessages = ''

    if (!errorMessages) {
      const isChatModel = payload.model.mode === 'chat'
      const isPromptEmpty = isChatModel
        ? !(payload.prompt_template as PromptItem[]).some((t) => {
          if (t.edition_type === EditionType.jinja2)
            return t.jinja2_text !== ''

          return t.text !== ''
        })
        : ((payload.prompt_template as PromptItem).edition_type === EditionType.jinja2 ? (payload.prompt_template as PromptItem).jinja2_text === '' : (payload.prompt_template as PromptItem).text === '')
      if (isPromptEmpty)
        errorMessages = t(`${i18nPrefix}.fieldRequired`, { field: t('workflow.nodes.llm.prompt') })
    }

    return {
      isValid: !errorMessages,
      errorMessage: errorMessages,
    }
  },
}

export default nodeDefault
