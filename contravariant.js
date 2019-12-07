const { Predicate } = require('./predicate')
const { ToString } = require('./to-string')
const { Equivalence } = require('./equivalence')
const { Comparison } = require('./comparison')

// isEven :: Predicate Int
const isEven = Predicate(x => x % 2 === 0)

// Take a string, run .length, then isEven.
// lengthIsEven :: Predicate String
const lengthIsEven = isEven.contramap(x => x.length)

// Convert an int to a string.
// intToString :: ToString Int
const intToString = ToString(x => 'int(' + x + ')').contramap(x => x | 0) // Optional

// Convert an array of strings to a string.
// stringArrayToString :: ToString [String]
const stringArrayToString = ToString(x => '[ ' + x + ' ]').contramap(x =>
  x.join(', ')
)

// Given a ToString instance for a type,
// convert an array of a type to a string.
// arrayToString :: ToString a
//               -> ToString [a]
const arrayToString = t => stringArrayToString.contramap(x => x.map(t.f))

// Convert an integer array to a string.
// intsToString :: ToString [Int]
const intsToString = arrayToString(intToString)

// Aaand they compose! 2D int array:
// matrixToString :: ToString [[Int]]
const matrixToString = arrayToString(intsToString)

// "[ [ int(1), int(2), int(3) ] ]"
matrixToString.f([[1, 3, 4]])

const stringLengthComparison = Comparison((x, y) => x - y).contramap(
  x => x.length
)
stringLengthComparison.f('a', 'aa')

// Do a case-insensitive equivalence check.
// searchCheck :: Equivalence String
const searchCheck =
  // Basic equivalence
  Equivalence((x, y) => x === y)
    // Remove symbols
    .contramap(x => x.replace(/\W+/, ''))
    // Lowercase alpha
    .contramap(x => x.toLowerCase())

// And some tests...
console.log(searchCheck.f('Hello', 'HEllO!')) // true
console.log(searchCheck.f('world', 'werld')) // false
