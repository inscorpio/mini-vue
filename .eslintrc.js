module.exports = {
  extends: '@antfu',
  overrides: [
    {
      files: ['*.ts'],
      rules: {
        'curly': 'off',
        'no-use-before-define': 'off',
        '@typescript-eslint/no-this-alias': 'off',
        '@typescript-eslint/no-use-before-define': 'off',
      },
    },
  ],
}
