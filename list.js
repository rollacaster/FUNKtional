const daggy = require('daggy')

const List = daggy.taggedSum('List', {
  Cons: ['head', 'tail'],
  Nil: []
})
const { Cons, Nil } = List
// Functor
List.prototype.map = function(f) {
  return this.cata({
    Cons: (head, tail) => List.Cons(f(head), tail.map(f)),

    Nil: () => List.Nil
  })
}

// Ord
// Recursive Ord definition for List!
// lte :: Ord a => [a] ~> [a] -> [a]
List.prototype.lte = function(that) {
  return this.cata({
    Cons: (head, tail) =>
      that.cata({
        Cons: (head_, tail_) =>
          head.equals(head_) ? tail.lte(tail_) : head.lte(head_),

        Nil: () => false
      }),

    Nil: () => true
  })
}

// A "static" method for convenience.
List.from = function(xs) {
  return xs.reduceRight((acc, x) => List.Cons(x, acc), List.Nil)
}

// And a conversion back for convenience!
List.prototype.toArray = function() {
  return this.cata({
    Cons: (x, acc) => [x, ...acc.toArray()],

    Nil: () => []
  })
}

// Check the lists' heads, then their tails
// equals :: Setoid a => [a] ~> [a] -> Bool
List.prototype.equals = function(that) {
  return this.cata({
    // Note the two different Setoid uses:
    Cons: (head, tail) => head.equals(that.head) && tail.equals(that.tail), // a // [a]

    Nil: () => that instanceof List.Nil
  })
}

// Semigroup
List.prototype.concat = function(that) {
  return this.cata({
    Cons: (head, tail) =>
      tail.cata({
        Cons: (head_, tail_) => Cons(head, Cons(head_, tail_).concat(that)),
        Nil: () => Cons(head, that)
      }),
    Nil: () => that
  })
}

module.exports = { List, Cons, Nil }
