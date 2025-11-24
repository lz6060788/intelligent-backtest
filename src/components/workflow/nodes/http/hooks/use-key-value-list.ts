import { uniqueId } from 'lodash-es'
import type { KeyValue } from '../types'
import { computed, ref, watch } from 'vue'

const UNIQUE_ID_PREFIX = 'key-value-'
const strToKeyValueList = (value: string) => {
  return value.split('\n').map((item) => {
    const [key, ...others] = item.split(':')
    return {
      id: uniqueId(UNIQUE_ID_PREFIX),
      key: key!.trim(),
      value: others.join(':').trim(),
    }
  })
}

const useKeyValueList = (value: string, onChange: (value: string) => void, noFilter?: boolean) => {
  const list = ref<KeyValue[]>(value ? strToKeyValueList(value) : [])
  const setList = (l: KeyValue[]) => {
    console.log('setList', l)
    list.value = l.map((item) => {
      return {
        ...item,
        id: item.id || uniqueId(UNIQUE_ID_PREFIX),
      }
    })
  }
  watch(list, () => {
    if (noFilter)
      return
    const newValue = list.value.filter(item => item.key && item.value).map(item => `${item.key}:${item.value}`).join('\n')
    if (newValue !== value)
      onChange(newValue)
  })
  const addItem = () => {
    setList([...list.value, {
      id: uniqueId(UNIQUE_ID_PREFIX),
      key: '',
      value: '',
    }])
  }

  const isKeyValueEdit = ref(true)
  const toggleIsKeyValueEdit = () => {
    isKeyValueEdit.value = !isKeyValueEdit.value
  }

  const displayedList = computed(() => {
    return list.value.length === 0 ? [{ id: uniqueId(UNIQUE_ID_PREFIX), key: '', value: '' }] : list.value
  })

  return {
    list: displayedList,
    setList,
    addItem,
    isKeyValueEdit,
    toggleIsKeyValueEdit,
  }
}

export default useKeyValueList
