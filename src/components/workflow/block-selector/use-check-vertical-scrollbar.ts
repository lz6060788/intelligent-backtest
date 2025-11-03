import { ref, onMounted, onUnmounted, type Ref } from 'vue'

export const useCheckVerticalScrollbar = (refElement: Ref<HTMLElement | null>) => {
  const hasVerticalScrollbar = ref(false)

  const checkScrollbar = () => {
    const elem = refElement.value
    if (!elem) return
    hasVerticalScrollbar.value = elem.scrollHeight > elem.clientHeight
  }

  onMounted(() => {
    checkScrollbar()

    const elem = refElement.value
    if (!elem) return

    const resizeObserver = new ResizeObserver(checkScrollbar)
    resizeObserver.observe(elem)

    const mutationObserver = new MutationObserver(checkScrollbar)
    mutationObserver.observe(elem, { childList: true, subtree: true, characterData: true })

    onUnmounted(() => {
      resizeObserver.disconnect()
      mutationObserver.disconnect()
    })
  })

  return hasVerticalScrollbar
}

export default useCheckVerticalScrollbar
