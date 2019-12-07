const daggy = require('daggy')

// type Step b a = Done b | Loop a
const { Loop, Done } = daggy.taggedSum('Step', {
  Done: ['b'],
  Loop: ['a']
})

module.exports = { Loop, Done }
