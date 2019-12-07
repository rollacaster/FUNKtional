const daggy = require('daggy')

// type ToString a :: a -> String
const ToString = daggy.tagged('ToString', 'f')

// Add a pre-processor to the pipeline.
ToString.prototype.contramap = function(f) {
  return ToString(x => this.f(f(x)))
}

module.exports = { ToString }
