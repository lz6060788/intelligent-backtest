import type { ValueSelector } from "@/types"

export const getNodeUsedVars = (node: Node): ValueSelector[] => {
  const { data } = node
  const { type } = data
  let res: ValueSelector[] = []
  switch (type) {
    case BlockEnum.End: {
      res = (data as EndNodeType).outputs?.map((output) => {
        return output.value_selector
      })
      break
    }
    case BlockEnum.Answer: {
      res = matchNotSystemVars([(data as AnswerNodeType).answer])
      break
    }
    case BlockEnum.LLM: {
      const payload = data as LLMNodeType
      const isChatModel = payload.model?.mode === 'chat'
      let prompts: string[] = []
      if (isChatModel) {
        prompts
          = (payload.prompt_template as PromptItem[])?.map(p => p.text) || []
        if (payload.memory?.query_prompt_template)
          prompts.push(payload.memory.query_prompt_template)
      }
      else {
        prompts = [(payload.prompt_template as PromptItem).text]
      }

      const inputVars: ValueSelector[] = matchNotSystemVars(prompts)
      const contextVar = (data as LLMNodeType).context?.variable_selector
        ? [(data as LLMNodeType).context?.variable_selector]
        : []
      res = [...inputVars, ...contextVar]
      break
    }
    case BlockEnum.KnowledgeRetrieval: {
      res = [(data as KnowledgeRetrievalNodeType).query_variable_selector]
      break
    }
    case BlockEnum.IfElse: {
      res
        = (data as IfElseNodeType).conditions?.map((c) => {
          return c.variable_selector || []
        }) || []
      res.push(
        ...((data as IfElseNodeType).cases || [])
          .flatMap(c => c.conditions || [])
          .flatMap((c) => {
            const selectors: ValueSelector[] = []
            if (c.variable_selector) selectors.push(c.variable_selector)
            // Handle sub-variable conditions
            if (c.sub_variable_condition && c.sub_variable_condition.conditions) {
              selectors.push(
                ...c.sub_variable_condition.conditions
                  .map(subC => subC.variable_selector || [])
                  .filter(sel => sel.length > 0),
              )
            }
            return selectors
          }),
      )
      break
    }
    case BlockEnum.Code: {
      res = (data as CodeNodeType).variables?.map((v) => {
        return v.value_selector
      })
      break
    }
    case BlockEnum.TemplateTransform: {
      res = (data as TemplateTransformNodeType).variables?.map((v: any) => {
        return v.value_selector
      })
      break
    }
    case BlockEnum.QuestionClassifier: {
      const payload = data as QuestionClassifierNodeType
      res = [payload.query_variable_selector]
      const varInInstructions = matchNotSystemVars([payload.instruction || ''])
      res.push(...varInInstructions)

      const classes = payload.classes.map(c => c.name)
      res.push(...matchNotSystemVars(classes))
      break
    }
    case BlockEnum.HttpRequest: {
      const payload = data as HttpNodeType
      res = matchNotSystemVars([
        payload.url,
        payload.headers,
        payload.params,
        typeof payload.body.data === 'string'
          ? payload.body.data
          : payload.body.data.map(d => d.value).join(''),
      ])
      break
    }
    case BlockEnum.Tool: {
      const payload = data as ToolNodeType
      const mixVars = matchNotSystemVars(
        Object.keys(payload.tool_parameters)
          ?.filter(
            key => payload.tool_parameters[key].type === ToolVarType.mixed,
          )
          .map(key => payload.tool_parameters[key].value) as string[],
      )
      const vars
        = Object.keys(payload.tool_parameters)
          .filter(
            key => payload.tool_parameters[key].type === ToolVarType.variable,
          )
          .map(key => payload.tool_parameters[key].value as string) || []
      res = [...(mixVars as ValueSelector[]), ...(vars as any)]
      break
    }
    case BlockEnum.DataSource: {
      const payload = data as DataSourceNodeType
      const mixVars = matchNotSystemVars(
        Object.keys(payload.datasource_parameters)
          ?.filter(
            key =>
              payload.datasource_parameters[key].type === ToolVarType.mixed,
          )
          .map(key => payload.datasource_parameters[key].value) as string[],
      )
      const vars
        = Object.keys(payload.datasource_parameters)
          .filter(
            key =>
              payload.datasource_parameters[key].type === ToolVarType.variable,
          )
          .map(key => payload.datasource_parameters[key].value as string)
        || []
      res = [...(mixVars as ValueSelector[]), ...(vars as any)]
      break
    }

    case BlockEnum.VariableAssigner: {
      res = (data as VariableAssignerNodeType)?.variables
      break
    }

    case BlockEnum.VariableAggregator: {
      res = (data as VariableAssignerNodeType)?.variables
      break
    }

    case BlockEnum.ParameterExtractor: {
      const payload = data as ParameterExtractorNodeType
      res = [payload.query]
      const varInInstructions = matchNotSystemVars([payload.instruction || ''])
      res.push(...varInInstructions)
      break
    }

    case BlockEnum.Iteration: {
      res = [(data as IterationNodeType).iterator_selector]
      break
    }

    case BlockEnum.Loop: {
      const payload = data as LoopNodeType
      res
        = payload.break_conditions?.map((c) => {
          return c.variable_selector || []
        }) || []
      break
    }

    case BlockEnum.ListFilter: {
      res = [(data as ListFilterNodeType).variable]
      break
    }

    case BlockEnum.Agent: {
      const payload = data as AgentNodeType
      const valueSelectors: ValueSelector[] = []
      if (!payload.agent_parameters) break

      Object.keys(payload.agent_parameters || {}).forEach((key) => {
        const { value } = payload.agent_parameters![key]
        if (typeof value === 'string')
          valueSelectors.push(...matchNotSystemVars([value]))
      })
      res = valueSelectors
      break
    }
  }
  return res || []
}


export const findUsedVarNodes = (
  varSelector: ValueSelector,
  availableNodes: Node[],
): Node[] => {
  const res: Node[] = []
  availableNodes.forEach((node) => {
    const vars = getNodeUsedVars(node)
    if (vars.find(v => v.join('.') === varSelector.join('.'))) res.push(node)
  })
  return res
}

export const updateNodeVars = (
  oldNode: Node,
  oldVarSelector: ValueSelector,
  newVarSelector: ValueSelector,
): Node => {
  const newNode = produce(oldNode, (draft: any) => {
    const { data } = draft
    const { type } = data

    switch (type) {
      case BlockEnum.End: {
        const payload = data as EndNodeType
        if (payload.outputs) {
          payload.outputs = payload.outputs.map((output) => {
            if (output.value_selector.join('.') === oldVarSelector.join('.'))
              output.value_selector = newVarSelector
            return output
          })
        }
        break
      }
      case BlockEnum.Answer: {
        const payload = data as AnswerNodeType
        if (payload.variables) {
          payload.variables = payload.variables.map((v) => {
            if (v.value_selector.join('.') === oldVarSelector.join('.'))
              v.value_selector = newVarSelector
            return v
          })
        }
        break
      }
      case BlockEnum.LLM: {
        const payload = data as LLMNodeType
        const isChatModel = payload.model?.mode === 'chat'
        if (isChatModel) {
          payload.prompt_template = (
            payload.prompt_template as PromptItem[]
          ).map((prompt) => {
            return {
              ...prompt,
              text: replaceOldVarInText(
                prompt.text,
                oldVarSelector,
                newVarSelector,
              ),
            }
          })
          if (payload.memory?.query_prompt_template) {
            payload.memory.query_prompt_template = replaceOldVarInText(
              payload.memory.query_prompt_template,
              oldVarSelector,
              newVarSelector,
            )
          }
        }
        else {
          payload.prompt_template = {
            ...payload.prompt_template,
            text: replaceOldVarInText(
              (payload.prompt_template as PromptItem).text,
              oldVarSelector,
              newVarSelector,
            ),
          }
        }
        if (
          payload.context?.variable_selector?.join('.')
          === oldVarSelector.join('.')
        )
          payload.context.variable_selector = newVarSelector

        break
      }
      case BlockEnum.KnowledgeRetrieval: {
        const payload = data as KnowledgeRetrievalNodeType
        if (
          payload.query_variable_selector.join('.') === oldVarSelector.join('.')
        )
          payload.query_variable_selector = newVarSelector
        break
      }
      case BlockEnum.IfElse: {
        const payload = data as IfElseNodeType
        if (payload.conditions) {
          payload.conditions = payload.conditions.map((c) => {
            if (c.variable_selector?.join('.') === oldVarSelector.join('.'))
              c.variable_selector = newVarSelector
            return c
          })
        }
        if (payload.cases) {
          payload.cases = payload.cases.map((caseItem) => {
            if (caseItem.conditions) {
              caseItem.conditions = caseItem.conditions.map((c) => {
                if (c.variable_selector?.join('.') === oldVarSelector.join('.'))
                  c.variable_selector = newVarSelector
                // Handle sub-variable conditions
                if (
                  c.sub_variable_condition
                  && c.sub_variable_condition.conditions
                ) {
                  c.sub_variable_condition.conditions
                    = c.sub_variable_condition.conditions.map((subC) => {
                      if (
                        subC.variable_selector?.join('.')
                        === oldVarSelector.join('.')
                      )
                        subC.variable_selector = newVarSelector
                      return subC
                    })
                }
                return c
              })
            }
            return caseItem
          })
        }
        break
      }
      case BlockEnum.Code: {
        const payload = data as CodeNodeType
        if (payload.variables) {
          payload.variables = payload.variables.map((v) => {
            if (v.value_selector.join('.') === oldVarSelector.join('.'))
              v.value_selector = newVarSelector
            return v
          })
        }
        break
      }
      case BlockEnum.TemplateTransform: {
        const payload = data as TemplateTransformNodeType
        if (payload.variables) {
          payload.variables = payload.variables.map((v: any) => {
            if (v.value_selector.join('.') === oldVarSelector.join('.'))
              v.value_selector = newVarSelector
            return v
          })
        }
        break
      }
      case BlockEnum.QuestionClassifier: {
        const payload = data as QuestionClassifierNodeType
        if (
          payload.query_variable_selector.join('.') === oldVarSelector.join('.')
        )
          payload.query_variable_selector = newVarSelector
        payload.instruction = replaceOldVarInText(
          payload.instruction,
          oldVarSelector,
          newVarSelector,
        )
        break
      }
      case BlockEnum.HttpRequest: {
        const payload = data as HttpNodeType
        payload.url = replaceOldVarInText(
          payload.url,
          oldVarSelector,
          newVarSelector,
        )
        payload.headers = replaceOldVarInText(
          payload.headers,
          oldVarSelector,
          newVarSelector,
        )
        payload.params = replaceOldVarInText(
          payload.params,
          oldVarSelector,
          newVarSelector,
        )
        if (typeof payload.body.data === 'string') {
          payload.body.data = replaceOldVarInText(
            payload.body.data,
            oldVarSelector,
            newVarSelector,
          )
        }
        else {
          payload.body.data = payload.body.data.map((d) => {
            return {
              ...d,
              value: replaceOldVarInText(
                d.value || '',
                oldVarSelector,
                newVarSelector,
              ),
            }
          })
        }
        break
      }
      case BlockEnum.Tool: {
        const payload = data as ToolNodeType
        const hasShouldRenameVar = Object.keys(payload.tool_parameters)?.filter(
          key => payload.tool_parameters[key].type !== ToolVarType.constant,
        )
        if (hasShouldRenameVar) {
          Object.keys(payload.tool_parameters).forEach((key) => {
            const value = payload.tool_parameters[key]
            const { type } = value
            if (
              type === ToolVarType.variable
              && value.value.join('.') === oldVarSelector.join('.')
            ) {
              payload.tool_parameters[key] = {
                ...value,
                value: newVarSelector,
              }
            }

            if (type === ToolVarType.mixed) {
              payload.tool_parameters[key] = {
                ...value,
                value: replaceOldVarInText(
                  payload.tool_parameters[key].value as string,
                  oldVarSelector,
                  newVarSelector,
                ),
              }
            }
          })
        }
        break
      }
      case BlockEnum.DataSource: {
        const payload = data as DataSourceNodeType
        const hasShouldRenameVar = Object.keys(
          payload.datasource_parameters,
        )?.filter(
          key =>
            payload.datasource_parameters[key].type !== ToolVarType.constant,
        )
        if (hasShouldRenameVar) {
          Object.keys(payload.datasource_parameters).forEach((key) => {
            const value = payload.datasource_parameters[key]
            const { type } = value
            if (
              type === ToolVarType.variable
              && value.value.join('.') === oldVarSelector.join('.')
            ) {
              payload.datasource_parameters[key] = {
                ...value,
                value: newVarSelector,
              }
            }

            if (type === ToolVarType.mixed) {
              payload.datasource_parameters[key] = {
                ...value,
                value: replaceOldVarInText(
                  payload.datasource_parameters[key].value as string,
                  oldVarSelector,
                  newVarSelector,
                ),
              }
            }
          })
        }
        break
      }
      case BlockEnum.VariableAssigner: {
        const payload = data as VariableAssignerNodeType
        if (payload.variables) {
          payload.variables = payload.variables.map((v) => {
            if (v.join('.') === oldVarSelector.join('.')) v = newVarSelector
            return v
          })
        }
        break
      }
      // eslint-disable-next-line sonarjs/no-duplicated-branches
      case BlockEnum.VariableAggregator: {
        const payload = data as VariableAssignerNodeType
        if (payload.variables) {
          payload.variables = payload.variables.map((v) => {
            if (v.join('.') === oldVarSelector.join('.')) v = newVarSelector
            return v
          })
        }
        break
      }
      case BlockEnum.ParameterExtractor: {
        const payload = data as ParameterExtractorNodeType
        if (payload.query.join('.') === oldVarSelector.join('.'))
          payload.query = newVarSelector
        payload.instruction = replaceOldVarInText(
          payload.instruction,
          oldVarSelector,
          newVarSelector,
        )
        break
      }
      case BlockEnum.Iteration: {
        const payload = data as IterationNodeType
        if (payload.iterator_selector.join('.') === oldVarSelector.join('.'))
          payload.iterator_selector = newVarSelector

        break
      }
      case BlockEnum.Loop: {
        const payload = data as LoopNodeType
        if (payload.break_conditions) {
          payload.break_conditions = payload.break_conditions.map((c) => {
            if (c.variable_selector?.join('.') === oldVarSelector.join('.'))
              c.variable_selector = newVarSelector
            return c
          })
        }
        break
      }
      case BlockEnum.ListFilter: {
        const payload = data as ListFilterNodeType
        if (payload.variable.join('.') === oldVarSelector.join('.'))
          payload.variable = newVarSelector
        break
      }
    }
  })
  return newNode
}
