import { computePosition, flip, shift } from '@floating-ui/dom'
import { posToDOMRect, VueRenderer } from '@tiptap/vue-3'

import MentionList from './mention-list.vue'
import type { NodeOutPutVar } from '@/types'
import { genNodeAttrs } from './utils'

const updatePosition = (editor: any, element: any) => {
  const virtualElement = {
    getBoundingClientRect: () => posToDOMRect(editor.view, editor.state.selection.from, editor.state.selection.to),
  }

  computePosition(virtualElement, element, {
    placement: 'bottom-start',
    strategy: 'absolute',
    middleware: [shift(), flip()],
  }).then(({ x, y, strategy }: { x: number, y: number, strategy: string }) => {
    element.style.width = 'max-content'
    element.style.position = strategy
    element.style.left = `${x}px`
    element.style.top = `${y}px`
    element.style.zIndex = '1000'
  })
}

export default function suggestion(options: {
  vars: NodeOutPutVar[],
  triggerChar?: string
}) {
  return {
    char: options.triggerChar || '/',
    allowedPrefixes: null,
  
    render: () => {
      let component: any
  
      return {
        onStart: (props: any) => {
          component = new VueRenderer(MentionList, {
            props: {
              ...props,
              vars: options.vars,
            },
            editor: props.editor,
          })
  
          if (!props.clientRect) {
            return
          }
  
          component.element.style.position = 'absolute'
  
          document.body.appendChild(component.element)
  
          updatePosition(props.editor, component.element)
        },
  
        onUpdate(props: any) {
          component.updateProps(props)
  
          if (!props.clientRect) {
            return
          }
  
          updatePosition(props.editor, component.element)
        },
  
        onKeyDown(props: any) {
          if (props.event.key === 'Escape') {
            component.destroy()
            component.element.remove()
  
            return true
          }
          return true
        },
  
        onExit() {
          component.destroy()
          component.element.remove()
        },
      }
    },

    command: ({ editor, range, props }: { editor: any, range: any, props: any }) => {
      console.log('command', props)
      editor
        .chain()
        .focus()
        .insertContentAt(range, [
          {
            type: 'variableMention',
            attrs: genNodeAttrs(props.variables)
          },
          // { type: 'text', text: ' ' }
        ])
        .run()
    }
  }
}
