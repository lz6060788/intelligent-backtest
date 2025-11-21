export type FunctionCallAction = {
  type: string;
  function: {
    tool_id: string;
    name: string;
    arguments: Record<string, any>;
    title: string;
    is_external: boolean;
  }
  uuid: string;
}

export type CallExternalCapabilitiesPayload = {
  functionCallAction: FunctionCallAction[];
};

export type CallExternalCapabilitiesTool = {
  function: {
    name: string;
    description: string;
    parameters: {
      type: string;
      properties: Record<string, { type: string; description?: string; enum?: string[] }>;
      required: string[];
    };
  };
  tool_id: string;
}

export type ExecuMethodMap = {
  pageLoaded: () => void;
  login: () => void;
  openViewController: ({ url, openNewWindow }: { url: string | URL | undefined, openNewWindow?: boolean }) => void;
  callExternalCapabilities: ({ functionCallAction }: CallExternalCapabilitiesPayload) => void;
};

export type Props = {
  callExternalCapabilitiesTools: CallExternalCapabilitiesTool[];
}

export type Emits = {
  pageLoaded: null;
  login: null;
  openViewController: [data: { url: string | URL | undefined, openNewWindow?: boolean }];
  callExternalCapabilities: [data:{ functionCallAction: CallExternalCapabilitiesPayload['functionCallAction'] }];
}