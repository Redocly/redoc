const path = require('path');
function root(args) {
  args = Array.prototype.slice.call(arguments, 0);
  return path.join.apply(path, [__dirname, '..'].concat(args));
}

module.exports = {
  root: root
}
