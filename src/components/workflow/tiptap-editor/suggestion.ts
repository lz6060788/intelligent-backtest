import { computePosition, flip, shift } from '@floating-ui/dom'
import { posToDOMRect, VueRenderer } from '@tiptap/vue-3'

import MentionList from './mention-list.vue'
import type { GraphNode, NodeOutPutVar } from '@/types'
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
  triggerChar?: string,
  availableNodes?: Node[]
}) {
  return {
    char: options.triggerChar || '/',
    allowedPrefixes: null,
    allowSpaces: false,
  
    render: () => {
      let component: any
      let editorInstance: any // 保存引用

      const destroy = () => {
        if (component) {
          component.destroy()
          component.element.remove() // 从 DOM 移除
          component = null
        }
      }

      // 处理失去焦点事件
      const handleBlur = (event: FocusEvent) => {
        // 关键：防止点击 Suggestion 列表项时触发编辑器的 blur 导致菜单立刻关闭
        // 检查焦点的去向 (relatedTarget) 是否在组件内部
        if (component && component.element.contains(event.relatedTarget as Node)) {
          return
        }
        destroy()
      }
  
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

          editorInstance = props.editor // 保存引用
          editorInstance.view.dom.addEventListener('blur', handleBlur)
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
            destroy()

            return true
          }
          if (props.event.key === 'Backspace') {
            destroy()
            return false
          }

          if (props.event.key === ' ') {
              destroy()
              return false // 返回 false 让编辑器继续处理空格输入
            }
          return false
        },

        onExit() {
          if (editorInstance) {
            editorInstance.view.dom.removeEventListener('blur', handleBlur)
          }
          if (component) {
            destroy()
          }
        },
      }
    },

    command: ({ editor, range, props }: { editor: any, range: any, props: any }) => {
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
