import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  TabsEnum,
  ToolTypeEnum,
} from './types'

export const useTabs = (noBlocks?: boolean, noSources?: boolean, noTools?: boolean) => {
  const { t } = useI18n()
  const tabs = computed(() => {
    return [
      ...(
        noBlocks
          ? []
          : [
            {
              key: TabsEnum.Blocks,
              name: t('workflow.tabs.blocks'),
            },
          ]
      ),
      ...(
        noSources
          ? []
          : [
            {
              key: TabsEnum.Sources,
              name: t('workflow.tabs.sources'),
            },
          ]
      ),
      ...(
        noTools
          ? []
          : [
            {
              key: TabsEnum.Tools,
              name: t('workflow.tabs.tools'),
            },
          ]
      ),
    ]
  })
  const initialTab = computed(() => {
    if (noBlocks)
      return noTools ? TabsEnum.Sources : TabsEnum.Tools

    if (noTools)
      return noBlocks ? TabsEnum.Sources : TabsEnum.Blocks

    return TabsEnum.Blocks
  })
  const activeTab = ref(initialTab.value)

  return {
    tabs,
    activeTab,
    setActiveTab: (tab: TabsEnum) => {
      activeTab.value = tab
    },
  }
}

export const useToolTabs = (isHideMCPTools?: boolean) => {
  const { t } = useI18n()
  const tabs = [
    {
      key: ToolTypeEnum.All,
      name: t('workflow.tabs.allTool'),
    },
    {
      key: ToolTypeEnum.BuiltIn,
      name: t('workflow.tabs.plugin'),
    },
    {
      key: ToolTypeEnum.Custom,
      name: t('workflow.tabs.customTool'),
    },
    {
      key: ToolTypeEnum.Workflow,
      name: t('workflow.tabs.workflowTool'),
    },
  ]
  if (!isHideMCPTools) {
    tabs.push({
      key: ToolTypeEnum.MCP,
      name: 'MCP',
    })
  }

  return tabs
}
