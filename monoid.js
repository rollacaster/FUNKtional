const daggy = require('daggy')
const { Pair } = require('./pair')

const {
  Sum,
  Product,
  Max,
  Min,
  All,
  Any,
  First,
  Last,
  Tuple
} = require('./semigroup')

// And so on...
Sum.empty = () => Sum(0)
Product.empty = () => Product(1)
Max.empty = () => Max(-Infinity)
Min.empty = () => Min(Infinity)
All.empty = () => All(true)
Any.empty = () => Any(false)

// BUT not every semigroup is a monoid...
First.empty = () => null // ???
Last.empty = () => null // ???

// A friendly neighbourhood monoid fold.
// fold :: Monoid m => (a -> m) -> [a] -> m
const fold = M => xs => xs.reduce((acc, x) => acc.concat(M(x)), M.empty())

// We can now use our monoids for (almost) all
// our array reduction needs!
fold(Sum)([1, 2, 3, 4, 5]).val // 15
fold(Product)([1, 2, 3]).val // 6
fold(Max)([9, 7, 11]).val // 11
fold(Sum)([]).val // 0 - ooer!

// In practice, you'd want a generator here...
// Non-tail-recursion is expensive in JS!
const chunk = xs =>
  xs.length < 5000 ? [xs] : [xs.slice(0, 5000), ...chunk(xs.slice(5000))]

// ... You get the idea.
const parallelMap = f => xs => xs.map(x => RunThisThingOnANewThread(f, x))
const RunThisThingOnANewThread = (f, x) => f(x)
// Chunk, fold in parallel, fold the result.
// In practice, this would probably be async.
const foldP = M => xs => fold(M)(parallelMap(fold(M))(chunk(xs)))

// With all that in place...

// Numbers from 0 to 999,999...
const bigList = [...Array(1e6)].map((_, i) => i)

// ... Ta-da! 499999500000
// Parallel-ready map/reduce; isn't it *neat*?
foldP(Sum)(bigList).val

// We now have a kind of "Pair factory"!
// Pair_ :: (Monoid a, Monoid b) =>
//   (TypeRep a, TypeRep b) -> (a, b) -> Pair a b
const Pair_ = (typeA, typeB) => {
  Pair.empty = () => Pair(typeA.empty(), typeB.empty())

  // You could write `concat` here and include
  // some type-checking in its logic!

  return Pair
}

// We can partially apply to get Pair
// constructors for specific types...
const MyPair = Pair_(Sum, Any)

// ... and these have valid empty() values!
// Pair(Sum(0), Any(False))
MyPair.empty()

// We can also call it directly.
// Pair(All(True), Max(-Infinity))
Pair_(All, Max).empty()

// concat :: (Semigroup b) =>
//   (a -> b) ~> (a -> b) -> (a -> b)
Function.prototype.concat = function(that) {
  return x => this(x).concat(that(x))
}

const fun1 = a => Product(a)
const fun2 = fun1.concat(b => Tuple(b, b))
