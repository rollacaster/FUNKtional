const { Array } = require('./array')

// Remember: `f` MUST be curried!
// lift2 :: Applicative f
//       =>  (a ->   b ->   c)
//       -> f a -> f b -> f c
const lift2 = f => a => b => b.ap(a.map(f))

// lift2F :: Functor f
//        => (  a ->   b ->      c)
//        ->  f a -> f b -> f (f c)
const lift2F = f => as => bs => as.map(a => bs.map(b => f(a)(b)))

const lift3 = f => a => b => c => c.ap(b.ap(a.map(f)))

// Identity(5)
// console.log(lift2F(x => y => x + y)(Identity(2))(Identity(3)))

// 3 x 0 elements
// console.log([2, 3, 4].ap([]))

// 3 x 1 elements
// [ '2!', '3!', '4!' ]
console.log([2, 3, 4].ap([x => x + '!']))
console.log([2, 3, 4].map(x => x + '!'))
// 3 x 2 elements
// [ '2!', '2?'
// , '3!', '3?'
// , '4!', '4?' ]
// console.log([2, 3, 4].ap([x => x + '!', x => x + '?']))
console.log([].concat([x => x + '!', x => x + '?'].map(f => [2, 3, 4].map(f))))
console.log(lift2(x => y => x + y)([1, 2])([3, 4]))
