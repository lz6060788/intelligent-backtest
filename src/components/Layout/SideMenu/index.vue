<template>
  <div class="h-full w-[var(--width-sidemenu)] bg-[var(--global-background)] flex flex-col items-center">
    <router-link to="/">home</router-link>
    <router-link to="/strategy">strategy</router-link>
    <router-link to="/test">test</router-link>
  </div>
</template>

<script setup lang="ts">
interface Props {
}

const props = withDefaults(defineProps<Props>(), {
});

</script>
