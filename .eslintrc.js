export default {
    env: {
        browser: true,
        es2021: true
    },
    extends: 'eslint:recommended',
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
    },
    rules: {
        indent: ['error', 4], // Enforce 4 spaces for indentation
        'linebreak-style': ['error', 'unix'], // Enforce Unix line endings
        quotes: ['error', 'single'], // Enforce single quotes
        semi: ['error', 'always'], // Require semicolons
        'no-trailing-spaces': 'error', // Disallow trailing spaces
        'space-before-blocks': ['error', 'always'], // Require space before blocks
        'keyword-spacing': ['error', { before: true, after: true }], // Enforce spacing around keywords
        'space-infix-ops': 'error', // Require spacing around operators
        'comma-spacing': ['error', { before: false, after: true }], // Enforce spacing after commas
        'object-curly-spacing': ['error', 'always'], // Enforce spacing inside curly braces
        'array-bracket-spacing': ['error', 'never'], // Disallow spacing inside array brackets
        'key-spacing': ['error', { beforeColon: false, afterColon: true }] // Enforce spacing around object keys
    }
};