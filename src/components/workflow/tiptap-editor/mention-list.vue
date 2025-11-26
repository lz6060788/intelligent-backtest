<template>
  <VarReferenceVars :vars="vars" @change="handleSelectWorkflowVariable" class="popper-custom p-1" />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import VarReferenceVars from '../nodes/_base/variable/var-reference-vars/index.vue'
import type { NodeOutPutVar } from '@/types';
import { variableTransformer } from '../utils/variable'
import { isConversationVar, isENV, isRagVariableVar, isSystemVar } from '../nodes/_base/variable/utils'
import type { ValueSelector } from '@/types'

type Props = {
  vars: NodeOutPutVar[],
  command: (id: any) => void
}

const props = withDefaults(defineProps<Props>(), {
  vars: () => [],
})

console.log('mention-list', props.vars)

// const selectedIndex = ref(0)

// watch(
//   () => props.vars,
//   () => {
//     selectedIndex.value = 0
//   }
// )

const handleSelectWorkflowVariable = (variables: string[]) => {
    // const isFlat = variables.length === 1
    // if (isFlat) {
    //   const varName = variables[0]
    //   if (varName === 'current')
    //     editor.dispatchCommand(INSERT_CURRENT_BLOCK_COMMAND, currentBlock?.generatorType)
    //   else if (varName === 'error_message')
    //     editor.dispatchCommand(INSERT_ERROR_MESSAGE_BLOCK_COMMAND, null)
    //   else if (varName === 'last_run')
    //     editor.dispatchCommand(INSERT_LAST_RUN_BLOCK_COMMAND, null)
    // }
    // else if (variables[1] === 'sys.query' || variables[1] === 'sys.files') {
    //   editor.dispatchCommand(INSERT_WORKFLOW_VARIABLE_BLOCK_COMMAND, [variables[1]])
    // }
    // else {
    //   editor.dispatchCommand(INSERT_WORKFLOW_VARIABLE_BLOCK_COMMAND, variables)
    // }

  if (variables) {
    // // const variables = variableTransformer(variables) as ValueSelector
    // const isEnv = isENV(variables)
    // const isChatVar = isConversationVar(variables)
    // const isSysVar = isSystemVar(variables)
    // const varType = isEnv ? 'env' : isChatVar ? 'conversation' : isSysVar ? 'system' : 'variable'
    props.command({ variables })
  }
}
const onKeyDown = ({ event }: { event: KeyboardEvent }) => {
  if (event.key === 'ArrowUp') {
    return true
  }

  if (event.key === 'ArrowDown') {
    return true
  }

  if (event.key === 'Enter') {
    return true
  }

  return false
}

</script>

<style lang="scss">

</style>