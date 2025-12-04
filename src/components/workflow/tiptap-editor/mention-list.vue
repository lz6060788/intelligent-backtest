<template>
  <VarReferenceVars :vars="vars" @change="handleSelectWorkflowVariable" class="popper-default p-1" />
</template>

<script setup lang="ts">
import VarReferenceVars from '../nodes/_base/variable/var-reference-vars/index.vue'
import type { NodeOutPutVar } from '@/types';

type Props = {
  vars: NodeOutPutVar[],
  command: (id: any) => void
}

const props = withDefaults(defineProps<Props>(), {
  vars: () => [],
})




const handleSelectWorkflowVariable = (variables: string[]) => {

  if (variables) {
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