const daggy = require('daggy')
const { Maybe, Just } = require('./maybe')

// Just(3) - note the "Nothing"s are
// usually the result of some functions.
// console.log(Nothing.alt(Nothing).alt(Just(3)).toString())
// console.log(Just(2).alt(Just(3)).map(x => x * x))
// console.log(Just(2).alt(Nothing).alt(Just(3)))

// The value MUST be an Alt-implementer.
const Alt = daggy.tagged('Alt', ['value'])

// Alt is a valid semigroup!
Alt.prototype.concat = function(that) {
  return Alt(this.value.alt(that.value))
}

// The value MUST be a Plus-implementer.
// And, as usual, we need a TypeRep...
const Plus = T => {
  const Plus_ = daggy.tagged('Plus', ['value'])

  // Plus is a valid semigroup...
  Plus_.prototype.concat = function(that) {
    return Plus(this.value.alt(that.value))
  }

  // ... and a valid monoid!
  Plus_.empty = () => Plus_(T.zero())
}

// console.log(Just(2).ap(Just(x => x * x).alt(Just(x => x / x))))
console.log(Just(2).ap(Just(x => x * x).alt(Just(2).ap(Just(x => x / x)))))
