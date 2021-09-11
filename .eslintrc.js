// +++++ 9P2K4 +++++


// -----
module.exports = {
  extends: [require.resolve('@umijs/fabric/dist/eslint')],
  globals: {
    page: true,
    MODE: true,
  },
  plugins: [
    'simple-import-sort',
    'import',
  ],
  rules: {
    // ----- Indentation -----
    'indent': ['error', 2],

    // ----- Space -----
    'no-trailing-spaces': 'error',

    'object-curly-spacing': 'error',

    // ----- Newline -----
    'linebreak-style': ['error', 'unix'],

    'eol-last': 'error',

    'no-multiple-empty-lines': [
      'error',
      {
        'max': 2,
        'maxEOF': 0,
      },
    ],

    // ----- Semicolon -----
    'semi': ['error', 'always'],

    // ----- Import -----
    'sort-imports': 'off',

    'import/order': 'off',

    'no-duplicate-imports': 'off',

    'import/no-duplicates': 'off',

    'import/no-unused-modules': 'off',

    'import/no-namespace': 'error',

    'import/first': 'error',

    'import/newline-after-import': 'error',

    'simple-import-sort/imports': 'error',

    // ----- Export -----
    'simple-import-sort/exports': 'error',

    // ----- Variable -----
    // Disable these checks because they do not support ignoring unused underscore name.
    // Use TypeScript's `strict` check instead.
    'no-unused-vars': 'off',

    '@typescript-eslint/no-unused-vars': 'off',

    // ----- Function -----

    'func-style': [
      'error',
      'declaration',
      {
        'allowArrowFunctions': true,
      },
    ],

    'consistent-return': 'error',

    'no-useless-return': 'off',

    'no-else-return': 'error',

    'arrow-parens': 'error',

    'arrow-body-style': ['error', 'always'],

    'class-methods-use-this': 'off',

    'max-classes-per-file': 'off',

    // ----- Object Literal -----
    'comma-dangle': ['error', 'always-multiline'],

    'object-property-newline': [
      'error', {
        'allowAllPropertiesOnSameLine': false,
      },
    ],

    // ----- Object -----
    'prefer-destructuring': 'off',

    // ----- String Literal -----
    'quotes': ['error', 'single'],
  },
  ignorePatterns: [
    'src/.umi',
    'build',
    'dist',
    'public',
  ],
};
