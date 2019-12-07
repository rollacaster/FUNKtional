const daggy = require('daggy')

const { List, Cons, Nil } = require('./list')

//
// Source Block 1
//

//- A coordinate in 3D space.
//+ Coord :: (Int, Int, Int) -> Coord
const Coord = daggy.tagged('Coord', ['x', 'y', 'z'])

//- A line between two coordinates.
//+ Line :: (Coord, Coord) -> Line
const Line = daggy.tagged('Line', ['from', 'to'])

//
// Source Block 2
//

// We can add methods...
Coord.prototype.translate = function(x, y, z) {
  // Named properties!
  return Coord(this.x + x, this.y + y, this.z + z)
}

// Auto-fills the named properties
const origin = Coord(0, 0, 0)

const myLine = Line(origin, origin.translate(2, 4, 6))

//
// Source Block 3
//

const Bool = daggy.taggedSum('Bool', { True: [], False: [] })

//
// Source Block 4
//

const Shape = daggy.taggedSum('Shape', {
  // Square :: (Coord, Coord) -> Shape
  Square: ['topleft', 'bottomright'],

  // Circle :: (Coord, Number) -> Shape
  Circle: ['centre', 'radius']
})

//
// Source Block 5
//

Shape.prototype.translate = function(x, y, z) {
  return this.cata({
    Square: (topleft, bottomright) =>
      Shape.Square(topleft.translate(x, y, z), bottomright.translate(x, y, z)),

    Circle: (centre, radius) => Shape.Circle(centre.translate(x, y, z), radius)
  })
}

const square = Shape.Square(Coord(2, 2, 0), Coord(3, 3, 0)).translate(3, 3, 3)
// Square(Coord(5, 5, 3), Coord(6, 6, 3))

const circle = Shape.Circle(Coord(1, 2, 3), 8).translate(6, 5, 4)
// Circle(Coord(7, 7, 7), 8)

//
// Source Block 6
//

const { True, False } = Bool

// Flip the value of the Boolean.
Bool.prototype.invert = function() {
  return this.cata({
    False: () => True,
    True: () => False
  })
}

// Shorthand for Bool.prototype.cata?
Bool.prototype.thenElse = function(then, or) {
  return this.cata({
    True: then,
    False: or
  })
}

// Check that each point matches
// equals :: Coord ~> Coord -> Bool
Coord.prototype.equals = function(that) {
  return this.x === that.x && this.y === that.y && this.z === that.z
}

// Check each Coord with Coord.equals
// equals :: Line ~> Line -> Bool
Line.prototype.equals = function(that) {
  return this.from.equals(that.from) && this.to.equals(that.to)
}

// The this' "true-ness" must match that's!
// equals :: Bool ~> Bool -> Bool
Bool.prototype.equals = function(that) {
  return this instanceof Bool.True === that instanceof Bool.True
}

Array.prototype.equals = function(arr) {
  if (this.length !== arr.length) return false

  return this.every((a, i) => a === arr[i])
}

// isPalindrome :: Setoid a => [a] ~> Bool
List.prototype.isPalindrome = function() {
  return this.cata({
    Cons: () =>
      this.reverse()
        .toArray()
        .every((a, i) => this.toArray()[i] === a),
    Nil: () => true
  })
}
console.log(JSON.stringify(List.from([1, 2, 3]).concat(List.from([3, 4]))))
// reverse :: Setoid a => [a] ~> [a]
List.prototype.reverse = function() {
  return this.cata({
    Cons: (head, tail) => tail.reverse().concat(Cons(head, Nil)),
    Nil: () => this
  })
}
// console.log(List.Nil.is(List.Cons))
// console.log(List.from([1, 2]).toString())
// console.log(
//   JSON.stringify(List.from([1, 2, 3]).concat(List.from([3, 4])).reverse())
// )

// indexOf :: Setoid a => [a] -> a -> Int
const indexOf = xs => x => {
  for (let i = 0; i < xs.length; i++) if (xs[i].equals(x)) return i

  return -1
}

// nub_ :: Setoid a => [a] -> [a]
const nub_ = xs => xs.filter((x, i) => indexOf(xs)(x) === i)

const Set = daggy.tagged('Set', ['items'])

// add :: Setoid a => [a] -> [a]
Set.prototype.add = function(item) {
  this.items = nub_(this.items.concat(item))
  return this
}

// remove :: Setoid a => [a] -> [a]
Set.prototype.remove = function(item) {
  this.items = this.items.filter(a => !a.equals(item))
  return this
}
