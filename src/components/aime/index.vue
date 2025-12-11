<template>
  <iframe src="https://www.ainvest.com/aime/chat/?comefrom=PC_Pre_Release" ref="aimeIframeRef" style="width: 100%; height: 100%; " id="aime_container" frameborder="0"></iframe>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { ExecuMethodMap, Props } from './type';

const props = withDefaults(defineProps<Props>(), {
  callExternalCapabilitiesTools: () => [],
});

const emit = defineEmits(['pageLoaded', 'login', 'openViewController', 'callExternalCapabilities']);

// 向Aime发送协议
function postMessageToAime(data: unknown) {
  const AimeIframeSelector = '#aime_container';
  const aimeIframe = document.querySelector(AimeIframeSelector) as HTMLIFrameElement;
  console.log('回复Aime：', data)
  aimeIframe?.contentWindow?.postMessage(
    data,
    '*'
  );
}

const isAimeReady = ref(false);

// 监听Aime的message信息
const handleMessage = (event: MessageEvent) => {
  const { type, content } = event.data || {};
  console.log('Aime消息：', event.data, type, content);
  const execuMethod: ExecuMethodMap = {
    pageLoaded: () => {
      const config = {
        type: 'init',
        content: {
          sideBarMode: true,
          theme: 'dark',
          externalCapabilities: props.callExternalCapabilitiesTools,
          agentEventName: 6,
          agentId: '254'
        },
      }
      postMessageToAime(config);
      emit('pageLoaded');
      isAimeReady.value = true;
    },
    login: () => {
      emit('login');
    },
    openViewController: ({ url }: { url: string | URL | undefined }) => {
      emit('openViewController', { url });
      // if (url) {
      //   window.open(url);
      // }
    },
    callExternalCapabilities: ({ functionCallAction }) => {
      emit('callExternalCapabilities', { functionCallAction });
    },
  };
  execuMethod[type as keyof ExecuMethodMap]?.(content);
};

window.addEventListener('message', handleMessage);

const respFunctionCall = (toolId: string, isSuccess: boolean, data: any) => {
  postMessageToAime({
    type: 'externalCapabilityResults',
    content: {
      toolCallId: toolId,
      status: isSuccess,
      toolResult: isSuccess ? (data || '') : { reason: data || 'unknown error' },
    },
  });
}

defineExpose({
  respFunctionCall,
});
</script>
