module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint'
  },
  env: {
    browser: true,
  },
  extends: ['airbnb-base'],
  // add your custom rules here
  rules: {
    'import/extensions': ['error', 'always', {
      js: 'never'
    }],
    // disallow reassignment of function parameters
    // disallow parameter object manipulation except for specific exclusions
    'no-param-reassign': ['error', {
      props: true,
      ignorePropertyModificationsFor: [
        'state', // for vuex state
        'acc', // for reduce accumulators
        'e' // for e.returnvalue
      ]
    }],
    "no-shadow": ["error", { "allow": ["state"] }],
    "linebreak-style": ["off", "windows"],
    "eslint no-unused-expressions": 0,
    // allow debugger during development
    'no-debugger': 'error',
    'no-console': 'off',
    'class-methods-use-this': 'off',
  }
}
