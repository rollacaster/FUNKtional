const { Pair } = require('./pair')
const { Loop, Done } = require('./step')
require('./array')
// Click the above link for a full
// explanation of this type!
const Writer = Pair(Array)

//+ seq :: Int -> Writer [Int] Int
const seq = upper => {
  //+ seq_ :: Int -> Writer [Int] Int
  const seq_ = init =>
    init >= upper
      ? // If we're done, stop here!
        Writer([init], upper)
      : // If we're not...
        Writer([init], init + 1).chain(seq_) // ...chain(seq_)!

  // Kick everything off
  return seq_(1)
}

// console.log(seq(10000).toString()) // [1, 2, 3, 4, 5]
//+ seqRec :: Int -> ([Int], Int)
const seqRec = upper =>
  Writer.chainRec(
    init => Writer([init], init >= upper ? Done(init) : Loop(init + 1)),
    0
  )

console.log(seqRec(10000).toString()) // [1, 2, 3, 4, 5]
