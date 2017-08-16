const daggy = require('daggy')

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

//
// Source Block 6
//
const List = daggy.taggedSum('List', {
  Cons: ['head', 'tail'],
  Nil: []
})

List.prototype.map = function(f) {
  return this.cata({
    Cons: (head, tail) => List.Cons(f(head), tail.map(f)),

    Nil: () => List.Nil
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

// Check the lists' heads, then their tails
// equals :: Setoid a => [a] ~> [a] -> Bool
List.prototype.equals = function(that) {
  return this.cata({
    // Note the two different Setoid uses:
    Cons: (head, tail) => head.equals(that.head) && tail.equals(that.tail), // a // [a]

    Nil: () => that instanceof List.Nil
  })
}

Array.prototype.equals = function(arr) {
  if (this.length !== arr.length) return false

  return this.every((a, i) => a === arr[i])
}

// isPalindrome :: Setoid a => [a] ~> Bool
List.prototype.isPalindrome = function() {
  return this.cata({
    Cons: () =>
      this.reverse().toArray().every((a, i) => this.toArray()[i] === a),
    Nil: () => true
  })
}

// reverse :: Setoid a => [a] ~> [a]
List.prototype.reverse = function() {
  return this.cata({
    Cons: (head, tail) => List.from(this.toArray().reverse()),
    Nil: () => Nil
  })
}

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

console.log(Set([Coord(0, 0, 0)]).add(Coord(0, 1, 0)).remove(Coord(0, 1, 0)))
