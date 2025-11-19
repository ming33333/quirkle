import js from '@eslint/js';
import react from 'eslint-plugin-react';

export default [
  {
    files: ['**/*.js', '**/*.jsx'], // Apply to JavaScript and JSX files
    languageOptions: {
      ecmaVersion: 'latest', // Use the latest ECMAScript version
      sourceType: 'module', // Enable ES Modules
      globals: {
        browser: true, // Enable browser globals like `window`
      },
    },
    plugins: {
      react, // Enable the React plugin
    },
    rules: {
      'react/jsx-uses-react': 'error', // Prevent React being marked as unused
      'react/jsx-uses-vars': 'error', // Prevent variables used in JSX from being marked as unused
      indent: ['error', 2], // Enforce 2 spaces for indentation
      quotes: ['error', 'single'], // Enforce single quotes
      semi: ['error', 'always'], // Require semicolons
    },
    settings: {
      react: {
        version: 'detect', // Automatically detect the React version
      },
    },
  },
];