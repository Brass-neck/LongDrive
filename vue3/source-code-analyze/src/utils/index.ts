export const isObject = (val) => typeof val == 'object' && val !== null
export const isSymbol = (val) => typeof val == 'symbol'
export const isString = (val) => typeof val == 'string'
export const isFunction = (val) => typeof val == 'function'

export const isArray = (val) => Array.isArray(val)
export const isInteger = (val) => '' + parseInt(val, 10) == val

export const hasOwnProperty = (val, key) => Object.prototype.hasOwnProperty.call(val, key)
export const hasChanged = (val, oldVal) => val !== oldVal
