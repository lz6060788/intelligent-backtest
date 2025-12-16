import { type CalculatorType } from '../types';
import { CalculatorArgumentValueTypeEnum, CalculatorArgumentTypeEnum, CalculatorOutputValueTypeEnum, CalculatorTypeEnum } from './enums';

export const operators = [
  {
    name: 'add',
    description: '对两个或多个数值进行逐元素算术加法。',
    functionSignature: 'add(x1, x2, ...)',
    keywords: ['加', '求和', 'plus', 'sum', 'total', '增加'],
    type: CalculatorTypeEnum.MATH_LOGIC,
    inputs: {
      fixedArguments: [],
      restArguments: [{
        name: '',
        valueType: [CalculatorArgumentValueTypeEnum.INT, CalculatorArgumentValueTypeEnum.FLOAT],
        type: CalculatorArgumentTypeEnum.BOTH
      }],
      minArguments: 2,
      maxArguments: 999
    },
    output: { name: 'result', type: CalculatorOutputValueTypeEnum.NUMBER }
  },
  {
    name: 'subtract',
    description: '逐元素算术减法，计算 x 减去 y。',
    functionSignature: 'subtract(x, y)',
    keywords: ['减', '差值', 'minus', 'difference', '扣除', '差离'],
    type: CalculatorTypeEnum.MATH_LOGIC,
    inputs: {
      fixedArguments: [
        {
          name: 'x',
          valueType: [CalculatorArgumentValueTypeEnum.INT, CalculatorArgumentValueTypeEnum.FLOAT],
          type: CalculatorArgumentTypeEnum.BOTH
        },
        {
          name: 'y',
          valueType: [CalculatorArgumentValueTypeEnum.INT, CalculatorArgumentValueTypeEnum.FLOAT],
          type: CalculatorArgumentTypeEnum.BOTH
        }
      ],
      restArguments: [],
      minArguments: 2,
      maxArguments: 2
    },
    output: { name: 'result', type: CalculatorOutputValueTypeEnum.NUMBER }
  },
  {
    name: 'multiply',
    description: '对两个或多个数值进行逐元素算术乘法。',
    functionSignature: 'multiply(x1, x2, ...)',
    keywords: ['乘', '积', 'times', 'product', '放大'],
    type: CalculatorTypeEnum.MATH_LOGIC,
    inputs: {
      fixedArguments: [],
      restArguments: [{
        name: '',
        valueType: [CalculatorArgumentValueTypeEnum.INT, CalculatorArgumentValueTypeEnum.FLOAT],
        type: CalculatorArgumentTypeEnum.BOTH
      }],
      minArguments: 2,
      maxArguments: 999
    },
    output: { name: 'result', type: CalculatorOutputValueTypeEnum.NUMBER }
  },
  {
    name: 'divide',
    description: '逐元素算术除法，计算 x 除以 y。',
    functionSignature: 'divide(x, y)',
    keywords: ['除', '比率', 'ratio', 'division', '占比'],
    type: CalculatorTypeEnum.MATH_LOGIC,
    inputs: {
      fixedArguments: [
        {
          name: 'x',
          valueType: [CalculatorArgumentValueTypeEnum.INT, CalculatorArgumentValueTypeEnum.FLOAT],
          type: CalculatorArgumentTypeEnum.BOTH
        },
        {
          name: 'y',
          valueType: [CalculatorArgumentValueTypeEnum.INT, CalculatorArgumentValueTypeEnum.FLOAT],
          type: CalculatorArgumentTypeEnum.BOTH
        }
      ],
      restArguments: [],
      minArguments: 2,
      maxArguments: 2
    },
    output: { name: 'result', type: CalculatorOutputValueTypeEnum.FLOAT }
  },
  {
    name: 'neg',
    description: '将数值的符号取反（正变负，负变正）。',
    functionSignature: 'neg(x)',
    keywords: ['取反', '负号', 'negate', 'negative', 'reverse sign'],
    type: CalculatorTypeEnum.MATH_LOGIC,
    inputs: {
      fixedArguments: [{
        name: 'x',
        valueType: [CalculatorArgumentValueTypeEnum.INT, CalculatorArgumentValueTypeEnum.FLOAT],
        type: CalculatorArgumentTypeEnum.BOTH
      }],
      restArguments: [],
      minArguments: 1,
      maxArguments: 1
    },
    output: { name: 'result', type: CalculatorOutputValueTypeEnum.NUMBER }
  },
  {
    name: 'abs',
    description: '计算数值的绝对值，将负数转换为正数。',
    functionSignature: 'abs(x)',
    keywords: ['绝对值', 'absolute', 'magnitude'],
    type: CalculatorTypeEnum.MATH_LOGIC,
    inputs: {
      fixedArguments: [{
        name: 'x',
        valueType: [CalculatorArgumentValueTypeEnum.INT, CalculatorArgumentValueTypeEnum.FLOAT],
        type: CalculatorArgumentTypeEnum.BOTH
      }],
      restArguments: [],
      minArguments: 1,
      maxArguments: 1
    },
    output: { name: 'result', type: CalculatorOutputValueTypeEnum.NUMBER }
  },
  {
    name: 'sign',
    description: '取数值的符号。正数返回 1，负数返回 -1，零返回 0。',
    functionSignature: 'sign(x)',
    keywords: ['符号', '正负', 'signum', 'direction'],
    type: CalculatorTypeEnum.MATH_LOGIC,
    inputs: {
      fixedArguments: [{
        name: 'x',
        valueType: [CalculatorArgumentValueTypeEnum.INT, CalculatorArgumentValueTypeEnum.FLOAT],
        type: CalculatorArgumentTypeEnum.BOTH
      }],
      restArguments: [],
      minArguments: 1,
      maxArguments: 1
    },
    output: { name: 'result', type: CalculatorOutputValueTypeEnum.INT }
  },
  {
    name: 'inv',
    description: '计算数值的倒数 (1/x)。',
    functionSignature: 'inv(x)',
    keywords: ['倒数', 'inverse', 'reciprocal'],
    type: CalculatorTypeEnum.MATH_LOGIC,
    inputs: {
      fixedArguments: [{
        name: 'x',
        valueType: [CalculatorArgumentValueTypeEnum.INT, CalculatorArgumentValueTypeEnum.FLOAT],
        type: CalculatorArgumentTypeEnum.BOTH
      }],
      restArguments: [],
      minArguments: 1,
      maxArguments: 1
    },
    output: { name: 'result', type: CalculatorOutputValueTypeEnum.FLOAT }
  },
  {
    name: 'sqrt',
    description: '计算数值的平方根。',
    functionSignature: 'sqrt(x)',
    keywords: ['开根号', '平方根', 'square root', 'radical'],
    type: CalculatorTypeEnum.MATH_LOGIC,
    inputs: {
      fixedArguments: [{
        name: 'x',
        valueType: [CalculatorArgumentValueTypeEnum.INT, CalculatorArgumentValueTypeEnum.FLOAT],
        type: CalculatorArgumentTypeEnum.BOTH
      }],
      restArguments: [],
      minArguments: 1,
      maxArguments: 1
    },
    output: { name: 'result', type: CalculatorOutputValueTypeEnum.FLOAT }
  },
  {
    name: 'log',
    description: '计算 x 以 b 为底的对数。',
    functionSignature: 'log(x, b)',
    keywords: ['对数', 'logarithm', 'log'],
    type: CalculatorTypeEnum.MATH_LOGIC,
    inputs: {
      fixedArguments: [
        {
          name: 'x',
          valueType: [CalculatorArgumentValueTypeEnum.INT, CalculatorArgumentValueTypeEnum.FLOAT],
          type: CalculatorArgumentTypeEnum.BOTH
        },
        {
          name: 'b',
          valueType: [CalculatorArgumentValueTypeEnum.FLOAT],
          type: CalculatorArgumentTypeEnum.CONSTANT
        }
      ],
      restArguments: [],
      minArguments: 2,
      maxArguments: 2
    },
    output: { name: 'result', type: CalculatorOutputValueTypeEnum.FLOAT }
  },
  {
    name: 'signed_power',
    description: '计算 x 的 y 次幂，但结果保留 x 原有的符号。常用于非线性变换但需保留方向的场景。',
    functionSignature: 'signed_power(x, y)',
    keywords: ['幂运算', '指数', 'power', 'exponent'],
    type: CalculatorTypeEnum.MATH_LOGIC,
    inputs: {
      fixedArguments: [
        {
          name: 'x',
          valueType: [CalculatorArgumentValueTypeEnum.INT, CalculatorArgumentValueTypeEnum.FLOAT],
          type: CalculatorArgumentTypeEnum.BOTH
        },
        {
          name: 'y',
          valueType: [CalculatorArgumentValueTypeEnum.FLOAT],
          type: CalculatorArgumentTypeEnum.CONSTANT
        }
      ],
      restArguments: [],
      minArguments: 2,
      maxArguments: 2
    },
    output: { name: 'result', type: CalculatorOutputValueTypeEnum.FLOAT }
  },
  {
    name: 'max',
    description: '比较多个输入序列，逐元素返回其中的最大值。',
    functionSignature: 'max(x1, x2, ...)',
    keywords: ['最大', '较高值', 'maximum', 'highest', '取大'],
    type: CalculatorTypeEnum.MATH_LOGIC,
    inputs: {
      fixedArguments: [],
      restArguments: [{
        name: '',
        valueType: [CalculatorArgumentValueTypeEnum.INT, CalculatorArgumentValueTypeEnum.FLOAT],
        type: CalculatorArgumentTypeEnum.BOTH
      }],
      minArguments: 2,
      maxArguments: 999
    },
    output: { name: 'result', type: CalculatorOutputValueTypeEnum.NUMBER }
  },
  {
    name: 'min',
    description: '比较多个输入序列，逐元素返回其中的最小值。',
    functionSignature: 'min(x1, x2, ...)',
    keywords: ['最小', '较低值', 'minimum', 'lowest', '取小'],
    type: CalculatorTypeEnum.MATH_LOGIC,
    inputs: {
      fixedArguments: [],
      restArguments: [{
        name: '',
        valueType: [CalculatorArgumentValueTypeEnum.INT, CalculatorArgumentValueTypeEnum.FLOAT],
        type: CalculatorArgumentTypeEnum.BOTH
      }],
      minArguments: 2,
      maxArguments: 999
    },
    output: { name: 'result', type: CalculatorOutputValueTypeEnum.NUMBER }
  },
  {
    name: 'and',
    description: '当且仅当所有输入条件都为真时，结果才为真。',
    functionSignature: 'and(c1, c2, ...)',
    keywords: ['且', '同时满足', '并且', 'both', 'all true'],
    type: CalculatorTypeEnum.MATH_LOGIC,
    inputs: {
      fixedArguments: [],
      restArguments: [{
        name: '',
        valueType: [CalculatorArgumentValueTypeEnum.BOOL],
        type: CalculatorArgumentTypeEnum.BOTH
      }],
      minArguments: 2,
      maxArguments: 999
    },
    output: { name: 'result', type: CalculatorOutputValueTypeEnum.BOOL }
  },
  {
    name: 'or',
    description: '只要有一个输入条件为真，结果即为真。',
    functionSignature: 'or(c1, c2, ...)',
    keywords: ['或', '或者', '任一满足', 'either', 'any true'],
    type: CalculatorTypeEnum.MATH_LOGIC,
    inputs: {
      fixedArguments: [],
      restArguments: [{
        name: '',
        valueType: [CalculatorArgumentValueTypeEnum.BOOL],
        type: CalculatorArgumentTypeEnum.BOTH
      }],
      minArguments: 2,
      maxArguments: 999
    },
    output: { name: 'result', type: CalculatorOutputValueTypeEnum.BOOL }
  },
  {
    name: 'xor',
    description: '当两个条件不同时结果为真（一个真一个假）。',
    functionSignature: 'xor(c1, c2)',
    keywords: ['异或', '不同', 'exclusive or'],
    type: CalculatorTypeEnum.MATH_LOGIC,
    inputs: {
      fixedArguments: [
        {
          name: 'c1',
          valueType: [CalculatorArgumentValueTypeEnum.BOOL],
          type: CalculatorArgumentTypeEnum.BOTH
        },
        {
          name: 'c2',
          valueType: [CalculatorArgumentValueTypeEnum.BOOL],
          type: CalculatorArgumentTypeEnum.BOTH
        }
      ],
      restArguments: [],
      minArguments: 2,
      maxArguments: 2
    },
    output: { name: 'result', type: CalculatorOutputValueTypeEnum.BOOL }
  },
  {
    name: 'not',
    description: '对布尔条件取反。',
    functionSignature: 'not(c1)',
    keywords: ['非', '不是', '取反', 'negate', 'invert'],
    type: CalculatorTypeEnum.MATH_LOGIC,
    inputs: {
      fixedArguments: [{
        name: 'c1',
        valueType: [CalculatorArgumentValueTypeEnum.BOOL],
        type: CalculatorArgumentTypeEnum.BOTH
      }],
      restArguments: [],
      minArguments: 1,
      maxArguments: 1
    },
    output: { name: 'result', type: CalculatorOutputValueTypeEnum.BOOL }
  },
  {
    name: 'greater_than',
    description: '判断 x 是否严格大于 y。',
    functionSignature: 'greater_than(x, y)',
    keywords: ['大于', '超过', '高于', 'gt', 'above'],
    type: CalculatorTypeEnum.MATH_LOGIC,
    inputs: {
      fixedArguments: [
        {
          name: 'x',
          valueType: [CalculatorArgumentValueTypeEnum.INT, CalculatorArgumentValueTypeEnum.FLOAT],
          type: CalculatorArgumentTypeEnum.BOTH
        },
        {
          name: 'y',
          valueType: [CalculatorArgumentValueTypeEnum.INT, CalculatorArgumentValueTypeEnum.FLOAT],
          type: CalculatorArgumentTypeEnum.BOTH
        }
      ],
      restArguments: [],
      minArguments: 2,
      maxArguments: 2
    },
    output: { name: 'result', type: CalculatorOutputValueTypeEnum.BOOL }
  },
  {
    name: 'less_than',
    description: '判断 x 是否严格小于 y。',
    functionSignature: 'less_than(x, y)',
    keywords: ['小于', '低于', '未达到', 'lt', 'below'],
    type: CalculatorTypeEnum.MATH_LOGIC,
    inputs: {
      fixedArguments: [
        {
          name: 'x',
          valueType: [CalculatorArgumentValueTypeEnum.INT, CalculatorArgumentValueTypeEnum.FLOAT],
          type: CalculatorArgumentTypeEnum.BOTH
        },
        {
          name: 'y',
          valueType: [CalculatorArgumentValueTypeEnum.INT, CalculatorArgumentValueTypeEnum.FLOAT],
          type: CalculatorArgumentTypeEnum.BOTH
        }
      ],
      restArguments: [],
      minArguments: 2,
      maxArguments: 2
    },
    output: { name: 'result', type: CalculatorOutputValueTypeEnum.BOOL }
  },
  {
    name: 'greater_than_or_equal',
    description: '判断 x 是否大于或等于 y。',
    functionSignature: 'greater_than_or_equal(x, y)',
    keywords: ['大于等于', '不小于', '至少', 'gte'],
    type: CalculatorTypeEnum.MATH_LOGIC,
    inputs: {
      fixedArguments: [
        {
          name: 'x',
          valueType: [CalculatorArgumentValueTypeEnum.INT, CalculatorArgumentValueTypeEnum.FLOAT],
          type: CalculatorArgumentTypeEnum.BOTH
        },
        {
          name: 'y',
          valueType: [CalculatorArgumentValueTypeEnum.INT, CalculatorArgumentValueTypeEnum.FLOAT],
          type: CalculatorArgumentTypeEnum.BOTH
        }
      ],
      restArguments: [],
      minArguments: 2,
      maxArguments: 2
    },
    output: { name: 'result', type: CalculatorOutputValueTypeEnum.BOOL }
  },
  {
    name: 'less_than_or_equal',
    description: '判断 x 是否小于或等于 y。',
    functionSignature: 'less_than_or_equal(x, y)',
    keywords: ['小于等于', '不大于', '至多', 'lte'],
    type: CalculatorTypeEnum.MATH_LOGIC,
    inputs: {
      fixedArguments: [
        {
          name: 'x',
          valueType: [CalculatorArgumentValueTypeEnum.INT, CalculatorArgumentValueTypeEnum.FLOAT],
          type: CalculatorArgumentTypeEnum.BOTH
        },
        {
          name: 'y',
          valueType: [CalculatorArgumentValueTypeEnum.INT, CalculatorArgumentValueTypeEnum.FLOAT],
          type: CalculatorArgumentTypeEnum.BOTH
        }
      ],
      restArguments: [],
      minArguments: 2,
      maxArguments: 2
    },
    output: { name: 'result', type: CalculatorOutputValueTypeEnum.BOOL }
  },
  {
    name: 'equal_to',
    description: '判断 x 是否等于 y。',
    functionSignature: 'equal_to(x, y)',
    keywords: ['等于', '相等', 'equal', 'same'],
    type: CalculatorTypeEnum.MATH_LOGIC,
    inputs: {
      fixedArguments: [
        {
          name: 'x',
          valueType: [
            CalculatorArgumentValueTypeEnum.BOOL,
            CalculatorArgumentValueTypeEnum.FLOAT,
            CalculatorArgumentValueTypeEnum.INT,
            CalculatorArgumentValueTypeEnum.STRING,
            CalculatorArgumentValueTypeEnum.GROUP
          ],
          type: CalculatorArgumentTypeEnum.BOTH
        },
        {
          name: 'y',
          valueType: [
            CalculatorArgumentValueTypeEnum.BOOL,
            CalculatorArgumentValueTypeEnum.FLOAT,
            CalculatorArgumentValueTypeEnum.INT,
            CalculatorArgumentValueTypeEnum.STRING,
            CalculatorArgumentValueTypeEnum.GROUP
          ],
          type: CalculatorArgumentTypeEnum.BOTH
        }
      ],
      restArguments: [],
      minArguments: 2,
      maxArguments: 2
    },
    output: { name: 'result', type: CalculatorOutputValueTypeEnum.BOOL }
  },
  {
    name: 'is_nan',
    description: '判断数值是否为 NaN (Not a Number)。',
    functionSignature: 'is_nan(x)',
    keywords: ['空值', '缺失值', 'nan', 'missing'],
    type: CalculatorTypeEnum.MATH_LOGIC,
    inputs: {
      fixedArguments: [{
        name: 'x',
        valueType: [CalculatorArgumentValueTypeEnum.FLOAT],
        type: CalculatorArgumentTypeEnum.BOTH
      }],
      restArguments: [],
      minArguments: 1,
      maxArguments: 1
    },
    output: { name: 'result', type: CalculatorOutputValueTypeEnum.BOOL }
  },
  {
    name: 'ifthenelse',
    description: '三元运算符。如果条件 cond 为真返回 x，否则返回 y。',
    functionSignature: 'ifthenelse(cond, x, y)',
    keywords: ['如果', '分支', 'if', 'switch', 'condition'],
    type: CalculatorTypeEnum.MATH_LOGIC,
    inputs: {
      fixedArguments: [
        {
          name: 'cond',
          valueType: [CalculatorArgumentValueTypeEnum.BOOL],
          type: CalculatorArgumentTypeEnum.BOTH
        },
        {
          name: 'x',
          valueType: [
            CalculatorArgumentValueTypeEnum.BOOL,
            CalculatorArgumentValueTypeEnum.FLOAT,
            CalculatorArgumentValueTypeEnum.INT,
            CalculatorArgumentValueTypeEnum.STRING,
            CalculatorArgumentValueTypeEnum.GROUP
          ],
          type: CalculatorArgumentTypeEnum.BOTH
        },
        {
          name: 'y',
          valueType: [
            CalculatorArgumentValueTypeEnum.BOOL,
            CalculatorArgumentValueTypeEnum.FLOAT,
            CalculatorArgumentValueTypeEnum.INT,
            CalculatorArgumentValueTypeEnum.STRING,
            CalculatorArgumentValueTypeEnum.GROUP
          ],
          type: CalculatorArgumentTypeEnum.BOTH
        }
      ],
      restArguments: [],
      minArguments: 3,
      maxArguments: 3
    },
    output: { name: 'result', type: CalculatorOutputValueTypeEnum.ANY }
  },
  {
    name: 'identity',
    description: '直接返回输入值本身。通常用于在 AST 中仅为了重命名（alias）变量而不需要计算的场景。',
    functionSignature: 'identity(x)',
    keywords: ['赋值', '别名', '重命名', 'alias', 'same'],
    type: CalculatorTypeEnum.MATH_LOGIC,
    inputs: {
      fixedArguments: [{
        name: 'x',
        valueType: [
          CalculatorArgumentValueTypeEnum.BOOL,
          CalculatorArgumentValueTypeEnum.FLOAT,
          CalculatorArgumentValueTypeEnum.INT,
          CalculatorArgumentValueTypeEnum.STRING,
          CalculatorArgumentValueTypeEnum.GROUP
        ],
        type: CalculatorArgumentTypeEnum.BOTH
      }],
      restArguments: [],
      minArguments: 1,
      maxArguments: 1
    },
    output: { name: 'result', type: CalculatorOutputValueTypeEnum.ANY }
  },

  // ==================================================
  // 第二部分：时序运算
  // ==================================================
  {
    name: 'ts_mean',
    description: '计算过去 d 个周期内的算术平均值。这是构建各类均线（MA, SMA）的核心算子。',
    functionSignature: 'ts_mean(x, d)',
    keywords: ['均线', '移动平均', '平均值', 'MA', 'SMA', 'average', 'mean'],
    type: CalculatorTypeEnum.TIME_SERIES_OPERATIONS,
    inputs: {
      fixedArguments: [
        {
          name: 'x',
          valueType: [CalculatorArgumentValueTypeEnum.INT, CalculatorArgumentValueTypeEnum.FLOAT],
          type: CalculatorArgumentTypeEnum.BOTH
        },
        {
          name: 'd',
          valueType: [CalculatorArgumentValueTypeEnum.INT],
          type: CalculatorArgumentTypeEnum.CONSTANT
        }
      ],
      restArguments: [],
      minArguments: 2,
      maxArguments: 2
    },
    output: { name: 'result', type: CalculatorOutputValueTypeEnum.FLOAT }
  },
  {
    name: 'ts_std',
    description: '计算过去 d 个周期内的标准差。常用于计算布林带带宽、波动率。',
    functionSignature: 'ts_std(x, d)',
    keywords: ['标准差', '波动率', '布林带', 'std', 'standard deviation', 'volatility', 'bollinger'],
    type: CalculatorTypeEnum.TIME_SERIES_OPERATIONS,
    inputs: {
      fixedArguments: [
        {
          name: 'x',
          valueType: [CalculatorArgumentValueTypeEnum.INT, CalculatorArgumentValueTypeEnum.FLOAT],
          type: CalculatorArgumentTypeEnum.BOTH
        },
        {
          name: 'd',
          valueType: [CalculatorArgumentValueTypeEnum.INT],
          type: CalculatorArgumentTypeEnum.CONSTANT
        }
      ],
      restArguments: [],
      minArguments: 2,
      maxArguments: 2
    },
    output: { name: 'result', type: CalculatorOutputValueTypeEnum.FLOAT }
  },
  {
    name: 'ts_max',
    description: '计算过去 d 个周期内的最大值。',
    functionSignature: 'ts_max(x, d)',
    keywords: ['过去最大', '最高点', '历史高点', 'highest', 'peak'],
    type: CalculatorTypeEnum.TIME_SERIES_OPERATIONS,
    inputs: {
      fixedArguments: [
        {
          name: 'x',
          valueType: [CalculatorArgumentValueTypeEnum.INT, CalculatorArgumentValueTypeEnum.FLOAT],
          type: CalculatorArgumentTypeEnum.BOTH
        },
        {
          name: 'd',
          valueType: [CalculatorArgumentValueTypeEnum.INT],
          type: CalculatorArgumentTypeEnum.CONSTANT
        }
      ],
      restArguments: [],
      minArguments: 2,
      maxArguments: 2
    },
    output: { name: 'result', type: CalculatorOutputValueTypeEnum.NUMBER }
  },
  {
    name: 'ts_min',
    description: '计算过去 d 个周期内的最小值。',
    functionSignature: 'ts_min(x, d)',
    keywords: ['过去最小', '最低点', '历史低点', 'lowest', 'bottom'],
    type: CalculatorTypeEnum.TIME_SERIES_OPERATIONS,
    inputs: {
      fixedArguments: [
        {
          name: 'x',
          valueType: [CalculatorArgumentValueTypeEnum.INT, CalculatorArgumentValueTypeEnum.FLOAT],
          type: CalculatorArgumentTypeEnum.BOTH
        },
        {
          name: 'd',
          valueType: [CalculatorArgumentValueTypeEnum.INT],
          type: CalculatorArgumentTypeEnum.CONSTANT
        }
      ],
      restArguments: [],
      minArguments: 2,
      maxArguments: 2
    },
    output: { name: 'result', type: CalculatorOutputValueTypeEnum.NUMBER }
  },
  {
    name: 'ts_median',
    description: '计算过去 d 个周期内的中位数。',
    functionSignature: 'ts_median(x, d)',
    keywords: ['中位数', '中间值', 'median'],
    type: CalculatorTypeEnum.TIME_SERIES_OPERATIONS,
    inputs: {
      fixedArguments: [
        {
          name: 'x',
          valueType: [CalculatorArgumentValueTypeEnum.INT, CalculatorArgumentValueTypeEnum.FLOAT],
          type: CalculatorArgumentTypeEnum.BOTH
        },
        {
          name: 'd',
          valueType: [CalculatorArgumentValueTypeEnum.INT],
          type: CalculatorArgumentTypeEnum.CONSTANT
        }
      ],
      restArguments: [],
      minArguments: 2,
      maxArguments: 2
    },
    output: { name: 'result', type: CalculatorOutputValueTypeEnum.FLOAT }
  },
  {
    name: 'ts_product',
    description: '计算过去 d 个周期内数据的连乘积。',
    functionSignature: 'ts_product(x, d)',
    keywords: ['连乘', '累乘', 'product'],
    type: CalculatorTypeEnum.TIME_SERIES_OPERATIONS,
    inputs: {
      fixedArguments: [
        {
          name: 'x',
          valueType: [CalculatorArgumentValueTypeEnum.INT, CalculatorArgumentValueTypeEnum.FLOAT],
          type: CalculatorArgumentTypeEnum.BOTH
        },
        {
          name: 'd',
          valueType: [CalculatorArgumentValueTypeEnum.INT],
          type: CalculatorArgumentTypeEnum.CONSTANT
        }
      ],
      restArguments: [],
      minArguments: 2,
      maxArguments: 2
    },
    output: { name: 'result', type: CalculatorOutputValueTypeEnum.NUMBER }
  },
  {
    name: 'ts_skew',
    description: '计算过去 d 个周期内数据的偏度。',
    functionSignature: 'ts_skew(x, d)',
    keywords: ['偏度', 'skewness', 'skew'],
    type: CalculatorTypeEnum.TIME_SERIES_OPERATIONS,
    inputs: {
      fixedArguments: [
        {
          name: 'x',
          valueType: [CalculatorArgumentValueTypeEnum.INT, CalculatorArgumentValueTypeEnum.FLOAT],
          type: CalculatorArgumentTypeEnum.BOTH
        },
        {
          name: 'd',
          valueType: [CalculatorArgumentValueTypeEnum.INT],
          type: CalculatorArgumentTypeEnum.CONSTANT
        }
      ],
      restArguments: [],
      minArguments: 2,
      maxArguments: 2
    },
    output: { name: 'result', type: CalculatorOutputValueTypeEnum.FLOAT }
  },
  {
    name: 'ts_kurtosis',
    description: '计算过去 d 个周期内数据的峰度。',
    functionSignature: 'ts_kurtosis(x, d)',
    keywords: ['峰度', 'kurtosis'],
    type: CalculatorTypeEnum.TIME_SERIES_OPERATIONS,
    inputs: {
      fixedArguments: [
        {
          name: 'x',
          valueType: [CalculatorArgumentValueTypeEnum.INT, CalculatorArgumentValueTypeEnum.FLOAT],
          type: CalculatorArgumentTypeEnum.BOTH
        },
        {
          name: 'd',
          valueType: [CalculatorArgumentValueTypeEnum.INT],
          type: CalculatorArgumentTypeEnum.CONSTANT
        }
      ],
      restArguments: [],
      minArguments: 2,
      maxArguments: 2
    },
    output: { name: 'result', type: CalculatorOutputValueTypeEnum.FLOAT }
  },
  {
    name: 'ts_sum',
    description: '计算过去 d 个周期内的总和。',
    functionSignature: 'ts_sum(x, d)',
    keywords: ['累积和', '滚动求和', 'rolling sum', 'accumulation'],
    type: CalculatorTypeEnum.TIME_SERIES_OPERATIONS,
    inputs: {
      fixedArguments: [
        {
          name: 'x',
          valueType: [CalculatorArgumentValueTypeEnum.INT, CalculatorArgumentValueTypeEnum.FLOAT],
          type: CalculatorArgumentTypeEnum.BOTH
        },
        {
          name: 'd',
          valueType: [CalculatorArgumentValueTypeEnum.INT],
          type: CalculatorArgumentTypeEnum.CONSTANT
        }
      ],
      restArguments: [],
      minArguments: 2,
      maxArguments: 2
    },
    output: { name: 'result', type: CalculatorOutputValueTypeEnum.NUMBER }
  },
  {
    name: 'ts_rank',
    description: '计算当前值在过去 d 周期内的归一化排名（0到1之间）。',
    functionSignature: 'ts_rank(x, d)',
    keywords: ['历史排名', '历史分位', 'percentile', 'rank over time'],
    type: CalculatorTypeEnum.TIME_SERIES_OPERATIONS,
    inputs: {
      fixedArguments: [
        {
          name: 'x',
          valueType: [CalculatorArgumentValueTypeEnum.INT, CalculatorArgumentValueTypeEnum.FLOAT],
          type: CalculatorArgumentTypeEnum.BOTH
        },
        {
          name: 'd',
          valueType: [CalculatorArgumentValueTypeEnum.INT],
          type: CalculatorArgumentTypeEnum.CONSTANT
        }
      ],
      restArguments: [],
      minArguments: 2,
      maxArguments: 2
    },
    output: { name: 'result', type: CalculatorOutputValueTypeEnum.FLOAT }
  },
  {
    name: 'ts_quantile',
    description: '计算过去 d 个周期内数据的 q 分位数。',
    functionSignature: 'ts_quantile(x, d, q)',
    keywords: ['历史分位数', 'quantile'],
    type: CalculatorTypeEnum.TIME_SERIES_OPERATIONS,
    inputs: {
      fixedArguments: [
        {
          name: 'x',
          valueType: [CalculatorArgumentValueTypeEnum.INT, CalculatorArgumentValueTypeEnum.FLOAT],
          type: CalculatorArgumentTypeEnum.BOTH
        },
        {
          name: 'd',
          valueType: [CalculatorArgumentValueTypeEnum.INT],
          type: CalculatorArgumentTypeEnum.CONSTANT
        },
        {
          name: 'q',
          valueType: [CalculatorArgumentValueTypeEnum.FLOAT],
          type: CalculatorArgumentTypeEnum.CONSTANT
        }
      ],
      restArguments: [],
      minArguments: 3,
      maxArguments: 3
    },
    output: { name: 'result', type: CalculatorOutputValueTypeEnum.FLOAT }
  },
  {
    name: 'ts_argmin',
    description: '获取过去 d 周期内最小值发生的索引位置（距离现在的周期数）。',
    functionSignature: 'ts_argmin(x, d)',
    keywords: ['最小位置', 'argmin', 'index of min'],
    type: CalculatorTypeEnum.TIME_SERIES_OPERATIONS,
    inputs: {
      fixedArguments: [
        {
          name: 'x',
          valueType: [CalculatorArgumentValueTypeEnum.INT, CalculatorArgumentValueTypeEnum.FLOAT],
          type: CalculatorArgumentTypeEnum.BOTH
        },
        {
          name: 'd',
          valueType: [CalculatorArgumentValueTypeEnum.INT],
          type: CalculatorArgumentTypeEnum.CONSTANT
        }
      ],
      restArguments: [],
      minArguments: 2,
      maxArguments: 2
    },
    output: { name: 'result', type: CalculatorOutputValueTypeEnum.INT }
  },
  {
    name: 'ts_argmax',
    description: '获取过去 d 周期内最大值发生的索引位置（距离现在的周期数）。',
    functionSignature: 'ts_argmax(x, d)',
    keywords: ['最大位置', 'argmax', 'index of max'],
    type: CalculatorTypeEnum.TIME_SERIES_OPERATIONS,
    inputs: {
      fixedArguments: [
        {
          name: 'x',
          valueType: [CalculatorArgumentValueTypeEnum.INT, CalculatorArgumentValueTypeEnum.FLOAT],
          type: CalculatorArgumentTypeEnum.BOTH
        },
        {
          name: 'd',
          valueType: [CalculatorArgumentValueTypeEnum.INT],
          type: CalculatorArgumentTypeEnum.CONSTANT
        }
      ],
      restArguments: [],
      minArguments: 2,
      maxArguments: 2
    },
    output: { name: 'result', type: CalculatorOutputValueTypeEnum.INT }
  },
  {
    name: 'ts_corr',
    description: '计算两个序列 x 和 y 在过去 d 个周期内的相关系数。',
    functionSignature: 'ts_corr(x, y, d)',
    keywords: ['相关性', '联动', 'correlation', 'beta'],
    type: CalculatorTypeEnum.TIME_SERIES_OPERATIONS,
    inputs: {
      fixedArguments: [
        {
          name: 'x',
          valueType: [CalculatorArgumentValueTypeEnum.INT, CalculatorArgumentValueTypeEnum.FLOAT],
          type: CalculatorArgumentTypeEnum.BOTH
        },
        {
          name: 'y',
          valueType: [CalculatorArgumentValueTypeEnum.INT, CalculatorArgumentValueTypeEnum.FLOAT],
          type: CalculatorArgumentTypeEnum.BOTH
        },
        {
          name: 'd',
          valueType: [CalculatorArgumentValueTypeEnum.INT],
          type: CalculatorArgumentTypeEnum.CONSTANT
        }
      ],
      restArguments: [],
      minArguments: 3,
      maxArguments: 3
    },
    output: { name: 'result', type: CalculatorOutputValueTypeEnum.FLOAT }
  },
  {
    name: 'ts_cumsum',
    description: '计算从开始至今的累积和。',
    functionSignature: 'ts_cumsum(x)',
    keywords: ['累计', '历史总和', 'cumulative sum'],
    type: CalculatorTypeEnum.TIME_SERIES_OPERATIONS,
    inputs: {
      fixedArguments: [{
        name: 'x',
        valueType: [CalculatorArgumentValueTypeEnum.INT, CalculatorArgumentValueTypeEnum.FLOAT],
        type: CalculatorArgumentTypeEnum.BOTH
      }],
      restArguments: [],
      minArguments: 1,
      maxArguments: 1
    },
    output: { name: 'result', type: CalculatorOutputValueTypeEnum.NUMBER }
  },
  {
    name: 'delay',
    description: '获取 d 个周期之前的值。',
    functionSignature: 'delay(x, d)',
    keywords: ['昨天', '前推', '滞后', '引用过去', 'lag', 'shift', 'previous'],
    type: CalculatorTypeEnum.TIME_SERIES_OPERATIONS,
    inputs: {
      fixedArguments: [
        {
          name: 'x',
          valueType: [
            CalculatorArgumentValueTypeEnum.BOOL,
            CalculatorArgumentValueTypeEnum.FLOAT,
            CalculatorArgumentValueTypeEnum.INT,
            CalculatorArgumentValueTypeEnum.STRING,
            CalculatorArgumentValueTypeEnum.GROUP
          ],
          type: CalculatorArgumentTypeEnum.BOTH
        },
        {
          name: 'd',
          valueType: [CalculatorArgumentValueTypeEnum.INT],
          type: CalculatorArgumentTypeEnum.CONSTANT
        }
      ],
      restArguments: [],
      minArguments: 2,
      maxArguments: 2
    },
    output: { name: 'result', type: CalculatorOutputValueTypeEnum.ANY } // Assuming ANY maps to FLOAT usually
  },
  {
    name: 'delta',
    description: '计算当前值与 d 个周期之前值的差。即 x(t) - x(t-d)。',
    functionSignature: 'delta(x, d)',
    keywords: ['变动量', '涨跌额', '差分', 'diff', 'change'],
    type: CalculatorTypeEnum.TIME_SERIES_OPERATIONS,
    inputs: {
      fixedArguments: [
        {
          name: 'x',
          valueType: [CalculatorArgumentValueTypeEnum.INT, CalculatorArgumentValueTypeEnum.FLOAT],
          type: CalculatorArgumentTypeEnum.BOTH
        },
        {
          name: 'd',
          valueType: [CalculatorArgumentValueTypeEnum.INT],
          type: CalculatorArgumentTypeEnum.CONSTANT
        }
      ],
      restArguments: [],
      minArguments: 2,
      maxArguments: 2
    },
    output: { name: 'result', type: CalculatorOutputValueTypeEnum.NUMBER }
  },
  {
    name: 'returns',
    description: '计算 d 个周期的收益率。即 (x(t) - x(t-d)) / x(t-d)。',
    functionSignature: 'returns(x, d)',
    keywords: ['涨跌幅', '收益率', '回报率', 'percentage change', 'roc'],
    type: CalculatorTypeEnum.TIME_SERIES_OPERATIONS,
    inputs: {
      fixedArguments: [
        {
          name: 'x',
          valueType: [CalculatorArgumentValueTypeEnum.INT, CalculatorArgumentValueTypeEnum.FLOAT],
          type: CalculatorArgumentTypeEnum.BOTH
        },
        {
          name: 'd',
          valueType: [CalculatorArgumentValueTypeEnum.INT],
          type: CalculatorArgumentTypeEnum.CONSTANT
        }
      ],
      restArguments: [],
      minArguments: 2,
      maxArguments: 2
    },
    output: { name: 'result', type: CalculatorOutputValueTypeEnum.FLOAT }
  },
  {
    name: 'cross_over',
    description: '判断序列 A 是否穿越序列 B。',
    functionSignature: 'cross_over(A, B, direction)',
    keywords: ['金叉', '死叉', '上穿', '下穿', '突破', '跌破', 'golden cross', 'death cross'],
    type: CalculatorTypeEnum.TIME_SERIES_OPERATIONS,
    inputs: {
      fixedArguments: [
        {
          name: 'A',
          valueType: [CalculatorArgumentValueTypeEnum.INT, CalculatorArgumentValueTypeEnum.FLOAT],
          type: CalculatorArgumentTypeEnum.BOTH
        },
        {
          name: 'B',
          valueType: [CalculatorArgumentValueTypeEnum.INT, CalculatorArgumentValueTypeEnum.FLOAT],
          type: CalculatorArgumentTypeEnum.BOTH
        },
        {
          name: 'direction',
          valueType: [CalculatorArgumentValueTypeEnum.STRING],
          type: CalculatorArgumentTypeEnum.CONSTANT
        }
      ],
      restArguments: [],
      minArguments: 3,
      maxArguments: 3
    },
    output: { name: 'result', type: CalculatorOutputValueTypeEnum.BOOL }
  },
  {
    name: 'ts_all',
    description: '判断过去 d 周期内，布尔条件 cond 是否全部为真。',
    functionSignature: 'ts_all(cond, d)',
    keywords: ['持续', '连续', '一直', 'all true', 'every'],
    type: CalculatorTypeEnum.TIME_SERIES_OPERATIONS,
    inputs: {
      fixedArguments: [
        {
          name: 'cond',
          valueType: [CalculatorArgumentValueTypeEnum.BOOL],
          type: CalculatorArgumentTypeEnum.BOTH
        },
        {
          name: 'd',
          valueType: [CalculatorArgumentValueTypeEnum.INT],
          type: CalculatorArgumentTypeEnum.CONSTANT
        }
      ],
      restArguments: [],
      minArguments: 2,
      maxArguments: 2
    },
    output: { name: 'result', type: CalculatorOutputValueTypeEnum.BOOL }
  },
  {
    name: 'ts_any',
    description: '判断过去 d 周期内，布尔条件 cond 是否至少有一次为真。',
    functionSignature: 'ts_any(cond, d)',
    keywords: ['发生过', '曾经', '至少一次', 'any true', 'exist'],
    type: CalculatorTypeEnum.TIME_SERIES_OPERATIONS,
    inputs: {
      fixedArguments: [
        {
          name: 'cond',
          valueType: [CalculatorArgumentValueTypeEnum.BOOL],
          type: CalculatorArgumentTypeEnum.BOTH
        },
        {
          name: 'd',
          valueType: [CalculatorArgumentValueTypeEnum.INT],
          type: CalculatorArgumentTypeEnum.CONSTANT
        }
      ],
      restArguments: [],
      minArguments: 2,
      maxArguments: 2
    },
    output: { name: 'result', type: CalculatorOutputValueTypeEnum.BOOL }
  },
  {
    name: 'ts_count',
    description: '计算过去 d 周期内，布尔条件 cond 为真的总次数。',
    functionSignature: 'ts_count(cond, d)',
    keywords: ['次数', '发生频率', '计数', 'count occurrences'],
    type: CalculatorTypeEnum.TIME_SERIES_OPERATIONS,
    inputs: {
      fixedArguments: [
        {
          name: 'cond',
          valueType: [CalculatorArgumentValueTypeEnum.BOOL],
          type: CalculatorArgumentTypeEnum.BOTH
        },
        {
          name: 'd',
          valueType: [CalculatorArgumentValueTypeEnum.INT],
          type: CalculatorArgumentTypeEnum.CONSTANT
        }
      ],
      restArguments: [],
      minArguments: 2,
      maxArguments: 2
    },
    output: { name: 'result', type: CalculatorOutputValueTypeEnum.INT }
  },
  {
    name: 'ts_last_true',
    description: '计算距离上一次条件 cond 为真的周期数。',
    functionSignature: 'ts_last_true(cond)',
    keywords: ['距离上次', '上次发生', 'days since'],
    type: CalculatorTypeEnum.TIME_SERIES_OPERATIONS,
    inputs: {
      fixedArguments: [{
        name: 'cond',
        valueType: [CalculatorArgumentValueTypeEnum.BOOL],
        type: CalculatorArgumentTypeEnum.BOTH
      }],
      restArguments: [],
      minArguments: 1,
      maxArguments: 1
    },
    output: { name: 'result', type: CalculatorOutputValueTypeEnum.INT }
  },
  {
    name: 'ts_mean_if',
    description: '在过去 d 周期内，仅当 cond 为真时，计算 x 的均值。',
    functionSignature: 'ts_mean_if(x, cond, d)',
    keywords: ['条件平均', '满足时平均', 'conditional mean'],
    type: CalculatorTypeEnum.TIME_SERIES_OPERATIONS,
    inputs: {
      fixedArguments: [
        {
          name: 'x',
          valueType: [CalculatorArgumentValueTypeEnum.INT, CalculatorArgumentValueTypeEnum.FLOAT],
          type: CalculatorArgumentTypeEnum.BOTH
        },
        {
          name: 'cond',
          valueType: [CalculatorArgumentValueTypeEnum.BOOL],
          type: CalculatorArgumentTypeEnum.BOTH
        },
        {
          name: 'd',
          valueType: [CalculatorArgumentValueTypeEnum.INT],
          type: CalculatorArgumentTypeEnum.CONSTANT
        }
      ],
      restArguments: [],
      minArguments: 3,
      maxArguments: 3
    },
    output: { name: 'result', type: CalculatorOutputValueTypeEnum.FLOAT }
  },
  {
    name: 'vwap',
    description: '计算过去 d 个周期内的 VWAP。',
    functionSignature: 'vwap(d)',
    keywords: ['均价', 'vwap', 'volume weighted average price'],
    type: CalculatorTypeEnum.TIME_SERIES_OPERATIONS,
    inputs: {
      fixedArguments: [{
        name: 'd',
        valueType: [CalculatorArgumentValueTypeEnum.INT],
        type: CalculatorArgumentTypeEnum.CONSTANT
      }],
      restArguments: [],
      minArguments: 1,
      maxArguments: 1
    },
    output: { name: 'result', type: CalculatorOutputValueTypeEnum.FLOAT }
  },

  // ==================================================
  // 第三部分：截面与分组运算
  // ==================================================
  {
    name: 'cs_rank',
    description: '在同一时间点上，计算该股票在所有股票中的排名（归一化到 0-1）。',
    functionSignature: 'cs_rank(x)',
    keywords: ['全市场排名', '横向排名', 'rank', 'cross-sectional rank'],
    type: CalculatorTypeEnum.CROSS_SECTIONAL_OR_GROUPED_OPERATIONS,
    inputs: {
      fixedArguments: [{
        name: 'x',
        valueType: [CalculatorArgumentValueTypeEnum.INT, CalculatorArgumentValueTypeEnum.FLOAT],
        type: CalculatorArgumentTypeEnum.BOTH
      }],
      restArguments: [],
      minArguments: 1,
      maxArguments: 1
    },
    output: { name: 'result', type: CalculatorOutputValueTypeEnum.FLOAT }
  },
  {
    name: 'cs_zscore',
    description: '在同一时间点上，对数据进行 Z-Score 标准化（减均值除以标准差）。',
    functionSignature: 'cs_zscore(x)',
    keywords: ['标准化', '去量纲', 'standardize', 'normalize'],
    type: CalculatorTypeEnum.CROSS_SECTIONAL_OR_GROUPED_OPERATIONS,
    inputs: {
      fixedArguments: [{
        name: 'x',
        valueType: [CalculatorArgumentValueTypeEnum.INT, CalculatorArgumentValueTypeEnum.FLOAT],
        type: CalculatorArgumentTypeEnum.BOTH
      }],
      restArguments: [],
      minArguments: 1,
      maxArguments: 1
    },
    output: { name: 'result', type: CalculatorOutputValueTypeEnum.FLOAT }
  },
  {
    name: 'cs_demean',
    description: '在同一时间点上，减去全市场平均值。',
    functionSignature: 'cs_demean(x)',
    keywords: ['去均值', '相对强度', 'demean', 'relative value'],
    type: CalculatorTypeEnum.CROSS_SECTIONAL_OR_GROUPED_OPERATIONS,
    inputs: {
      fixedArguments: [{
        name: 'x',
        valueType: [CalculatorArgumentValueTypeEnum.INT, CalculatorArgumentValueTypeEnum.FLOAT],
        type: CalculatorArgumentTypeEnum.BOTH
      }],
      restArguments: [],
      minArguments: 1,
      maxArguments: 1
    },
    output: { name: 'result', type: CalculatorOutputValueTypeEnum.FLOAT }
  },
  {
    name: 'cs_quantile',
    description: '在同一时间点上，计算数据在 q 分位数上的值。',
    functionSignature: 'cs_quantile(x, q)',
    keywords: ['截面分位', '市场水位', 'cross-sectional quantile'],
    type: CalculatorTypeEnum.CROSS_SECTIONAL_OR_GROUPED_OPERATIONS,
    inputs: {
      fixedArguments: [
        {
          name: 'x',
          valueType: [CalculatorArgumentValueTypeEnum.INT, CalculatorArgumentValueTypeEnum.FLOAT],
          type: CalculatorArgumentTypeEnum.BOTH
        },
        {
          name: 'q',
          valueType: [CalculatorArgumentValueTypeEnum.FLOAT],
          type: CalculatorArgumentTypeEnum.CONSTANT
        }
      ],
      restArguments: [],
      minArguments: 2,
      maxArguments: 2
    },
    output: { name: 'result', type: CalculatorOutputValueTypeEnum.FLOAT }
  },
  {
    name: 'cs_corr',
    description: '在同一时间点上，计算全市场所有股票中 A 和 B 的相关系数。',
    functionSignature: 'cs_corr(A, B, G)',
    keywords: ['截面相关', 'cross-sectional correlation'],
    type: CalculatorTypeEnum.CROSS_SECTIONAL_OR_GROUPED_OPERATIONS,
    inputs: {
      fixedArguments: [
        {
          name: 'A',
          valueType: [CalculatorArgumentValueTypeEnum.INT, CalculatorArgumentValueTypeEnum.FLOAT],
          type: CalculatorArgumentTypeEnum.BOTH
        },
        {
          name: 'B',
          valueType: [CalculatorArgumentValueTypeEnum.INT, CalculatorArgumentValueTypeEnum.FLOAT],
          type: CalculatorArgumentTypeEnum.BOTH
        },
        {
          name: 'G',
          valueType: [CalculatorArgumentValueTypeEnum.GROUP],
          type: CalculatorArgumentTypeEnum.BOTH
        }
      ],
      restArguments: [],
      minArguments: 2,
      maxArguments: 3
    },
    output: { name: 'result', type: CalculatorOutputValueTypeEnum.FLOAT }
  },
  {
    name: 'group_mean',
    description: '在截面内，按照 G 分组计算 x 的平均值（例如计算行业平均）。',
    functionSignature: 'group_mean(x, G)',
    keywords: ['行业平均', '板块平均', '分组平均', 'group average'],
    type: CalculatorTypeEnum.CROSS_SECTIONAL_OR_GROUPED_OPERATIONS,
    inputs: {
      fixedArguments: [
        {
          name: 'x',
          valueType: [CalculatorArgumentValueTypeEnum.INT, CalculatorArgumentValueTypeEnum.FLOAT],
          type: CalculatorArgumentTypeEnum.BOTH
        },
        {
          name: 'G',
          valueType: [CalculatorArgumentValueTypeEnum.GROUP],
          type: CalculatorArgumentTypeEnum.BOTH
        }
      ],
      restArguments: [],
      minArguments: 2,
      maxArguments: 2
    },
    output: { name: 'result', type: CalculatorOutputValueTypeEnum.FLOAT }
  },
  {
    name: 'group_std',
    description: '在截面内，按照 G 分组计算 x 的标准差。',
    functionSignature: 'group_std(x, G)',
    keywords: ['组内离散度', '行业波动', 'group std'],
    type: CalculatorTypeEnum.CROSS_SECTIONAL_OR_GROUPED_OPERATIONS,
    inputs: {
      fixedArguments: [
        {
          name: 'x',
          valueType: [CalculatorArgumentValueTypeEnum.INT, CalculatorArgumentValueTypeEnum.FLOAT],
          type: CalculatorArgumentTypeEnum.BOTH
        },
        {
          name: 'G',
          valueType: [CalculatorArgumentValueTypeEnum.GROUP],
          type: CalculatorArgumentTypeEnum.BOTH
        }
      ],
      restArguments: [],
      minArguments: 2,
      maxArguments: 2
    },
    output: { name: 'result', type: CalculatorOutputValueTypeEnum.FLOAT }
  },
  {
    name: 'group_sum',
    description: '在截面内，按照 G 分组计算 x 的总和。',
    functionSignature: 'group_sum(x, G)',
    keywords: ['组内总和', '行业总值', 'group sum'],
    type: CalculatorTypeEnum.CROSS_SECTIONAL_OR_GROUPED_OPERATIONS,
    inputs: {
      fixedArguments: [
        {
          name: 'x',
          valueType: [CalculatorArgumentValueTypeEnum.INT, CalculatorArgumentValueTypeEnum.FLOAT],
          type: CalculatorArgumentTypeEnum.BOTH
        },
        {
          name: 'G',
          valueType: [CalculatorArgumentValueTypeEnum.GROUP],
          type: CalculatorArgumentTypeEnum.BOTH
        }
      ],
      restArguments: [],
      minArguments: 2,
      maxArguments: 2
    },
    output: { name: 'result', type: CalculatorOutputValueTypeEnum.FLOAT }
  },
  {
    name: 'cs_group_neutralize',
    description: '在截面内，减去该股票所属组（如行业）的平均值。',
    functionSignature: 'cs_group_neutralize(x, G)',
    keywords: ['行业中性化', '风格中性化', 'neutralize'],
    type: CalculatorTypeEnum.CROSS_SECTIONAL_OR_GROUPED_OPERATIONS,
    inputs: {
      fixedArguments: [
        {
          name: 'x',
          valueType: [CalculatorArgumentValueTypeEnum.INT, CalculatorArgumentValueTypeEnum.FLOAT],
          type: CalculatorArgumentTypeEnum.BOTH
        },
        {
          name: 'G',
          valueType: [CalculatorArgumentValueTypeEnum.GROUP],
          type: CalculatorArgumentTypeEnum.BOTH
        }
      ],
      restArguments: [],
      minArguments: 2,
      maxArguments: 2
    },
    output: { name: 'result', type: CalculatorOutputValueTypeEnum.FLOAT }
  },
  {
    name: 'cs_group_rank',
    description: '在截面内，计算该股票在所属组内的归一化排名。',
    functionSignature: 'cs_group_rank(x, G)',
    keywords: ['行业内排名', '组内排名', 'group rank'],
    type: CalculatorTypeEnum.CROSS_SECTIONAL_OR_GROUPED_OPERATIONS,
    inputs: {
      fixedArguments: [
        {
          name: 'x',
          valueType: [CalculatorArgumentValueTypeEnum.INT, CalculatorArgumentValueTypeEnum.FLOAT],
          type: CalculatorArgumentTypeEnum.BOTH
        },
        {
          name: 'G',
          valueType: [CalculatorArgumentValueTypeEnum.GROUP],
          type: CalculatorArgumentTypeEnum.BOTH
        }
      ],
      restArguments: [],
      minArguments: 2,
      maxArguments: 2
    },
    output: { name: 'result', type: CalculatorOutputValueTypeEnum.FLOAT }
  },
  {
    name: 'cs_group_zscore',
    description: '在截面内，计算该股票在所属组内的 Z-Score。',
    functionSignature: 'cs_group_zscore(x, G)',
    keywords: ['行业内标准化', '组内标准化', 'group zscore'],
    type: CalculatorTypeEnum.CROSS_SECTIONAL_OR_GROUPED_OPERATIONS,
    inputs: {
      fixedArguments: [
        {
          name: 'x',
          valueType: [CalculatorArgumentValueTypeEnum.INT, CalculatorArgumentValueTypeEnum.FLOAT],
          type: CalculatorArgumentTypeEnum.BOTH
        },
        {
          name: 'G',
          valueType: [CalculatorArgumentValueTypeEnum.GROUP],
          type: CalculatorArgumentTypeEnum.BOTH
        }
      ],
      restArguments: [],
      minArguments: 2,
      maxArguments: 2
    },
    output: { name: 'result', type: CalculatorOutputValueTypeEnum.FLOAT }
  }
] as CalculatorType[];