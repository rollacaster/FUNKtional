const daggy = require('daggy')

// type Predicate a = a -> Bool
// The `a` is the *INPUT* to the function!
const Predicate = daggy.tagged('Predicate', ['f'])

// Contravariant
// Make a Predicate that runs `f` to get
// from `b` to `a`, then uses the original
// Predicate function!
// contramap :: Predicate a ~> (b -> a)
//                          -> Predicate b
Predicate.prototype.contramap = function(f) {
  return Predicate(x => this.f(f(x)))
}

Predicate.prototype.map = function(f) {
  return Predicate(x => f(this.f(x)))
}

module.exports = { Predicate }
