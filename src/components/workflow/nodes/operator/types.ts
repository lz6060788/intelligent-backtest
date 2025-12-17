import type { CommonNodeType, ValueSelector } from "@/types";
import { operators } from "./constant/operators";
import type {
  OperatorArgumentTypeEnum,
  OperatorArgumentValueTypeEnum,
  OperatorOutputValueTypeEnum,
  OperatorTypeEnum,
} from "./constant/enums";

export {
  OperatorArgumentTypeEnum,
  OperatorArgumentValueTypeEnum,
  OperatorOutputValueTypeEnum,
  OperatorTypeEnum,
} from "./constant/enums";

export type OperatorVariable = {
  id: string;
  name: string;
  isConst: boolean;
  isRest: boolean;
  type: OperatorArgumentValueTypeEnum;
  value: number | string | boolean | null | ValueSelector;
}

export type OperatorArgument = {
  name: string;
  valueType: OperatorArgumentValueTypeEnum[];
  type: OperatorArgumentTypeEnum;
  defaultValue?: number | string | boolean | null;
}

export type OperatorType = {
  name: string;
  description: string;
  functionSignature: string;
  keywords: string[];
  type: OperatorTypeEnum;
  inputs: {
    fixedArguments: OperatorArgument[];
    // 虽然不定长参数当前类型定义可以支持多个，但需要在panel处进行一定的适配，当前只会以第一个进行处理
    restArguments: OperatorArgument[];
    maxArguments: number;
    minArguments: number;
  },
  output: {
    name: string;
    type: OperatorOutputValueTypeEnum;
  };
}

export type OperatorItem = typeof operators[number]['name'];

export type OperatorNodeType = CommonNodeType & {
  operator: OperatorItem | null;
  alias: string;
  variables: OperatorVariable[];
}
