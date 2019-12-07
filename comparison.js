const daggy = require('daggy')

const Comparison = daggy.tagged('Comparison', 'f')

Comparison.prototype.contramap = function(g) {
  return Comparison(
    (x, y) => (this.f(g(x), g(y)) < 0 ? 1 : this.f(g(x), g(y)) > 0 ? -1 : 0)
  )
}

module.exports = { Comparison }
