const { Maybe, Nothing, Just } = require('./maybe')

// append :: a -> [a] -> [a]
const append = y => xs => xs.concat([y])

// There's that sneaky lift2 again!
// lift2 :: Applicative f
//       => (  a,     b,     c)
//       ->  f a -> f b -> f c
const lift2 = (f, a, b) => a.map(f).ap(b)

console.log(lift2(x => y => x + y, Just(2), Just(3)))

// insideOut :: Applicative f
//           => [f a] -> f [a]
const insideOut = (T, xs) =>
  xs.reduce((acc, x) => lift2(append, x, acc), T.prototype.of([])) // To start us off!

// For example...
// Just [2, 10, 3]
// console.log(insideOut(Maybe, [Just(2), Just(10), Just(3)]))

// Nothing
console.log(Nothing.is(insideOut(Maybe, [Just(2), Nothing, Just(3)])))
