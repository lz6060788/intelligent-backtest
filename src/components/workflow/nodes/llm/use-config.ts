import { produce } from 'immer'
import { EditionType, VarType } from '@/types'
import type { Memory, PromptItem, ValueSelector, Var, Variable } from '@/types'
import {
  useNodesReadOnly,
} from '../../hooks'
import useAvailableVarList from '../_base/hooks/use-available-var-list'
import type { LLMNodeType, StructuredOutput } from './types'
// import {
//   ModelFeatureEnum,
//   ModelTypeEnum,
// } from '@/app/components/header/account-setting/model-provider-page/declarations'
import useNodeCrud from '@/components/workflow/nodes/_base/hooks/use-node-crud'
import { checkHasContextBlock, checkHasHistoryBlock, checkHasQueryBlock } from '@/components/base/prompt-editor/constants'
// import useInspectVarsCrud from '@/app/components/workflow/hooks/use-inspect-vars-crud'
import { computed, ref, type Ref } from 'vue'

const useConfig = (id: string, payload: Ref<LLMNodeType>) => {
  const { nodesReadOnly: readOnly } = useNodesReadOnly()
  const isChatMode = computed(() => false)

  const { setInputs } = useNodeCrud<LLMNodeType>(id)

  // model
  const model = payload.value.model
  const modelMode = payload.value.model?.mode
  const isChatModel = modelMode === 'chat'

  const defaultRolePrefix = ref({ user: '', assistant: '' })

  const isCompletionModel = !isChatModel

  const hasSetBlockStatus = computed(() => {
    const promptTemplate = payload.value.prompt_template
    const hasSetContext = isChatModel ? (promptTemplate as PromptItem[]).some(item => checkHasContextBlock(item.text)) : checkHasContextBlock((promptTemplate as PromptItem).text)
    if (!isChatMode) {
      return {
        history: false,
        query: false,
        context: hasSetContext,
      }
    }
    if (isChatModel) {
      return {
        history: false,
        query: (promptTemplate as PromptItem[]).some(item => checkHasQueryBlock(item.text)),
        context: hasSetContext,
      }
    }
    else {
      return {
        history: checkHasHistoryBlock((promptTemplate as PromptItem).text),
        query: checkHasQueryBlock((promptTemplate as PromptItem).text),
        context: hasSetContext,
      }
    }
  })

  const shouldShowContextTip = computed(() => !hasSetBlockStatus.value.context && payload.value.context.enabled)

  const appendDefaultPromptConfig = (draft: LLMNodeType, defaultConfig: any, passInIsChatMode?: boolean) => {
    const promptTemplates = defaultConfig.prompt_templates
    if (passInIsChatMode === undefined ? isChatModel : passInIsChatMode) {
      draft.prompt_template = promptTemplates.chat_model.prompts
    }
    else {
      draft.prompt_template = promptTemplates.completion_model.prompt

      defaultRolePrefix.value = {
        user: promptTemplates.completion_model.conversation_histories_role.user_prefix,
        assistant: promptTemplates.completion_model.conversation_histories_role.assistant_prefix,
      }
    }
  }

  // const handleAddEmptyVariable = () => {
  //   const newInputs = produce(payload.value, (draft) => {
  //     if (!draft.prompt_config) {
  //       draft.prompt_config = {
  //         jinja2_variables: [],
  //       }
  //     }
  //     if (!draft.prompt_config.jinja2_variables)
  //       draft.prompt_config.jinja2_variables = []

  //     draft.prompt_config.jinja2_variables.push({
  //       variable: '',
  //       value_selector: [],
  //     })
  //   })
  //   setInputs(newInputs)
  // }

  // const handleAddVariable = (variable: Variable) => {
  //   const newInputs = produce(payload.value, (draft) => {
  //     if (!draft.prompt_config) {
  //       draft.prompt_config = {
  //         jinja2_variables: [],
  //       }
  //     }
  //     if (!draft.prompt_config.jinja2_variables)
  //       draft.prompt_config.jinja2_variables = []

  //     draft.prompt_config.jinja2_variables.push(variable)
  //   })
  //   setInputs(newInputs)
  // }

  // const handleVarListChange = (newList: Variable[]) => {
  //   const newInputs = produce(payload.value, (draft) => {
  //     if (!draft.prompt_config) {
  //       draft.prompt_config = {
  //         jinja2_variables: [],
  //       }
  //     }
  //     if (!draft.prompt_config.jinja2_variables)
  //       draft.prompt_config.jinja2_variables = []

  //     draft.prompt_config.jinja2_variables = newList
  //   })
  //   setInputs(newInputs)
  // }

  // const handleVarNameChange = (oldName: string, newName: string) => {
  //   const newInputs = produce(payload.value, (draft) => {
  //     if (isChatModel) {
  //       const promptTemplate = draft.prompt_template as PromptItem[]
  //       promptTemplate.filter(item => item.edition_type === EditionType.jinja2).forEach((item) => {
  //         item.jinja2_text = (item.jinja2_text || '').replaceAll(`{{ ${oldName} }}`, `{{ ${newName} }}`)
  //       })
  //     }
  //     else {
  //       if ((draft.prompt_template as PromptItem).edition_type !== EditionType.jinja2)
  //         return

  //       const promptTemplate = draft.prompt_template as PromptItem
  //       promptTemplate.jinja2_text = (promptTemplate.jinja2_text || '').replaceAll(`{{ ${oldName} }}`, `{{ ${newName} }}`)
  //     }
  //   })
  //   setInputs(newInputs)
  // }

  // context
  const handleContextVarChange = (newVar: ValueSelector | string) => {
    const newInputs = produce(payload.value, (draft) => {
      draft.context.variable_selector = newVar as ValueSelector || []
      draft.context.enabled = !!(newVar && newVar.length > 0)
    })
    setInputs(newInputs)
  }

  const handlePromptChange = (newPrompt: PromptItem[] | PromptItem) => {
    console.log('handlePromptChange', newPrompt)
    const newInputs = produce(payload.value, (draft) => {
      draft.prompt_template = newPrompt
    })
    setInputs(newInputs)
  }


  const outputVarsCollapsed = ref(false)

  const filterInputVar = (varPayload: Var) => {
    return [VarType.number, VarType.string, VarType.secret, VarType.arrayString, VarType.arrayNumber, VarType.file, VarType.arrayFile].includes(varPayload.type)
  }

  const filterJinja2InputVar = (varPayload: Var) => {
    return [VarType.number, VarType.string, VarType.secret, VarType.arrayString, VarType.arrayNumber, VarType.arrayBoolean, VarType.arrayObject, VarType.object, VarType.array, VarType.boolean].includes(varPayload.type)
  }

  const filterMemoryPromptVar = (varPayload: Var) => {
    return [VarType.arrayObject, VarType.array, VarType.number, VarType.string, VarType.secret, VarType.arrayString, VarType.arrayNumber, VarType.file, VarType.arrayFile].includes(varPayload.type)
  }

  const {
    availableVars,
    availableNodesWithParent,
  } = useAvailableVarList(id, {
    onlyLeafNodeVar: false,
    filterVar: filterMemoryPromptVar,
  })

  return {
    readOnly,
    isChatMode,
    isChatModel,
    isCompletionModel,
    hasSetBlockStatus,
    shouldShowContextTip,
    handleContextVarChange,
    filterInputVar,
    filterVar: filterMemoryPromptVar,
    availableVars,
    availableNodesWithParent,
    handlePromptChange,
    filterJinja2InputVar,
    outputVarsCollapsed
  }
}

export default useConfig
