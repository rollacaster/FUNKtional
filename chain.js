const { Just, Nothing } = require('./maybe')
const { Left, Right } = require('./either')
const { Pair } = require('./pair')
require('./array')

//+ prop :: String -> StrMap a -> Maybe a
const prop = k => xs => (k in xs ? Just(xs[k]) : Nothing)

const data = { a: { b: { c: 2 } } }
const map = f => xs => xs.map(f)

console.log(
  prop('a')(data) // Just({ b: { c: 2 } })
    .chain(prop('b')) // Just({ c: 2 })
    .chain(prop('c')) // Just(2)
)

prop('a')(data) // Just({ b: { c: 2 } })
  .map(prop('badger'))
  .join() // Nothing
  .map(prop('c'))
  .join() // Nothing

const sqrt = x => (x < 0 ? Left('Hey, no!') : Right(Math.sqrt(x)))

Right(16)
  .chain(sqrt) // Right(4)
  .chain(sqrt) // Right(2)

Right(81)
  .chain(sqrt) // Right(9)
  .map(x => -x) // Right(-9) 😮
  .chain(sqrt) // Left('Hey, no!')
  .map(x => -x) // Left('Hey, no!')

Left('eep').chain(sqrt) // Left('eep')

// NB: **totally** made up.
const flights = {
  ATL: ['LAX', 'DFW'],
  ORD: ['DEN'],
  LAX: ['JFK', 'ATL'],
  DEN: ['ATL', 'ORD', 'DFW'],
  JFK: ['LAX', 'DEN']
}

//- Where can I go from airport X?
//+ whereNext :: String -> [String]
const whereNext = x => flights[x] || []

// JFK, ATL
console.log(
  whereNext('LAX')
    // LAX, DEN, LAX, DFW
    .chain(whereNext)
    // JFK, ATL, ATL, ORD, DFW, JFK, ATL
    .chain(whereNext)
)

//- An ugly implementation for range.
//+ range :: (Int, Int) -> [Int]
const range = (from, to) => [...Array(to - from)].map((_, i) => i + from)

//- The example from that link in JS.
//+ factors :: Int -> [Pair Int Int]
const factors = n =>
  range(1, n).chain(a =>
    range(1, a).chain(b => (a * b !== n ? [] : [Pair(a, b)]))
  )

// (4, 5), (2, 10)
console.log(factors(20))
