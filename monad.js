const Promise = require('fantasy-promises')
const daggy = require('daggy')

//- Regular `compose` - old news!
//+ compose ::      (b -> c)
//+         -> (a -> b)
//+         ->  a   ->    c
const compose = f => g => x => f(g(x))

//- `chain`-sequencing `compose`, fancily
//- known as Kleisli composition - it's the
//- K in Ramda's "composeK"!
//+ mcompose :: Chain m
//+          =>        (b -> m c)
//+          -> (a -> m b)
//+          ->  a     ->    m c
const mcompose = f => g => x => g(x).chain(f)

const Compose = daggy.tagged('Compose', ['f'])

//- Remember, for semigroups:
//- concat :: Semigroup s => s -> s -> s
//- Replace s with (a -> a)...
//+ concat ::      (a -> a)
//+        -> (a -> a)
//+        ->  a   ->    a
Compose.prototype.concat = function(that) {
  return Compose(x => this(that(x)))
}

//- We need something that has no effect...
//- The `id` function!
//+ empty :: (a -> a)
Compose.empty = () => Compose(x => x)

const MCompose = T => {
  const MCompose_ = daggy.tagged('f')

  //- Just as we did with Compose...
  //+ concat :: Chain m
  //+        =>        (a -> m a)
  //+        -> (a -> m a)
  //+        ->  a     ->    m a
  MCompose_.prototype.concat = function(that) {
    return MCompose(x => that(x).chain(this))
  }

  //- So, we need empty :: (a -> m a)
  //+ empty :: Chain m, Applicative m
  //+       => (a -> m a)
  MCompose_.empty = () => MCompose(M.of)

  return MCompose_
}

// OUR APP

const rl = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
})

//+ prompt :: Promise String
const prompt = new Promise(res => rl.question('> ', res))

//- We use "Unit" to mean "undefined".
//+ speak :: String -> Promise Unit
const speak = string => new Promise(res => res(console.log(string)))

//- Our entire asynchronous app!
//+ MyApp :: Promise String
const MyApp =
  // Get the name...
  speak('What is your name?')
    .chain(_ => prompt)
    .chain(name =>
      // Get the age...
      speak('And what is your age?')
        .chain(_ => prompt)
        .chain(
          age =>
            // Do the logic...
            age > 30
              ? speak('Seriously, ' + name + '?!').chain(_ =>
                  speak("You don't look a day over " + (age - 10) + '!')
                )
              : speak('Hmm, I can believe that!')
        )
        // Return the name!
        .chain(_ => Promise.of(name))
    )

// repeatApp :: Promise String -> Promise String
const repeatApp = app =>
  app.chain(result =>
    speak('Repeat?')
      .chain(_ => prompt)
      .chain(
        isCorrect =>
          isCorrect === 'n'
            ? speak('alright thank you').map(_ => result)
            : speak('allright try again...').chain(_ => repeatApp(app))
      )
  )

const BigApp = speak('PLAYER ONE')
  .chain(_ => MyApp)
  .chain(player1 =>
    speak('PLAYER TWO')
      .chain(_ => MyApp)
      .chain(player2 => speak(player1 + ' vs ' + player2))
  )

//- Our one little impurity:

// We run our program with a final
// handler for when we're all done!
repeatApp(MyApp).fork(name => {
  // Do some database stuff...
  // Do some beeping and booping...

  console.log('End', name)
  rl.close() // Or whatever
})
