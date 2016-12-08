/**
 * The pluggable linting utility for JavaScript and JSX
 */
module.exports = {
    extends : 'eslint:recommended',

    rules : {
        indent : [2, 4, {
            SwitchCase : 1
        }],

        quotes : [2, 'single'],
        semi   : [2, 'always'],

        'no-console' : 0,

        // key-spacing for object
        'key-spacing' : [2, {
            align       : 'colon',
            beforeColon : false,
            afterColon  : true
        }],

        // enforce consistent spacing before and after keywords (after if, else, for ...)
        'keyword-spacing': 'error',

        'no-case-declarations': 0,

        //  enforces Stroustrup style for if-else, try-catch ...
        'brace-style' : [2, 'stroustrup'],

        // If a variable is never reassigned, using the const declaration is better.
        'prefer-const': 1,

        // disallow a space before function parenthesis
        'space-before-function-paren': [2, 'never'],

        // variables to be declared either together or separately
        'one-var': ['error', 'never'],

        // Disallow Node.js modules, deprecated
        'no-restricted-modules': ['warn',
            'underscore', // -> lodash
            'sugar'
        ],

        // spacing around infix operators
        'space-infix-ops': 'error',

        // enforces spacing around commas
        'comma-spacing': ['error', { 'before': false, 'after': true }],

        'react/jsx-uses-react': 'error',
        'react/jsx-uses-vars': 'error'
    },

    env : {
        node   : true,
        browser: true,
        es6    : true
    },

    //place settings for globals here
    globals : {
        Err       : true
    },
    parserOptions: {
        ecmaVersion : 6,
        sourceType  : 'module',
        ecmaFeatures: {
            jsx: true
        }
    },
    plugins: [
        'react'
    ]
};
