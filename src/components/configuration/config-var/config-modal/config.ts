export const jsonObjectWrap = {
  type: 'object',
  properties: {},
  required: [],
  additionalProperties: true,
}

export const jsonConfigPlaceHolder = JSON.stringify(
  {
    foo: {
      a: 1,
    },
    bar: 2,
  }, null, 2,
)

export const arrayNumberWrap = {
  type: 'array',
  properties: [],
  minItems: -1,
  maxItems: -1,
}

export const arrayNumberPlaceHolder = JSON.stringify(
  [1, 2, 3],
  null, 2,
)

export const arrayStringWrap = {
  type: 'array',
  properties: [],
  minItems: -1,
  maxItems: -1,
}

export const arrayStringPlaceHolder = JSON.stringify(
  ['a', 'b', 'c'],
  null, 2,
)
