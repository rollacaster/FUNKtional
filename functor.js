const { Right, Left } = require('./either')

const Identity = x => ({
  // Transform the inner value
  // map :: Identity a ~> (a -> b) -> Identity b
  map: f => Identity(f(x)),

  // Get the inner value
  // fold :: Identity a ~> (a -> b) -> b
  fold: f => f(x)
})

const Just = x => ({
  // Transform the inner value
  // map :: Maybe a ~> (a -> b) -> Maybe b
  map: f => Just(f(x)),

  // Get the inner value
  // fold :: Maybe a ~> (b, a -> b) -> b
  fold: (_, f) => f(x)
})

const Nothing = {
  // Do nothing
  // map :: Maybe a ~> (a -> b) -> Maybe b
  map: f => Nothing,

  // Return the default value
  // fold :: Maybe a ~> (b, a -> b) -> b
  fold: (d, _) => d
}

// // A little helper method that we'll see a lot...
// // fromNullable :: ?a -> Maybe a
// const fromNullable = x => (x != null ? Just(x) : Nothing)

// // This now returns a Maybe
// // getLight :: Int -> Maybe String
// const getLight = i => fromNullable(['Red', 'Amber', 'Green'][i])

// console.log(
//   getLight(0)
//     .map(x => x.toUpperCase())
//     .map(x => 'The light is ' + x)
//     .fold('Invalid choice!', x => x)
// )

// Now, we provide a "default" for null values
// fromNullable :: (a, ?b) -> Either a b
const fromNullable = (d, x) => (x != null ? Right(x) : Left(d))

// getLight :: Int -> Either String String
const getLight = i =>
  fromNullable(i + ' is not a valid choice!', ['Red', 'Amber', 'Green'][i])

console.log(
  getLight(5)
    .map(x => x.toUpperCase())
    .map(x => 'The light is ' + x)
    .fold(e => 'ERROR: ' + e, s => 'SUCCESS: ' + s)
)

// (a -> b) ~> (b -> c) -> a -> c
Function.prototype.map = function(that) {
  return x => that(this(x))
}

const toUpper = x => x.toUpperCase()
const exclaim = x => x + '!'
const greet = x => 'Hello, ' + x
const log = console.log.bind(console)

// Ok, cheating a little bit...
const getUserInput = () => 'Tom'

const myProgram = getUserInput
  .map(greet)
  .map(exclaim)
  .map(toUpper)
  .map(log)

myProgram() // logs "HELLO, TOM!"
