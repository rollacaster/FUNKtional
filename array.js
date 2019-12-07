// Monoid
// [].concat([1, 2, 3])
//   === [1, 2, 3].concat([])
//   === [1, 2, 3]
Array.prototype.empty = () => []

// Apply
// Our implementation of ap.
// ap :: Array a ~> Array (a -> b) -> Array b
Array.prototype.ap = function(fs) {
  return [].concat(...fs.map(f => this.map(f)))
}

// Contravariant
Array.prototype.contramap = function(f) {
  return []
}

// lift2 :: Applicative f
//       => (  a,     b,     c)
//       ->  f a -> f b -> f c
const lift2 = (f, a, b) => b.ap(a.map(f))

// append :: a -> [a] -> [a]
const append = y => xs => xs.concat([y])

// Traversable
// traverse :: Applicative f, Traversable t
//          => t a -> (TypeRep f, a -> f b)
//          -> f (t b)
Array.prototype.traverse = function(T, f) {
  return this.reduce(
    //    Here's the map bit! vvvv
    (acc, x) => lift2(append, f(x), acc),
    T.prototype.of([])
  )
}

// chain :: Array a
//       ~> (a -> Array b)
//       -> Array b
Array.prototype.chain = function(f) {
  // Map, then concat the results.
  return [].concat(...this.map(f))
}

module.exports = { Array }
