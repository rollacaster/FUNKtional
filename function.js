//       f  a ~> (a -> b) ->       f  b
// Function a ~> (a -> b) -> Function b
// ((->) x) a ~> (a -> b) -> ((->) x) b
//  (x -> a)  ~> (a -> b) ->  (x -> b)
Function.prototype.map = function(that) {
  return x => that(this(x))
}

// f  a ~> f (a -> b)
//      -> f  b

// Function a ~> Function (a -> b)
//            -> Function b

// ((->) x) a ~> ((->) x) (a -> b)
//            -> ((->) x) b

//  (x -> a) ~> (x -> a -> b)
//           ->  (x -> b)

Function.prototype.ap = function(that) {
  return x => that(x)(this(x))
}

// m  a ~> (a -> m b)
//      -> m b

// Function a ~> (a -> Function b)
//            -> Function b

// ((->) x) a ~> (a -> ((->) x) b)
//            -> ((->) x) b

//  (x -> a) ~> (a -> x -> b)
//           -> x -> b
Function.prototype.chain = function(that) {
  return x => that(this(x))(x)
}

module.exports = { Function }
