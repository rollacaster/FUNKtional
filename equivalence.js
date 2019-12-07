const daggy = require('daggy')

// type Equivalence a = a -> a -> Bool
// `a` is the type of *BOTH INPUTS*!
const Equivalence = daggy.tagged('Equivalence', 'f')

// Add a pre-processor for the variables.
Equivalence.prototype.contramap = function(g) {
  return Equivalence((x, y) => this.f(g(x), g(y)))
}

module.exports = { Equivalence }
