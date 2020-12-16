// ------ 2T7Z5 -----

// -----
const fabric = require('@umijs/fabric');


// -----
module.exports = {
  ...fabric.stylelint,
  rules: {
    'color-hex-length': 'long',
    'no-descending-specificity': null,
  }
};
