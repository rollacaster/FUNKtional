const daggy = require('daggy')

const { Loop } = require('./step')

const Pair = T => {
  const Pair_ = daggy.tagged('Pair', ['_1', '_2'])

  Pair_.prototype.map = function(f) {
    return Pair_(this._1, f(this._2))
  }

  Pair_.prototype.ap = function(fs) {
    return Pair_(fs._1.concat(this._1), fs._2(this._2))
  }

  Pair_.prototype.chain = function(f) {
    const that = f(this._2)

    return Pair_(this._1.concat(that._1), that._2)
  }

  Pair_.prototype.traverse = function(_, f) {
    return f(this._2).map(x => Pair(this._1, x))
  }

  Pair_.of = x => Pair_(T.prototype.empty(), x)

  // chainRec
  //   :: Monoid m
  //   => (a -> Pair m (Step b a), a)
  //   -> (m, b)
  Pair_.chainRec = function(f, init) {
    // Start off "empty"
    let acc = T.prototype.empty()
    // We have to loop at least once
    let step = Loop(init)

    do {
      // Call `f` on `Loop`'s value
      const result = f(step.a)

      // Update the accumulator,
      // as well as the current value
      acc = acc.concat(result._1)
      step = result._2
    } while (Loop.is(step))

    // Pull out the `Done` value.
    return Pair_(acc, step.b)
  }

  return Pair_
}

module.exports = { Pair }
