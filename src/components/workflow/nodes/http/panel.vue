<template>
  <div class="w-full pt-2">
    <div class="space-y-4 px-4 pb-4">
      <Field
        title="API"
        required
      >
        <ApiInput
          :node-id="props.id"
          :readonly="readOnly"
          :method="inputs.method"
          @method-change="handleMethodChange"
          :url="inputs.url"
          @url-change="handleUrlChange"
        />
      </Field>
      <Field
        :title="t(`${i18nPrefix}.headers`)"
      >
        <KeyValue
          :node-id="props.id"
          :list="headers"
          @change="setHeaders"
          @add="addHeader"
          :readonly="readOnly"
        />
      </Field>
        <Field
          :title="t(`${i18nPrefix}.params`)"
        >
          <KeyValue
            :node-id="props.id"
            :list="params"
            @change="setParams"
            @add="addParam"
            :readonly="readOnly"
          />
        </Field>
        <Field
          :title="t(`${i18nPrefix}.body`)"
          required
        >
          <EditBody
            :node-id="props.id"
            :readonly="readOnly"
            :payload="inputs.body"
            @change="setBody"
          />
        </Field>
    </div>
    <Split />
    <div className=''>
      <OutputVars>
        <VarItem
          name='body'
          type='string'
          :description="t(`${i18nPrefix}.outputVars.body`)"
        />
        <VarItem
          name='status_code'
          type='number'
          :description="t(`${i18nPrefix}.outputVars.statusCode`)"
        />
        <VarItem
          name='headers'
          type='object'
          :description="t(`${i18nPrefix}.outputVars.headers`)"
        />
        <VarItem
          name='files'
          type='Array[File]'
          :description="t(`${i18nPrefix}.outputVars.files`)"
        />
      </OutputVars>
    </div>
  </div>
</template>

<script setup lang="ts">
import Field from '@/components/base/field.vue'
import Split from '@/components/base/split.vue'
import { useI18n } from 'vue-i18n'
import useConfig from './use-config'
import type { NodePanelProps } from '@/types';
import type { HttpNodeType } from './types';
import { computed } from 'vue';
import { useAvailableVarList } from '../_base/hooks';
import ApiInput from './components/api-input.vue';
import KeyValue from './components/key-value/key-value-edit/index.vue';
import EditBody from './components/edit-body/index.vue';
import OutputVars from '@/components/workflow/nodes/_base/output-var/index.vue';
import VarItem from '@/components/workflow/nodes/_base/output-var/var-item.vue';

const i18nPrefix = 'workflow.nodes.http'

const props = defineProps<NodePanelProps<HttpNodeType>>();

const { t } = useI18n()

const payload = computed(() => props.data)

const {
  readOnly,
  isDataReady,
  inputs,
  handleMethodChange,
  handleUrlChange,
  headers,
  setHeaders,
  addHeader,
  params,
  setParams,
  addParam,
  setBody,
  setTimeout,
  filterVar,
} = useConfig(props.id, payload)

const { availableVars, availableNodesWithParent: availableNodes } = useAvailableVarList(props.id, {
  onlyLeafNodeVar: false,
  filterVar: filterVar,
})
console.log('availableVars', availableVars, availableNodes)

const handleChange = (content: { json: Record<string, any>, text: string, html: string }) => {
  console.log('handleChange', content)
}
</script>