import type { Component } from 'vue';
import { type OpenAIFunctionDefinition } from './openAI.type';
import Aime from '@/components/aime/index.vue'

export type FunctionCallAction = {
  type: string;
  function: {
    tool_id: string;
    name: string;
    arguments: Record<string, any>;
    title: string;
    is_external: boolean;
  };
  uuid: string;
};

export type CallExternalCapabilitiesPayload = {
  functionCallAction: FunctionCallAction[];
};

export type CallExternalCapabilitiesFunctionParameter = {
  type: string;
  properties: Record<string, {
    type: string;
    description?: string;
    enum?: string[];
    minItems?: number;
    maxItems?: number;
    items?: CallExternalCapabilitiesFunctionParameter;
  }>;
};

export type CallExternalCapabilitiesTool = {
  type: "function";
  function: OpenAIFunctionDefinition;
  tool_id: string;
};

export type ExecuMethodMap = {
  pageLoaded: () => void;
  login: () => void;
  openViewController: ({
    url,
    openNewWindow,
  }: {
    url: string | URL | undefined;
    openNewWindow?: boolean;
  }) => void;
  callExternalCapabilities: ({
    functionCallAction,
  }: CallExternalCapabilitiesPayload) => void;
};

export type Props = {
  callExternalCapabilitiesTools: CallExternalCapabilitiesTool[];
};

export type Emits = {
  pageLoaded: null;
  login: null;
  openViewController: [
    data: { url: string | URL | undefined; openNewWindow?: boolean },
  ];
  callExternalCapabilities: [
    data: {
      functionCallAction: CallExternalCapabilitiesPayload["functionCallAction"];
    },
  ];
};

export type FunctionCallContext = {
  aime?: InstanceType<typeof Aime>;
  respFunction: (status: boolean, message: string) => void;
};
