import { ref, computed } from 'vue'
import {
  autoUpdate,
  flip,
  offset,
  shift,
  size,
  useFloating,
} from '@floating-ui/vue'

import type { OffsetOptions, Placement } from '@floating-ui/vue'

export type PortalToFollowElemOptions = {
  /*
   * top, bottom, left, right
   * start, end. Default is middle
   * combine: top-start, top-end
   */
  placement?: Placement
  open?: boolean
  offset?: number | OffsetOptions
  onOpenChange?: (open: boolean) => void
  triggerPopupSameWidth?: boolean
}

export function usePortalToFollowElem({
  placement = 'bottom',
  open: controlledOpen,
  offset: offsetValue = 0,
  onOpenChange: setControlledOpen,
  triggerPopupSameWidth,
}: PortalToFollowElemOptions = {}) {
  const localOpen = ref(false)
  const open = computed(() => controlledOpen ?? localOpen.value)

  const handleOpenChange = (newOpen: boolean) => {
    localOpen.value = newOpen
    setControlledOpen?.(newOpen)
  }

  const reference = ref<HTMLElement | null>(null)
  const floating = ref<HTMLElement | null>(null)

  const { floatingStyles, middlewareData } = useFloating(reference, floating, {
    placement,
    open,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(offsetValue),
      flip({
        crossAxis: placement.includes('-'),
        fallbackAxisSideDirection: 'start',
        padding: 5,
      }),
      shift({ padding: 5 }),
      size({
        apply({ rects, elements }) {
          if (triggerPopupSameWidth && elements.floating)
            elements.floating.style.width = `${rects.reference.width}px`
        },
      }),
    ],
  })

  return {
    open,
    setOpen: handleOpenChange,
    reference,
    floating,
    floatingStyles,
    middlewareData,
  }
}

