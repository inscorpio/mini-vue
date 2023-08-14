export const getType = value => Object.prototype.toString.call(value).slice(8, -1)

export const isObject = (value: unknown) => value !== null && typeof value === 'object'

export const extend = Object.assign

export const hasOwn = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key)

export const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)

export const camelize = (str: string) => str.replace(/-(\w)/g, (_, c: string) => c.toUpperCase())
