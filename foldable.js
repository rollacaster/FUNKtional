const { Node, Leaf } = require('./btree')
const { Left } = require('./either')

console.log(Left(2).reduce((a, b) => a + b, 1))

const MyTree = Node(
  Node(Leaf, 1, Node(Leaf, 2, Leaf)),
  3,
  Node(Node(Leaf, 4, Leaf), 5, Leaf)
)

console.log(MyTree.reduce((x, y) => x + y, 0)) // 15
