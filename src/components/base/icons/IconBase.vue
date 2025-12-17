<!-- IconBase.vue -->
<template>
  <component
    :is="generatedNode"
    :class="computedClass"
    v-bind="mergedProps"
    @click="handleClick"
  />
</template>

<script setup lang="ts">
import { generate } from "./utils";
import type { AbstractNode } from "./utils";
import { computed, mergeProps } from "vue";

export type IconData = {
  name: string;
  icon: AbstractNode;
};

interface IconBaseProps {
  data: IconData;
  className?: string;
  onClick?: (e: MouseEvent) => void;
  style?: any
}

const props = defineProps<IconBaseProps>();
const emit = defineEmits(["click"]);

const generatedNode = generate(props.data.icon, `svg-${props.data.name}`, {});

const computedClass = computed(() => [
  `svg-${props.data.name}`,
  props.className,
]);

const mergedProps = mergeProps(
  {
    "data-icon": props.data.name,
    "aria-hidden": "true",
    style: props.style,
  },
  props
);

const handleClick = (e: MouseEvent) => {
  if (props.onClick) {
    props.onClick(e);
  }
  emit("click", e);
};
</script>
