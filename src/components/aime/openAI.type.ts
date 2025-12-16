/**
 * OpenAI Function Call 核心类型（兼容官方 API 结构）
 * 参考：https://platform.openai.com/docs/guides/function-calling
 */

/**
 * JSON Schema 基础类型（OpenAI 支持的类型）
 */
export type JsonSchemaType = "string" | "number" | "integer" | "boolean" | "object" | "array" | "null";

/**
 * JSON Schema 格式（常用）
 */
export type JsonSchemaFormat = "email" | "date" | "time" | "date-time" | "uuid" | "uri";

/**
 * 单个参数的 JSON Schema 定义（支持数组/对象/基础类型）
 */
export interface JsonSchemaProperty {
  /** 参数类型 */
  type: JsonSchemaType;
  /** 参数描述（必填，帮助模型理解） */
  description: string;
  /** 参数示例（提升模型生成准确性） */
  examples?: any[];
  /** 默认值 */
  default?: any;
  /** 字符串/数字枚举（限定可选值） */
  enum?: (string | number | boolean)[];
  /** 格式校验（如 email/uuid） */
  format?: JsonSchemaFormat;

  // 数组类型专属配置
  /** 数组元素的 Schema 定义（type=array 时必填） */
  items?: JsonSchemaProperty;
  /** 数组最小元素数量 */
  minItems?: number;
  /** 数组最大元素数量 */
  maxItems?: number;
  /** 是否要求数组元素唯一 */
  uniqueItems?: boolean;

  // 对象类型专属配置
  /** 对象属性的 Schema 定义（type=object 时必填） */
  properties?: Record<string, JsonSchemaProperty>;
  /** 对象必填字段列表 */
  required?: string[];
  /** 是否禁止额外属性（建议设为 true，避免非法参数） */
  additionalProperties?: boolean;

  // 数字/字符串校验
  /** 最小数值（number/integer） */
  minimum?: number;
  /** 最大数值（number/integer） */
  maximum?: number;
  /** 字符串最小长度 */
  minLength?: number;
  /** 字符串最大长度 */
  maxLength?: number;
  /** 字符串正则校验 */
  pattern?: string;
}

/**
 * OpenAI 函数定义结构
 */
export interface OpenAIFunctionDefinition {
  /** 函数名（唯一，建议小驼峰命名，如 batchQueryOrder） */
  name: string;
  /** 函数描述（必填，清晰说明函数用途） */
  description: string;
  /** 函数参数的 JSON Schema 定义 */
  parameters: {
    type: "object";
    /** 参数列表 */
    properties: Record<string, JsonSchemaProperty>;
    /** 必填参数列表 */
    required: string[];
    /** 禁止额外参数（强制约束） */
    additionalProperties?: false;
  };
}

/**
 * 模型返回的函数调用结果
 */
export interface OpenAIFunctionCall {
  /** 调用的函数名 */
  name: string;
  /** 函数参数（JSON 字符串，需解析后校验） */
  arguments: string;
}

/**
 * 模型返回的消息结构（包含函数调用）
 */
export interface OpenAIChatMessage {
  role: "system" | "user" | "assistant" | "function";
  content: string | null;
  /** 函数调用结果（assistant 消息专属） */
  function_call?: OpenAIFunctionCall;
  /** 函数名（function 消息专属） */
  name?: string;
}

/**
 * 数组参数校验工具类型（辅助业务层校验）
 */
export namespace FunctionParameterValidators {
  /**
   * 基础数组参数校验规则
   */
  export interface ArrayValidationRule<T = any> {
    /** 最小元素数 */
    minLength?: number;
    /** 最大元素数 */
    maxLength?: number;
    /** 元素唯一性校验 */
    unique?: boolean;
    /** 自定义元素校验函数 */
    validateItem?: (item: T) => boolean;
  }

  /**
   * 字符串数组校验规则（扩展）
   */
  export interface StringArrayValidationRule extends ArrayValidationRule<string> {
    /** 枚举值限制 */
    enum?: string[];
    /** 字符串正则校验 */
    pattern?: RegExp;
    /** 单个字符串最小长度 */
    itemMinLength?: number;
    /** 单个字符串最大长度 */
    itemMaxLength?: number;
  }

  /**
   * 数字数组校验规则（扩展）
   */
  export interface NumberArrayValidationRule extends ArrayValidationRule<number> {
    /** 最小值 */
    minValue?: number;
    /** 最大值 */
    maxValue?: number;
    /** 是否为整数 */
    integer?: boolean;
  }
}