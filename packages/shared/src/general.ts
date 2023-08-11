export const getType = value => Object.prototype.toString.call(value).slice(8, -1)

export const isObject = (value: unknown) => getType(value) === 'Object'

export const extend = Object.assign
