import dark from './dark';
import { hexToRgb } from './utils';

export const color = {
  dark
}

export const cssVars = Object.keys(dark).reduce((pre, cur) => {
  return pre += `\n  --dark-${cur}:${hexToRgb(dark[cur as keyof typeof dark])};`
}, '')
