import { VarType } from "@/types";

/** 计算器输入类型枚举 */
export const enum CalculatorInputsEnum {
  OBJECT = 'Object',
  LIST = 'List',
}

/** 计算器参数类型枚举 */
export const enum OperatorArgumentTypeEnum {
  CONSTANT = 'CONSTANT',
  VARIABLE = 'VARIABLE',
  BOTH = 'BOTH',
}

/** 计算器参数值类型枚举 */
export const enum OperatorArgumentValueTypeEnum {
  BOOL = VarType.boolean,
  FLOAT = VarType.float,
  INT = VarType.integer,
  STRING = VarType.string,
  GROUP = VarType.group,
}

/** 计算器输出值类型枚举 */
export const enum OperatorOutputValueTypeEnum {
  BOOL = VarType.boolean,
  FLOAT = VarType.float,
  INT = VarType.integer,
  GROUP = VarType.group,
  NUMBER = VarType.number, // 表示FLOAT或INT
  ANY = VarType.any, // 表示任何类型
}

/** 计算器类型枚举 */
export const enum OperatorTypeEnum {
  MATH_LOGIC = 'math-Logic',
  TIME_SERIES_OPERATIONS = 'Time-Series-Operations',
  CROSS_SECTIONAL_OR_GROUPED_OPERATIONS = 'Cross-Sectional-OR-Grouped-Operaions',
  OTHER = 'other',
}

