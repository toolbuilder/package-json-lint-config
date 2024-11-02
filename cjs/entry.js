const defaultObject = require('./index.js').default

// The Rollup produces named exports - no default
// so remap it in this module
module.exports = defaultObject
