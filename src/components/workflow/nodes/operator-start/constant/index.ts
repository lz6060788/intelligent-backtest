import { VarType, type Var } from "@/types";

export const SET_OUTPUT_VARIABLES = [
  {
    variable: 'adj_close',
    type: VarType.number,
  },
  {
    variable: 'adj_open',
    type: VarType.number,
  },
  {
    variable: 'adj_high',
    type: VarType.number,
  },
  {
    variable: 'adj_low',
    type: VarType.number,
  },
  {
    variable: 'adj_factor',
    type: VarType.number,
  },
  {
    variable: 'close',
    type: VarType.number,
  },
  {
    variable: 'open',
    type: VarType.number,
  },
  {
    variable: 'high',
    type: VarType.number,
  },
  {
    variable: 'low',
    type: VarType.number,
  },
  {
    variable: 'volume',
    type: VarType.number,
  },
  {
    variable: 'turnover',
    type: VarType.number,
  },
  {
    variable: 'turnover_rate',
    type: VarType.number,
  },
  {
    variable: 'avg_price',
    type: VarType.number,
  },
  {
    variable: 'high_limit',
    type: VarType.number,
  },
  {
    variable: 'low_limit',
    type: VarType.number,
  },
  {
    variable: 'is_paused',
    type: VarType.number,
  },
  {
    variable: 'is_st',
    type: VarType.number,
  },
] as Var[]