const daggy = require('daggy')
const Pair = daggy.tagged('Pair', ['_1', '_2'])

const Store = daggy.tagged('Store', ['lookup', 'pointer'])

Store.prototype.seek = function(p) {
  return Store(this.lookup, p)
}

Store.prototype.peek = function(p) {
  return this.lookup(p)
}

Store.prototype.map = function(f) {
  const { lookup, pointer } = this

  return Store(lookup.map(f), pointer)
}

Store.prototype.extract = function(f) {
  return Store(p => f(Store(this.lookup, p)), this.pointer)
}

let start = [
  [true, true, false, false],
  [true, false, true, false],
  [true, false, false, true],
  [true, false, true, false]
]

const Game = Store(
  ({ _1: x, _2: y }) => (y in start && x in start[y] ? start[y][x] : false),
  Pair(0, 0)
)

const isSurvivor = store => {
  const { _1: x, _2: y } = store.pointer
  const neighbours = [
    Pair(x - 1, y - 1),
    Pair(x, y - 1),
    Pair(x + 1, y - 1),

    Pair(x - 1, y),
    Pair(x + 1, y),

    Pair(x - 1, y + 1),
    Pair(x, y + 1),
    Pair(x + 1, y + 1)
  ]
    .map(x => store.peek(x))
    .filter(x => x).length

  return store.extract()
    ? neighbours === 2 || neighbours === 3
    : neighbours === 3
}

console.log(isSurvivor(Game))
