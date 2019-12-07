// Monoid
// ''.concat('hello')
//   === 'hello'.concat('')
//   === 'hello'
String.prototype.empty = () => ''

module.exports = { String }
