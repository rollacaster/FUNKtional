const daggy = require('daggy')

// BTree a
const BTree = daggy.taggedSum('BTree', {
  // Recursion!
  // Node (BTree a) a (BTree a)
  Node: ['left', 'x', 'right'],

  // Leaf
  Leaf: []
})

const { Node, Leaf } = BTree

// Functor

BTree.prototype.map = function(f) {
  return this.cata({
    Node: (l, x, r) => Node(l.map(f), f(x), r.map(f)),
    Leaf: () => Leaf
  })
}

// Foldable
BTree.prototype.reduce = function(f, acc) {
  return this.cata({
    Node: (l, x, r) => {
      // Reduce the tree on the left...
      const left = l.reduce(f, acc)

      // Plus the middle element...
      const leftAndMiddle = f(left, x)

      // And then the right tree...
      return r.reduce(f, leftAndMiddle)
    },

    // Return what we started with!
    Leaf: () => acc
  })
}

const lift3 = f => a => b => c => c.ap(b.ap(a.map(f)))

// Lift all the bits, then rebuild!
BTree.prototype.traverse = function(T, f) {
  return this.cata({
    Node: (l, n, r) =>
      lift3(
        l => n => r => BTree.Node(l, n, r),
        l.traverse(T, f),
        f(n),
        r.traverse(T, f)
      ),
    Leaf: () => T.prototype.of(BTree.Leaf)
  })
}

BTree.prototype.of = function(x) {
  return new Node(Leaf, x, Leaf)
}

module.exports = { BTree, Node, Leaf }
