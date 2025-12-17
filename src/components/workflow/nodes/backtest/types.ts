import type { CommonNodeType, ValueSelector, VarType } from '@/types'

export const enum PriceType {
  OPEN = 'open',
  CLOSE = 'close',
}

export type SignalVariable = {
  isManual: boolean;
  value: string[] | ValueSelector;
}

export const enum RiskControlItemEnum {
  stop_loss = 'stop_loss',
  take_profit = 'take_profit',
  max_hold_days = 'max_hold_days',
  max_drawdown = 'max_drawdown',
}

export const enum RiskControlItemTypeEnum {
  constant = 'constant',
  variable = 'variable',
}

export type RiskControl = {
  [key in RiskControlItemEnum]?: {
    type: RiskControlItemTypeEnum;
    value: number | ValueSelector;
  };
}

export type BacktestNodeType = CommonNodeType & {
  ticker: string;
  start_date: string;
  end_date: string;
  price_type: PriceType;
  execution_signals: {
    open: SignalVariable;
    close: SignalVariable;
  };
  risk_control: RiskControl;
}
