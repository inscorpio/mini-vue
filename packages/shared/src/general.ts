export const getType = value => Object.prototype.toString.call(value).slice(8, -1)

export const isObject = (value: unknown) => value !== null && typeof value === 'object'

export const extend = Object.assign
