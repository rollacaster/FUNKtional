const daggy = require('daggy')

// Type Compose f g a = Compose (f (g a))
const Compose = (F, G) => {
  const Compose_ = daggy.tagged('Compose', ['stack'])

  // compose(F.of, G.of)
  Compose_.of = x => Compose_(F.of(G.of(x)))

  // Basically map(map(f))
  Compose_.map = function(f) {
    return Compose_(this.stack.map(x => x.map(f)))
  }

  // Basically lift2(ap, this, fs)
  Compose_.ap = function(fs) {
    return Compose_(this.stack.map(x => f => x.ap(f)).ap(fs.stack))
  }
}

module.exports = { Compose }
