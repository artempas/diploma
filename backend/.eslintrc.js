// eslint-disable-next-line no-undef
module.exports = {
    root: true,
    'extends': [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended'
    ],
    'parser': '@typescript-eslint/parser',
    'parserOptions': {
        'ecmaVersion': 12,
        'sourceType': 'module'
    },
    'plugins': [
        '@typescript-eslint'
    ],
    'rules': {
        '@typescript-eslint/no-unused-vars': 'warn',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/ban-ts-ignore': 'off',
        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/type-annotation-spacing': ['error', { 'before': false, 'after': true }],
        'array-bracket-newline': ['warn', 'consistent'],
        'array-element-newline': ['error', 'consistent'],
        'arrow-spacing': ['warn', { 'before': true, 'after': true }],
        'block-spacing': ['warn', 'always'],
        'brace-style': ['warn', '1tbs', {'allowSingleLine': true}],
        'comma-spacing': ['error', { 'before': false, 'after': true }],
        'computed-property-spacing': ['warn', 'never'],
        'function-call-argument-newline': ['error', 'consistent'],
        'func-call-spacing': ['error', 'never'],
        'function-paren-newline': ['error', 'consistent'],
        'indent': ['error', 4],
        'key-spacing': ['warn', {'beforeColon': false, 'afterColon': true, 'mode': 'strict'}],
        'keyword-spacing': ['error', {'before': true, 'after': true}],
        'lines-between-class-members': ['warn', 'always'],
        'max-len': ['warn', {'code': 120, 'ignoreUrls': true, 'ignoreStrings': true, 'ignoreTemplateLiterals': true, 'ignoreRegExpLiterals': true}],
        'max-statements-per-line': ['error', {'max': 2}],
        'no-extra-semi': 'warn',
        'no-multi-spaces': 'warn',
        'no-multiple-empty-lines': ['warn', {'max': 2}],
        'no-prototype-builtins': 'off',
        'no-whitespace-before-property': 'error',
        'no-trailing-spaces': 'warn',
        'object-curly-newline': ['error', {'consistent': true}],
        'prefer-const': 'off',
        'quotes': ['error', 'single'],
        'space-infix-ops': ['error', {}],
        'semi': ['warn', 'always'],
        'semi-spacing': ['error', {'before': false, 'after': true}],
        'semi-style': ['error', 'last'],
        'space-before-function-paren': ['error', 'always'],
        'switch-colon-spacing': ['error', {'after': true, 'before': false}],

    },
    'reportUnusedDisableDirectives': true
};

