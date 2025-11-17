module.exports = {
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
        indent: ['error', 4, {
            SwitchCase: 1, // Enforce indentation for switch cases
            VariableDeclarator: { var: 1, let: 1, const: 1 }, // Enforce indentation for variable declarations
            outerIIFEBody: 1, // Enforce indentation for outer IIFE bodies
            MemberExpression: 1, // Enforce indentation for multi-line member expressions
            FunctionDeclaration: { parameters: 1, body: 1 }, // Enforce indentation for function declarations
            FunctionExpression: { parameters: 1, body: 1 }, // Enforce indentation for function expressions
            CallExpression: { arguments: 1 }, // Enforce indentation for function call arguments
            ArrayExpression: 1, // Enforce indentation for array expressions
            ObjectExpression: 1, // Enforce indentation for object expressions
            ImportDeclaration: 1, // Enforce indentation for import declarations
            flatTernaryExpressions: false, // Do not allow flat ternary expressions
            ignoredNodes: [], // No ignored nodes
            ignoreComments: false // Do not ignore comments
        }],
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