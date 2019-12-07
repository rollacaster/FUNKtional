const daggy = require('daggy')

const Either = daggy.taggedSum('Eigther', {
  Right: ['x'],
  Left: ['x']
})

const { Right, Left } = Either

// Applicative
Either.prototype.of = function(x) {
  return new Right(x)
}

// Functor
Either.prototype.map = function(f) {
  return this.cata({
    Right: x => Right(f(x)),
    Left: x => x
  })
}

// Apply
Either.prototype.ap = function(that) {
  return this.cata({
    Right: x =>
      that.cata({
        Right: f => Right(f(x)),
        Left: _ => that
      }),

    Left: _ => that
  })
}

// Foldable
// reduce :: Either e a
//        ~> ((b, a) -> b, b) -> b
Either.prototype.reduce = function(f, acc) {
  return this.cata({
    // Call the function...
    Right: x => f(acc, x),

    // Or don't!
    Left: _ => acc
  })
}

// chain :: Either e a
//       ~> (a -> Either e b)
//       -> Either e b
Either.prototype.chain = function(f) {
  return this.cata({
    Right: f,
    Left: _ => this // Do nothing
  })
}

module.exports = { Either, Right, Left }
