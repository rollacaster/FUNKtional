const daggy = require('daggy')

const Maybe = daggy.taggedSum('Maybe', {
  Just: ['x'],
  Nothing: []
})

const { Just, Nothing } = Maybe

// Applicative
Maybe.prototype.of = function(x) {
  return new Just(x)
}

// Apply
Maybe.prototype.ap = function(that) {
  return this.cata({
    Just: f => that.map(f),
    Nothing: () => Nothing
  })
}

// Functor
Maybe.prototype.map = function(f) {
  return this.cata({
    Just: x => Just(f(x)),
    Nothing: () => Nothing
  })
}

// Alt
Maybe.prototype.alt = function(that) {
  return this.cata({
    Just: _ => this,
    Nothing: _ => that
  })
}

// Foldable
// reduce :: Maybe a
//        ~> ((b, a) -> b, b) -> b
Maybe.prototype.reduce = function(f, acc) {
  return this.cata({
    // Call the function...
    Just: x => f(acc, x),

    // ... or don't!
    Nothing: () => acc
  })
}

// Traversable
// Keep the nothing OR map in the Just!
// traverse :: Applicative f, Traversable t
//          => t a -> (TypeRep f, a -> f b)
//          -> f (t b)
Maybe.prototype.traverse = function(T, f) {
  return this.cata({
    Just: x => f(x).map(Maybe.Just),
    Nothing: () => T.of(Maybe.Nothing)
  })
}

// + join :: Maybe (Maybe a) ~> Maybe a
Maybe.prototype.join = function() {
  return this.cata({
    Just: x => x,
    Nothing: () => Nothing
  })
}

//+ chain :: Maybe a ~> (a -> Maybe b)
//+                  -> Maybe b
Maybe.prototype.chain = function(f) {
  return this.cata({
    Just: f,
    Nothing: () => this // Do nothing
  })
}

module.exports = { Maybe, Nothing, Just }
