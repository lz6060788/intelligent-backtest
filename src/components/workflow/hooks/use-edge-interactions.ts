import type { EdgeMouseEvent, EdgeChange } from "@vue-flow/core"
import { useVueFlow } from "@vue-flow/core"


export const useEdgeInteractions = () => {
  const store = useVueFlow();

  const handleEdgeMouseEnter = (e: EdgeMouseEvent) => {
    const { edges } = store
    
    const currentEdge = edges.value.find(edge => edge.id === e.edge.id)!

    currentEdge.data._hovering = true
  }

  const handleEdgeMouseLeave = (e: EdgeMouseEvent) => {
    const { edges } = store
    
    const currentEdge = edges.value.find(edge => edge.id === e.edge.id)!

    currentEdge.data._hovering = false
  }

  const handleEdgeChange = (changes: EdgeChange[]) => {
    const { edges } = store
    
    changes.forEach((change) => {
      if (change.type === 'select')
        edges.value.find(edge => edge.id === change.id)!.selected = change.selected
    })
  }

  return {
    handleEdgeMouseEnter,
    handleEdgeMouseLeave,
    handleEdgeChange
  }
}
