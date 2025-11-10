import { ref, computed } from 'vue'

/**
 * 获取节点只读状态的 composable
 * @returns 返回节点只读状态
 */
export const useNodesReadOnly = () => {
  // TODO: 根据实际业务逻辑实现真正的只读状态检查
  const nodesReadOnly = ref(false)

  return {
    nodesReadOnly: computed(() => nodesReadOnly.value),
  }
}

