module.exports = {
  root: true,

  env: {
    node: true,
  },
  extends: ['plugin:vue/essential', '@vue/prettier'],
  rules: {
    'no-console': 'off',
    'no-debugger': 'off',
    'no-unused-vars': 'off',
    'vue/no-unused-components': 'off',
    "indent": ["error", 2]
  },
  parserOptions: {
    parser: 'babel-eslint',
  }
}