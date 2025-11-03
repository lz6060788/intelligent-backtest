import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
// import StartDefault from '@/app/components/workflow/nodes/start/default'
// import EndDefault from '@/app/components/workflow/nodes/end/default'
// import AnswerDefault from '@/app/components/workflow/nodes/answer/default'
import { WORKFLOW_COMMON_NODES } from "../constant"
import type { AvailableNodesMetaData } from './use-nodes-meta-data'

export const useAvailableNodesMetaData = () => {
  const { t } = useI18n()
//   const isChatMode = useIsChatMode()
//   const language = useGetLanguage()

  const mergedNodesMetaData = computed(() => ([
    ...WORKFLOW_COMMON_NODES
]))

  const prefixLink = computed(() => {
    return ''
  })

  const availableNodesMetaData = computed(() => mergedNodesMetaData.value.map((node) => {
    const { metaData } = node
    const title = t(`workflow.blocks.${metaData.type}`)
    const description = t(`workflow.blocksAbout.${metaData.type}`)
    return {
      ...node,
      metaData: {
        ...metaData,
        title,
        description,
        helpLinkUri: `${prefixLink}${metaData.helpLinkUri}`,
      },
      defaultValue: {
        ...node.defaultValue,
        type: metaData.type,
        title,
      },
    }
  }))

  const availableNodesMetaDataMap = computed(() => availableNodesMetaData.value.reduce((acc, node) => {
    acc![node.metaData.type] = node
    return acc
  }, {} as AvailableNodesMetaData['nodesMap']))


  return {
    nodes: availableNodesMetaData,
    nodesMap: availableNodesMetaDataMap,
  }
}
