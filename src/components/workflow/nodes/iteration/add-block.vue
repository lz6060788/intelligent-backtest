<template>
  <div class="absolute left-14 top-8 z-10 flex h-8 items-center" @click.stop="">
    <div class="group/insert relative h-0.5 w-16 bg-gray-300">
      <div
        class="absolute right-0 top-1/2 h-2 w-0.5 -translate-y-1/2 bg-primary-500"
      ></div>
    </div>
    <BlockSelector
      :disabled="nodesReadOnly"
      @select="handleSelect"
      :available-blocks-types="availableNextBlocks"
      :popup-class-name="'!min-w-[256px]'"
      :trigger-inner-class-name="'inline-flex'"
    >
      <template #trigger="data">
        <div
          :class="
            cn(
              'system-sm-medium relative inline-flex h-8 cursor-pointer items-center rounded-lg border-[0.5px] border-gray-7 border-solid bg-gray-8 px-3 text-components-button-secondary-text shadow-xs backdrop-blur-[5px] hover:bg-gray-7',
              nodesReadOnly &&
                '!cursor-not-allowed bg-components-button-secondary-bg-disabled',
              data?.open && 'bg-gray-7'
            )
          "
        >
          <RiAddLine class="mr-1 h-4 w-4" />
          {{ t("workflow.common.addBlock") }}
        </div>
      </template>
    </BlockSelector>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { RiAddLine } from "@remixicon/vue";
import {
  useAvailableBlocks,
  useNodesInteractions,
  useNodesReadOnly,
} from "../../hooks";
import type { IterationNodeType } from "./types";
import cn from "@/utils/classnames";
import BlockSelector from "@/components/workflow/block-selector/index.vue";
import type { OnSelectBlock } from "@/components/workflow/block-selector/types";
import { BlockEnum } from "@/types/node";

/**
 * 添加块组件的属性定义
 */
interface AddBlockProps {
  /** 迭代节点ID */
  iterationNodeId: string;
  /** 迭代节点数据 */
  iterationNodeData: IterationNodeType;
}

const props = defineProps<AddBlockProps>();

const { t } = useI18n();
const { nodesReadOnly } = useNodesReadOnly();
const { handleNodeAdd } = useNodesInteractions();
const { availableNextBlocks } = useAvailableBlocks(BlockEnum.Start, true);

const handleSelect: OnSelectBlock = (type, toolDefaultValue) => {
  handleNodeAdd(
    {
      nodeType: type,
      // toolDefaultValue,
    },
    {
      prevNodeId: props.iterationNodeData.start_node_id,
      prevNodeSourceHandle: "source",
    }
  );
};
</script>
