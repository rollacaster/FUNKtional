const { Either, Right, Left } = require('./either')
const { Maybe, Just, Nothing } = require('./maybe')
const { Pair } = require('./pair')
const { BTree, Node, Leaf } = require('./btree')
require('./array')

// Don't worry, though: `sequence` can also
// be written as a super-simple `traverse`!
const sequence = (T, xs) => xs.traverse(T, x => x)

const toChar = n =>
  n < 0 || n > 25
    ? Left(n + ' is out of bounds!')
    : Right(String.fromCharCode(n + 65))

const lift2 = (f, a, b) => b.ap(a.map(f))

// Right(['A', 'B', 'C', 'D'])
// console.log(Right('A').map(append))
const append = x => xs => xs.concat([x])
// console.log(lift2(append, Right('a'), Right([])).toString())
// console.log(Right([]).ap(Right('a').map(append)))
// Right([]).ap(Right('A').map(x => xs => xs.concat([x])))
// console.log(Right([]).ap(Right(xs => xs.concat(['A']))))
console.log(
  Right('A')
    .map(append)
    .ap(Right([]))
    .toString()
)
// Right(xs => xs.concat([A])).ap(Right([]))
// console.log([0, 1, 2, 3].map(toChar))
// console.log([0, 1, 2, 3].traverse(Either, toChar))
// [0, 1, 2, 3].traverse(Either, toChar)
// [0, 1, 2, 3].reduce(([], 0) => lift2(append, toChar(0), Either([])))
// [0, 1, 2, 3].reduce(([], 0) => Either([]).ap(Right('A').map(append)))
// [0, 1, 2, 3].reduce(([], 0) => Either([]).ap(Right('A').map(append)))
// Left('-2 is out of bounds!')
// ;[0, 15, 21, -2].traverse(Either, toChar)

// console.log(
//   Just(2)
//     .traverse(Either, a => Right(a + 2))
//     .toString()
// )
// console.log(
//   Just(2)
//     .map(a => Right(a + 2))
//     .toString()
// )

// console.log(
//   Pair(Just(2), Just(3))
//     .traverse(undefined, x => Just(x + 2))
//     .toString()
// )

// console.log(
//   Pair(Just(2), Just(3))
//     .map(x => x + 2)
//     .toString()
// )

const MyTree = Node(
  Node(Leaf, 1, Node(Leaf, 2, Leaf)),
  3,
  Node(Node(Leaf, 4, Leaf), 5, Leaf)
)

// console.log(MyTree.toString())
// console.log(MyTree.map(a => Right(a + 2)).toString())
// console.log(MyTree.traverse(Either, a => Right(a + 2)).toString())
