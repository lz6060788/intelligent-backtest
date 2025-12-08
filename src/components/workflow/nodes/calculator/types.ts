import type { CommonNodeType, ValueSelector } from "@/types";
import { calculators } from "./constant/calculators";
import type {
  CalculatorArgumentTypeEnum,
  CalculatorArgumentValueTypeEnum,
  CalculatorOutputValueTypeEnum,
  CalculatorTypeEnum,
} from "./constant/enums";

export {
  CalculatorArgumentTypeEnum,
  CalculatorArgumentValueTypeEnum,
  CalculatorOutputValueTypeEnum,
  CalculatorTypeEnum,
} from "./constant/enums";

export type CalculatorVariable = {
  id: string;
  name: string;
  isConst: boolean;
  isRest: boolean;
  type: CalculatorArgumentValueTypeEnum;
  value: number | string | boolean | null | ValueSelector;
}

export type CalculatorArgument = {
  name: string;
  valueType: CalculatorArgumentValueTypeEnum[];
  type: CalculatorArgumentTypeEnum;
  defaultValue?: number | string | boolean | null;
}

export type CalculatorType = {
  name: string;
  description: string;
  functionSignature: string;
  keywords: string[];
  type: CalculatorTypeEnum;
  inputs: {
    fixedArguments: CalculatorArgument[];
    // 虽然不定长参数当前类型定义可以支持多个，但需要在panel处进行一定的适配，当前只会以第一个进行处理
    restArguments: CalculatorArgument[];
    maxArguments: number;
    minArguments: number;
  },
  output: {
    name: string;
    type: CalculatorOutputValueTypeEnum;
  };
}

export type CalculatorItem = typeof calculators[number]['name'];

export type CalculatorNodeType = CommonNodeType & {
  calculator: CalculatorItem | null;
  alias: string;
  variables: CalculatorVariable[];
}
