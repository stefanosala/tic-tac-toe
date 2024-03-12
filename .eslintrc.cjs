module.exports = {
  extends: [
    'semistandard'
  ],
  env: {
    node: true
  },
  rules: {
    'no-unused-vars': [2, { vars: 'all', args: 'after-used' }]
  }
};
