import globals from 'globals';
import { FlatCompat } from '@eslint/eslintrc';
import tseslint from 'typescript-eslint';
import pluginJs from '@eslint/js';
import pluginReact from 'eslint-plugin-react';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import pluginPrettier from 'eslint-plugin-prettier';

const compat = new FlatCompat();

export default tseslint.config(
  { ignores: ['**/node_modules', '.vscode', 'XSS', 'docs', 'dist'] },
  {
    files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],
    languageOptions: {
      globals: globals.browser,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  pluginJs.configs.recommended,
  // ...compat.extends("airbnb-typescript"),
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  ...compat.extends('plugin:react-hooks/recommended'),
  jsxA11y.flatConfigs.recommended,
  {
    plugins: {
      prettier: pluginPrettier,
    },
    rules: {
      'prettier/prettier': 'error',
      '@typescript-eslint/no-unused-vars': 'off',
      // 'no-void': 'off',
      // 'no-console': 'off',
      // '@typescript-eslint/no-non-null-assertion': 'off',
      // 'import/no-named-as-default': 'off',
      // 'import/no-named-as-default-member': 'off',
      // 'jsx-a11y/no-static-element-interactions': 'off',
      // 'jsx-a11y/click-events-have-key-events': 'off',
    },
  },
);
