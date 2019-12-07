const { Pair } = require('./pair')
const { Sum } = require('./semigroup')

const Adventurer = Pair(Sum)

const exampleUser = { name: 'Tom', isHungry: false }
// sneakyPeekMap :: (m, a) ~> ((m, a) -> b) -> (m, b)
Adventurer.prototype.sneakyPeekMap = function(f) {
  return Adventurer(this._1, f(this))
}

// slayDragon :: User -> Adventurer User
const slayDragon = user => Adventurer(Sum(100), user)

// runFromDragon :: User -> Adventurer User
const runFromDragon = user => Adventurer(Sum(50), user)

// eat :: User -> Adventurer User
const eat = user =>
  user.isHungry
    ? Adventurer(Sum(-100), { ...user, isHungry: false })
    : Adventurer(Sum(0), user)

// areWeHungry :: Adventurer User -> User
const areWeHungry = ({ _1: { val: hunger }, _2: user }) =>
  hunger > 200 ? { ...user, isHungry: true } : user

console.log(
  slayDragon(exampleUser)
    .sneakyPeekMap(areWeHungry)
    .chain(eat)
    .chain(slayDragon)
    .sneakyPeekMap(areWeHungry)
    .chain(eat)
    .chain(runFromDragon)
    .sneakyPeekMap(areWeHungry)
    .chain(eat)
)
