require('./function')

// (a -> b -> c) -> f a
//               -> f b
//               -> f c

// (a -> b -> c) -> Function a
//               -> Function b
//               -> Function c

// (a -> b -> c) -> ((->) x) a
//               -> ((->) x) b
//               -> ((->) x) c

// (a -> b -> c) -> (x -> a)
//               -> (x -> b)
//               -> (x -> c)

const lift2 = (f, a, b) => b.ap(a.map(f))

const myFunction = (x => x.length).map(x => x + 2).map(x => x / 2)

// Returns "7.5"
myFunction('Hello, world!')

// From the Ramda docs:
const divide = x => y => x / y

const sum = xs => xs.reduce((x, y) => x + y, 0)

const length = xs => xs.length

// divide(sum, length)
//   === 28 / 7 === 4
const average = lift2(divide, sum, length)
average([1, 2, 3, 4, 5, 6, 7])

// This generalises to liftN!
const lift3 = (f, a, b, c) => c.ap(b.ap(a.map(f)))

// Some password checks...

const longEnough = length.map(x => x > 8) // Functor!

const hasNumber = x => null !== x.match(/\d+/g)

const hasUppercase = x => null !== x.match(/[A-Z]+/g)

// Some combining function...
const and3 = x => y => z => x && y && z

// Combine the three functions with and3
const passwordCheck = lift3(and3, longEnough, hasNumber, hasUppercase)

passwordCheck('abcdef') // false
passwordCheck('abcdefghi') // false
passwordCheck('abcdefgh1') // false
passwordCheck('Abcdefgh1') // true

const myNextFunction = (x => x.length)
  .map(x => x + 2)
  .map(x => x / 2)
  .chain(x => s => 'started from the ' + s + ' now we ' + x)

// started from the Hello! now we 4
console.log(myNextFunction('Hello!'))
