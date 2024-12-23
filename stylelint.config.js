export default {
  extends: ['stylelint-config-recommended'],
  customSyntax: 'postcss-styled-syntax',
  overrides: [
    {
      files: ['**/*.{ts,tsx}'],
    },
  ],
  rules: {},
};
