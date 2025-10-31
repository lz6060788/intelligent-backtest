import { ref, h, type Component } from 'vue'
import StartNode from './start/index.vue';
import EndNode from './end/index.vue';
import IfElseNode from './if-else/index.vue';
import { BlockEnum, type NodeProps } from '@/types/node';
import BaseNode from './_base/node/index.vue'

const NodeComponentMap: Record<string, Component<any>> = {
  [BlockEnum.Start]: StartNode,
  [BlockEnum.End]: EndNode,
  [BlockEnum.IfElse]: IfElseNode,
}

const customNode = {
  props: {
    id: {
      type: String,
      required: true,
    },
    data: {
      type: Object,
      required: true,
    }
  },
  setup(props: NodeProps) {
    const NodeComponent = NodeComponentMap[props.data.type] as Component<any>;
    return () => h(BaseNode, props, {
      default: () => h(NodeComponent, props)
    })
  }
}

export default customNode;

