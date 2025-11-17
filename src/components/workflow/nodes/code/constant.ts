import type { CodeNodeType } from "./types"

export const PYTHON_CONFIG_DEFAULT = {
  "type": "code",
  "config": {
    "variables": [
      {
        "variable": "arg1",
        "value_selector": []
      },
      {
        "variable": "arg2",
        "value_selector": []
      }
    ],
    "code_language": "python3",
    "code": "\ndef main(arg1: str, arg2: str):\n    return {\n        \"result\": arg1 + arg2,\n    }\n",
    "outputs": {
      "result": {
        "type": "string",
        "children": null
      }
    }
  }
} as { type: 'code', config: Partial<CodeNodeType> }

export const JAVASCRIPT_CONFIG_DEFAULT = {
  "type": "code",
  "config": {
    "variables": [
      {
        "variable": "arg1",
        "value_selector": []
      },
      {
        "variable": "arg2",
        "value_selector": []
      }
    ],
    "code_language": "javascript",
    "code": "\nfunction main({arg1, arg2}) {\n    return {\n        result: arg1 + arg2\n    }\n}\n",
    "outputs": {
      "result": {
        "type": "string",
        "children": null
      }
    }
  }
} as { type: 'code', config: Partial<CodeNodeType> }

