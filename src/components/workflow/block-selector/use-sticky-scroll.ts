import { ref, type Ref } from 'vue'

export enum ScrollPosition {
  belowTheWrap = 'belowTheWrap',
  showing = 'showing',
  aboveTheWrap = 'aboveTheWrap',
}

type Params = {
  wrapElemRef: Ref<HTMLElement | null>
  nextToStickyELemRef: Ref<HTMLElement | null>
}

const throttle = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null
  let previous = 0

  return function (this: any, ...args: Parameters<T>) {
    const now = Date.now()
    const remaining = wait - (now - previous)

    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      previous = now
      func.apply(this, args)
    } else if (!timeout) {
      timeout = setTimeout(() => {
        previous = Date.now()
        timeout = null
        func.apply(this, args)
      }, remaining)
    }
  }
}

export const useStickyScroll = ({
  wrapElemRef,
  nextToStickyELemRef,
}: Params) => {
  const scrollPosition = ref<ScrollPosition>(ScrollPosition.belowTheWrap)

  const handleScroll = throttle(() => {
    const wrapDom = wrapElemRef.value
    const stickyDOM = nextToStickyELemRef.value
    if (!wrapDom || !stickyDOM)
      return
    const { height: wrapHeight, top: wrapTop } = wrapDom.getBoundingClientRect()
    const { top: nextToStickyTop } = stickyDOM.getBoundingClientRect()
    let scrollPositionNew: ScrollPosition

    if (nextToStickyTop - wrapTop >= wrapHeight)
      scrollPositionNew = ScrollPosition.belowTheWrap
    else if (nextToStickyTop <= wrapTop)
      scrollPositionNew = ScrollPosition.aboveTheWrap
    else
      scrollPositionNew = ScrollPosition.showing

    if (scrollPosition.value !== scrollPositionNew)
      scrollPosition.value = scrollPositionNew
  }, 100)

  return {
    handleScroll,
    scrollPosition,
  }
}

export default useStickyScroll
