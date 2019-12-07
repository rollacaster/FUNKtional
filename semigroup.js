const daggy = require('daggy')

// Strings are semigroups
// 'hello'.concat(', world!')

// This operation is associative, too!
// 'hello'.concat(', ').concat('world!')
// 'hello'
//   .concat(', '.concat('world!'))
//   [
//     // Arrays are semigroups
//     (1, 2)
//   ].concat([3, 4]) // [1, 2, 3, 4] // Aaand it's associative!
//   [1].concat([2, 3])
//   .concat([4])[1]
//   .concat([2, 3].concat([4]))

const Sum = daggy.tagged('Sum', ['val'])

Sum.prototype.concat = function(that) {
  return Sum(this.val + that.val)
}

// Sum(2).concat(Sum(3)).val // 5

const Product = daggy.tagged('Product', ['val'])

Product.prototype.concat = function(that) {
  return Product(this.val * that.val)
}

// Product(2).concat(Product(3)).val // 6

const Max = daggy.tagged('Max', ['val'])

Max.prototype.concat = function(that) {
  return Max(Math.max(this.val, that.val))
}

// Max(2).concat(Max(3)).val // 3

const Min = daggy.tagged('Min', ['val'])

Min.prototype.concat = function(that) {
  return Min(Math.min(this.val, that.val))
}

const Last = daggy.tagged('Last', ['val'])

Last.prototype.concat = function(that) {
  return that
}

const Any = daggy.tagged('Any', ['val'])

Any.prototype.concat = function(that) {
  return Any(this.val || that.val)
}

const All = daggy.tagged('All', ['val'])

All.prototype.concat = function(that) {
  return All(this.val && that.val)
}

const First = daggy.tagged('First', ['val'])
// Return the a value in a.concat(b)
First.prototype.concat = function(that) {
  return this
}

const Tuple = daggy.tagged('Tuple', ['a', 'b'])

// concat :: (Semigroup a, Semigroup b) =>
//   Tuple a b ~> Tuple a b -> Tuple a b
Tuple.prototype.concat = function(that) {
  return Tuple(this.a.concat(that.a), this.b.concat(that.b))
}

// Returns Tuple(Sum(3), Any(true))
// Tuple(Sum(1), Any(false)).concat(Tuple(Sum(2), Any(true)))

const Customer = daggy.tagged('Customer', [
  'name', // String
  'favouriteThings', // [String]
  'registrationDate', // Int -- since epoch
  'hasMadePurchase' // Bool
])

const myStrategy = {
  // to :: Customer
  //    -> Tuple4 (First String)
  //              [String]
  //              (Min Int)
  //              (Any Bool)
  to: customer =>
    Tuple4(
      First(customer.name),
      // Arrays are semigroups already!
      // We could use Set, though.
      customer.favouriteThings,
      Min(customer.registrationDate),
      Any(customer.hasMadePurchase)
    ),

  // from :: Tuple4 (First String)
  //                [String]
  //                (Min Int)
  //                (Any Bool)
  //      -> Customer
  from: ({ a, b, c, d }) => Customer(a.val, b, c.val, d.val)
}

const merge = strategy => x => y =>
  strategy.from(strategy.to(x).concat(strategy.to(y)))

const mergeMany = strategy => initial => customers =>
  customers.reduce(merge(strategy), initial)

module.exports = {
  Sum,
  Product,
  Max,
  Min,
  All,
  Any,
  First,
  Last,
  Tuple
}
