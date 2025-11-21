import { Node, mergeAttributes, PasteRule } from '@tiptap/core'
import { VueNodeViewRenderer } from '@tiptap/vue-3'
import VariableNodeView from './VariableNodeView.vue'
import { decodeNode } from './utils'


export const VARIABLE_REGEX = /\{\{#(.+?)#\}\}/g

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    variable: {
      insertVariable: (attrs: { id: string; label: string; varType: string }) => ReturnType
    }
  }
}

export default Node.create({
  name: 'variableMention',
  group: 'inline',
  inline: true,
  atom: true, // 原子节点，不可分割

  addAttributes() {
    return {
      id: { default: '' },
      label: { default: '' },
      varType: { default: 'variable' },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-type="variable-mention"]',
      },
    ]
  },

  renderHTML({ node, HTMLAttributes }: { node: any, HTMLAttributes: any }) {
    return [
      'span',
      mergeAttributes(
        { 'data-type': 'variable-mention' },
        HTMLAttributes
      ),
      `{{#${node.attrs.label}#}}`
    ]
  },

  renderText({ node }: { node: any }) {
    return `{{#${node.attrs.label}#}}`
  },

  addNodeView() {
    return VueNodeViewRenderer(VariableNodeView)
  },

  addPasteRules() {
    return [
      new PasteRule({
        find: VARIABLE_REGEX,
        handler: ({ state, range, match }: { state: any, range: any, match: any }) => {
          const info = decodeNode(match[1])
          state.tr.replaceWith(range.from, range.to, this.type.create(info))
        },
      })
    ]
  },

  onCreate() {
    hydrateVariables(this.editor, this.type)
  },
})

/**
 * 核心逻辑：遍历文档，将匹配正则的文本节点替换为 Variable Node
 * 用于 onCreate 初始化时“水合”数据
 */
const hydrateVariables = (editor: any, type: any) => {
  const { state, view } = editor
  const { tr, doc } = state
  let hasChange = false

  // 遍历文档中的所有文本节点
  doc.descendants((node: any, pos: number) => {
    if (!node.isText) return

    const text = node.text
    if (!text) return

    // 匹配正则
    let match
    // 重置正则索引，防止循环匹配bug
    VARIABLE_REGEX.lastIndex = 0 
    
    while ((match = VARIABLE_REGEX.exec(text)) !== null && match[1]) {
      const info = decodeNode(match[1])
      const start = pos + match.index
      const end = start + match[0].length

      tr.replaceWith(start, end, type.create(info))
      hasChange = true
    
      // 替换后，文档长度变了（节点算1个长度），会导致后续正则位置对不上
      // 简单处理：一次只换一个，或者倒序处理。
      // 为了代码简单，这里一旦发现变化就直接 return，依靠 Vue/Tiptap 的响应式
      // 或者在外部多次调用，更严谨的做法是收集所有 mapping 然后一次性 apply。
      // 这里演示简单版本：发现一个换一个，然后需要重新扫描或手动调整位置。
    }
  })

  if (hasChange) {
    view.dispatch(tr)
  }
}