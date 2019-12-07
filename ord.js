const { List } = require('./setoid.js')
const { Cons, Nil } = List

// Greater than. The OPPOSITE of lte.
// gt :: Ord a => a -> a -> Boolean
const gt = function(x, y) {
  return !lte(x, y)
}

// Greater than or equal.
// gte :: Ord a => a -> a -> Boolean
const gte = function(x, y) {
  return gt(x, y) || x.equals(y)
}

// Less than. The OPPOSITE of gte!
// lt :: Ord a => a -> a -> Boolean
const lt = function(x, y) {
  return !gte(x, y)
}

// And we already have lte!
// lte :: Ord a => a -> a -> Boolean
const lte = function(x, y) {
  return x.lte(y)
}

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

// Just for demo - forgive me!
Number.prototype.equals = function(that) {
  return this == that
}

Number.prototype.lte = function(that) {
  return this <= that
}

Cons(1, Cons(2, Nil)).lte(Cons(1, Nil)) // false
Cons(1, Nil).lte(Cons(1, Cons(2, Nil))) // true

// sort :: Ord a => [a] ~> [a]
List.prototype.sort = function() {
  const partition = (pivot, list, lower = Nil, higher = Nil) =>
    list.cata({
      Cons: (head, tail) =>
        head.lte(pivot)
          ? partition(pivot, tail, lower.concat(Cons(head, Nil)), higher)
          : partition(pivot, tail, lower, higher.concat(Cons(head, Nil))),
      Nil: () => [lower, higher]
    })

  return this.cata({
    Cons: (head, tail) => {
      const [lower, higher] = partition(head, tail)
      return lower.sort().concat(Cons(head, higher.sort()))
    },
    Nil: () => this
  })
}

console.log(
  JSON.stringify(
    Cons(5, Cons(2, Cons(3, Cons(6, Cons(1, Cons(4, Nil)))))).sort()
  )
)
