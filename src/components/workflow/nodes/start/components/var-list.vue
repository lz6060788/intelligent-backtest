<template>
  <div v-if="list.length === 0" class="flex h-[42px] items-center justify-center rounded-md bg-components-panel-bg text-xs font-normal leading-[18px] text-text-tertiary">
    {{ t('workflow.nodes.start.noVarTip') }}
  </div>
  <div v-else class="space-y-1">
    <div
      v-for="(item, index) in list"
      :key="item.variable"
      class="group relative"
    >
      <VarItem
        :className="cn(canDrag && 'handle')"
        :readonly="readonly"
        :payload="item"
        :var-keys="list.map(v => v.variable)"
        :can-drag="canDrag"
        :on-change="handleVarChange(index)"
        @remove="handleVarRemove(index)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import VarItem from './var-item.vue'
import { ChangeType, type InputVar, type MoreInfo } from '@/types'
import cn from '@/utils/classnames'
import { hasDuplicateStr } from '@/utils/var'
import { ElNotification } from 'element-plus'

/**
 * 变量列表组件的属性定义
 */
interface VarListProps {
  /** 是否只读 */
  readonly: boolean
  /** 变量列表 */
  list: InputVar[]
  /** 变化回调 */
  onChange: (list: InputVar[], moreInfo?: { index: number; payload: MoreInfo }) => void
}

const props = defineProps<VarListProps>()

const { t } = useI18n()

const varCount = computed(() => props.list.length)

const canDrag = computed(() => !props.readonly && varCount.value > 1)

const handleVarChange = (index: number) => {
  return (payload: InputVar, moreInfo?: MoreInfo) => {
    const newList = [...props.list]
    newList[index] = payload
    let errorMsgKey = ''
    let typeName = ''
    if (hasDuplicateStr(newList.map(item => item.variable))) {
      errorMsgKey = 'appDebug.varKeyError.keyAlreadyExists'
      typeName = 'appDebug.variableConfig.varName'
    }
    else if (hasDuplicateStr(newList.map(item => item.label as string))) {
      errorMsgKey = 'appDebug.varKeyError.keyAlreadyExists'
      typeName = 'appDebug.variableConfig.labelName'
    }

    if (errorMsgKey) {
      ElNotification.error({
        title: t(typeName),
        message: t(errorMsgKey, { key: t(typeName) }),
      })
      return false
    }
    props.onChange(newList, moreInfo ? { index, payload: moreInfo } : undefined)
    return true
  }
}

const emit = defineEmits(['change'])
const handleVarRemove = (index: number) => {
  const newList = [...props.list]
  newList.splice(index, 1)
  emit('change', newList, {
    index,
    payload: {
      type: ChangeType.remove,
      payload: {
        beforeKey: props.list[index]!.variable,
      },
    },
  })
}
</script>

