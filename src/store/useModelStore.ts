import type { Model, ModelProvider } from '@/components/base/modal-provider/declarations'
import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useModelStore = defineStore('model', () => {
  const modelProviders = ref<ModelProvider[]>([
    {
      "provider": "langgenius/openai/openai",
      "label": {
        "zh_Hans": "OpenAI",
        "en_US": "OpenAI"
      },
      "description": {
        "zh_Hans": "OpenAI 提供的模型，例如 GPT-3.5-Turbo 和 GPT-4。",
        "en_US": "Models provided by OpenAI, such as GPT-3.5-Turbo and GPT-4."
      },
      "icon_small": {
        "zh_Hans": "https://cloud.dify.ai/console/api/workspaces/c5adb074-e308-487f-aa76-9fe49a4daae5/model-providers/langgenius/openai/openai/icon_small/zh_Hans",
        "en_US": "https://cloud.dify.ai/console/api/workspaces/c5adb074-e308-487f-aa76-9fe49a4daae5/model-providers/langgenius/openai/openai/icon_small/en_US"
      },
      "icon_large": {
        "zh_Hans": "https://cloud.dify.ai/console/api/workspaces/c5adb074-e308-487f-aa76-9fe49a4daae5/model-providers/langgenius/openai/openai/icon_large/zh_Hans",
        "en_US": "https://cloud.dify.ai/console/api/workspaces/c5adb074-e308-487f-aa76-9fe49a4daae5/model-providers/langgenius/openai/openai/icon_large/en_US"
      },
      "background": "#E5E7EB",
      "help": {
        "title": {
          "zh_Hans": "从 OpenAI 获取 API Key",
          "en_US": "Get your API Key from OpenAI"
        },
        "url": {
          "zh_Hans": "https://platform.openai.com/account/api-keys",
          "en_US": "https://platform.openai.com/account/api-keys"
        }
      },
      "supported_model_types": [
        "llm",
        "text-embedding",
        "speech2text",
        "moderation",
        "tts"
      ],
      "configurate_methods": [
        "predefined-model",
        "customizable-model"
      ],
      "provider_credential_schema": {
        "credential_form_schemas": [
          {
            "name": "openai_api_key",
            "variable": "openai_api_key",
            "label": {
              "zh_Hans": "API Key",
              "en_US": "API Key"
            },
            "type": "secret-input",
            "required": true,
            "default": undefined,
            "options": [],
            "placeholder": {
              "zh_Hans": "在此输入您的 API Key",
              "en_US": "Enter your API Key"
            },
            "max_length": 0,
            "show_on": [],
          },
          {
            "name": "openai_organization",
            "variable": "openai_organization",
            "label": {
              "zh_Hans": "组织 ID",
              "en_US": "Organization"
            },
            "type": "text-input",
            "required": false,
            "default": undefined,
            "options": [],
            "placeholder": {
              "zh_Hans": "在此输入您的组织 ID",
              "en_US": "Enter your Organization ID"
            },
            "max_length": 0,
            "show_on": []
          },
          {
            "name": "openai_api_base",
            "variable": "openai_api_base",
            "label": {
              "zh_Hans": "API Base",
              "en_US": "API Base"
            },
            "type": "text-input",
            "required": false,
            "default": undefined,
            "options": [],
            "placeholder": {
              "zh_Hans": "在此输入您的 API Base, 如：https://api.openai.com",
              "en_US": "Enter your API Base, e.g. https://api.openai.com"
            },
            "max_length": 0,
            "show_on": []
          }
        ]
      },
      "model_credential_schema": {
        "model": {
          "label": {
            "zh_Hans": "模型名称",
            "en_US": "Model Name"
          },
          "placeholder": {
            "zh_Hans": "输入模型名称",
            "en_US": "Enter your model name"
          }
        },
        "credential_form_schemas": [
          {
            "variable": "openai_api_key",
            "label": {
              "zh_Hans": "API Key",
              "en_US": "API Key"
            },
            "type": "secret-input",
            "required": true,
            "default": undefined,
            "options": [],
            "placeholder": {
              "zh_Hans": "在此输入您的 API Key",
              "en_US": "Enter your API Key"
            },
            "max_length": 0,
            "show_on": []
          },
          {
            "variable": "openai_organization",
            "label": {
              "zh_Hans": "组织 ID",
              "en_US": "Organization"
            },
            "type": "text-input",
            "required": false,
            "default": undefined,
            "options": [],
            "placeholder": {
              "zh_Hans": "在此输入您的组织 ID",
              "en_US": "Enter your Organization ID"
            },
            "max_length": 0,
            "show_on": []
          },
          {
            "variable": "openai_api_base",
            "label": {
              "zh_Hans": "API Base",
              "en_US": "API Base"
            },
            "type": "text-input",
            "required": false,
            "default": undefined,
            "options": [],
            "placeholder": {
              "zh_Hans": "在此输入您的 API Base",
              "en_US": "Enter your API Base"
            },
            "max_length": 0,
            "show_on": []
          }
        ]
      },
      "preferred_provider_type": "system",
      "custom_configuration": {
        "status": "no-configure",
        "current_credential_id": undefined,
        "current_credential_name": undefined,
        "available_credentials": [],
        "custom_models": [],
        "can_added_models": []
      },
      "system_configuration": {
        "enabled": true,
        "current_quota_type": "trial",
        "quota_configurations": [
          {
            "quota_type": "trial",
            "quota_unit": "credits",
            "quota_limit": 200,
            "quota_used": 0,
            "is_valid": true,
            "restrict_models": [
              {
                "model": "gpt-3.5-turbo",
                "base_model_name": undefined,
                "model_type": "llm"
              },
              {
                "model": "gpt-3.5-turbo-1106",
                "base_model_name": undefined,
                "model_type": "llm"
              },
              {
                "model": "gpt-3.5-turbo-instruct",
                "base_model_name": undefined,
                "model_type": "llm"
              },
              {
                "model": "gpt-3.5-turbo-16k",
                "base_model_name": undefined,
                "model_type": "llm"
              },
              {
                "model": "gpt-3.5-turbo-16k-0613",
                "base_model_name": undefined,
                "model_type": "llm"
              },
              {
                "model": "gpt-3.5-turbo-0613",
                "base_model_name": undefined,
                "model_type": "llm"
              },
              {
                "model": "gpt-3.5-turbo-0125",
                "base_model_name": undefined,
                "model_type": "llm"
              },
              {
                "model": "text-davinci-003",
                "base_model_name": undefined,
                "model_type": "llm"
              },
              {
                "model": "gpt-4o-mini",
                "base_model_name": undefined,
                "model_type": "llm"
              },
              {
                "model": "gpt-4o-mini-2024-07-18",
                "base_model_name": undefined,
                "model_type": "llm"
              },
              {
                "model": "chatgpt-4o-latest",
                "base_model_name": undefined,
                "model_type": "llm"
              },
              {
                "model": "gpt-4",
                "base_model_name": undefined,
                "model_type": "llm"
              },
              {
                "model": "gpt-4o",
                "base_model_name": undefined,
                "model_type": "llm"
              }
            ]
          }
        ]
      }
    }
  ])

  const textGenerationModelList = ref<Model[]>([
    {
      "tenant_id": "c5adb074-e308-487f-aa76-9fe49a4daae5",
      "provider": "langgenius/openai/openai",
      "label": {
        "zh_Hans": "OpenAI",
        "en_US": "OpenAI"
      },
      "icon_small": {
        "zh_Hans": "https://cloud.dify.ai/console/api/workspaces/c5adb074-e308-487f-aa76-9fe49a4daae5/model-providers/langgenius/openai/openai/icon_small/zh_Hans",
        "en_US": "https://cloud.dify.ai/console/api/workspaces/c5adb074-e308-487f-aa76-9fe49a4daae5/model-providers/langgenius/openai/openai/icon_small/en_US"
      },
      "icon_large": {
        "zh_Hans": "https://cloud.dify.ai/console/api/workspaces/c5adb074-e308-487f-aa76-9fe49a4daae5/model-providers/langgenius/openai/openai/icon_large/zh_Hans",
        "en_US": "https://cloud.dify.ai/console/api/workspaces/c5adb074-e308-487f-aa76-9fe49a4daae5/model-providers/langgenius/openai/openai/icon_large/en_US"
      },
      "status": "active",
      "models": [
        {
          "model": "chatgpt-4o-latest",
          "label": {
            "zh_Hans": "chatgpt-4o-latest",
            "en_US": "chatgpt-4o-latest"
          },
          "model_type": "llm",
          "features": [
            "multi-tool-call",
            "agent-thought",
            "stream-tool-call",
            "vision"
          ],
          "fetch_from": "predefined-model",
          "model_properties": {
            "context_size": 128000,
            "mode": "chat"
          },
          "deprecated": false,
          "status": "active",
          "load_balancing_enabled": false,
          "has_invalid_load_balancing_configs": false
        },
        {
          "model": "gpt-4o",
          "label": {
            "zh_Hans": "gpt-4o",
            "en_US": "gpt-4o"
          },
          "model_type": "llm",
          "features": [
            "multi-tool-call",
            "agent-thought",
            "stream-tool-call",
            "vision",
            "structured-output"
          ],
          "fetch_from": "predefined-model",
          "model_properties": {
            "context_size": 128000,
            "mode": "chat"
          },
          "deprecated": false,
          "status": "active",
          "load_balancing_enabled": false,
          "has_invalid_load_balancing_configs": false
        },
        {
          "model": "gpt-4o-mini",
          "label": {
            "zh_Hans": "gpt-4o-mini",
            "en_US": "gpt-4o-mini"
          },
          "model_type": "llm",
          "features": [
            "multi-tool-call",
            "agent-thought",
            "stream-tool-call",
            "vision",
            "structured-output"
          ],
          "fetch_from": "predefined-model",
          "model_properties": {
            "context_size": 128000,
            "mode": "chat"
          },
          "deprecated": false,
          "status": "active",
          "load_balancing_enabled": false,
          "has_invalid_load_balancing_configs": false
        },
        {
          "model": "gpt-4o-mini-2024-07-18",
          "label": {
            "zh_Hans": "gpt-4o-mini-2024-07-18",
            "en_US": "gpt-4o-mini-2024-07-18"
          },
          "model_type": "llm",
          "features": [
            "multi-tool-call",
            "agent-thought",
            "stream-tool-call",
            "vision",
            "structured-output"
          ],
          "fetch_from": "predefined-model",
          "model_properties": {
            "context_size": 128000,
            "mode": "chat"
          },
          "deprecated": false,
          "status": "active",
          "load_balancing_enabled": false,
          "has_invalid_load_balancing_configs": false
        },
        {
          "model": "gpt-4",
          "label": {
            "zh_Hans": "gpt-4",
            "en_US": "gpt-4"
          },
          "model_type": "llm",
          "features": [
            "multi-tool-call",
            "agent-thought",
            "stream-tool-call"
          ],
          "fetch_from": "predefined-model",
          "model_properties": {
            "context_size": 8192,
            "mode": "chat"
          },
          "deprecated": false,
          "status": "active",
          "load_balancing_enabled": false,
          "has_invalid_load_balancing_configs": false
        },
        {
          "model": "gpt-3.5-turbo",
          "label": {
            "zh_Hans": "gpt-3.5-turbo",
            "en_US": "gpt-3.5-turbo"
          },
          "model_type": "llm",
          "features": [
            "multi-tool-call",
            "agent-thought",
            "stream-tool-call"
          ],
          "fetch_from": "predefined-model",
          "model_properties": {
            "context_size": 16385,
            "mode": "chat"
          },
          "deprecated": false,
          "status": "active",
          "load_balancing_enabled": false,
          "has_invalid_load_balancing_configs": false
        },
        {
          "model": "gpt-3.5-turbo-0125",
          "label": {
            "zh_Hans": "gpt-3.5-turbo-0125",
            "en_US": "gpt-3.5-turbo-0125"
          },
          "model_type": "llm",
          "features": [
            "multi-tool-call",
            "agent-thought",
            "stream-tool-call"
          ],
          "fetch_from": "predefined-model",
          "model_properties": {
            "context_size": 16385,
            "mode": "chat"
          },
          "deprecated": false,
          "status": "active",
          "load_balancing_enabled": false,
          "has_invalid_load_balancing_configs": false
        },
        {
          "model": "gpt-3.5-turbo-1106",
          "label": {
            "zh_Hans": "gpt-3.5-turbo-1106",
            "en_US": "gpt-3.5-turbo-1106"
          },
          "model_type": "llm",
          "features": [
            "multi-tool-call",
            "agent-thought",
            "stream-tool-call"
          ],
          "fetch_from": "predefined-model",
          "model_properties": {
            "context_size": 16385,
            "mode": "chat"
          },
          "deprecated": false,
          "status": "active",
          "load_balancing_enabled": false,
          "has_invalid_load_balancing_configs": false
        },
        {
          "model": "gpt-3.5-turbo-16k",
          "label": {
            "zh_Hans": "gpt-3.5-turbo-16k",
            "en_US": "gpt-3.5-turbo-16k"
          },
          "model_type": "llm",
          "features": [
            "multi-tool-call",
            "agent-thought",
            "stream-tool-call"
          ],
          "fetch_from": "predefined-model",
          "model_properties": {
            "context_size": 16385,
            "mode": "chat"
          },
          "deprecated": false,
          "status": "active",
          "load_balancing_enabled": false,
          "has_invalid_load_balancing_configs": false
        },
        {
          "model": "gpt-3.5-turbo-instruct",
          "label": {
            "zh_Hans": "gpt-3.5-turbo-instruct",
            "en_US": "gpt-3.5-turbo-instruct"
          },
          "model_type": "llm",
          "features": [],
          "fetch_from": "predefined-model",
          "model_properties": {
            "context_size": 4096,
            "mode": "completion"
          },
          "deprecated": false,
          "status": "active",
          "load_balancing_enabled": false,
          "has_invalid_load_balancing_configs": false
        }
      ]
    }
  ])

  return {
    modelProviders,
    textGenerationModelList
  }
})