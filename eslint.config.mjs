// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import stylistic from '@stylistic/eslint-plugin';

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylistic,
    {
        files: ['**/*.ts', '**/*.tsx'],
        languageOptions: {
            parserOptions: {
                projectService: true,
            },
        },
        plugins: {
            '@stylistic': stylistic,
        },
        rules: {
            '@stylistic/indent': ['warn', 4],
            '@typescript-eslint/array-type': 'warn',
            '@typescript-eslint/ban-ts-comment': 'warn',
            '@typescript-eslint/consistent-generic-constructors': 'warn',
            '@typescript-eslint/no-empty-function': 'warn',
            '@typescript-eslint/no-this-alias': 'warn',
            '@typescript-eslint/no-unused-vars': 'warn',
            '@typescript-eslint/restrict-template-expressions': 'off',
            'array-bracket-spacing': 'warn',
            'arrow-parens': ['warn', 'as-needed', { requireForBlockBody: true }],
            'arrow-spacing': 'warn',
            'block-spacing': 'warn',
            'brace-style': 'warn',
            'camelcase': 'warn',
            'comma-dangle': 'warn',
            'comma-spacing': 'warn',
            'comma-style': 'warn',
            'computed-property-spacing': 'warn',
            'curly': 'warn',
            'eqeqeq': ['warn', 'smart'],
            'guard-for-in': 'warn',
            'indent': 'off', // Superseded by TS
            'key-spacing': ['warn', { mode: 'strict' }],
            'keyword-spacing': 'warn',
            'linebreak-style': 'warn',
            'new-cap': 'warn',
            'no-async-promise-executor': 'warn',
            'no-confusing-arrow': 'warn',
            'no-console': 'warn',
            'no-debugger': 'warn',
            'no-else-return': 'warn',
            'no-empty': ['error'],
            'no-eval': 'warn',
            'no-extra-boolean-cast': 'warn',
            'no-floating-decimal': 'warn',
            'no-lone-blocks': 'warn',
            'no-multi-spaces': 'warn',
            'no-prototype-builtins': 'off',
            'no-throw-literal': 'warn',
            'no-trailing-spaces': 'warn',
            'no-undef': 'off', // Superseded by TS
            'no-unused-expressions': 'warn',
            'no-unused-vars': 'off', // Superseded by TS
            'no-use-before-define': 'off',
            'no-useless-concat': 'error',
            'no-var': 'warn',
            'no-warning-comments': 'off',
            'no-with': 'warn',
            'prefer-const': 'warn',
            'prefer-template': 'warn',
            'semi-spacing': ['warn', { before: false, after: true }],
            'semi-style': 'warn',
            'semi': 'warn',
            'space-before-blocks': 'warn',
            'space-in-parens': ['warn', 'never'],
            'space-infix-ops': 'warn',
            'space-unary-ops': 'warn',
            'strict': 'off', // Superseded by TS
            'switch-colon-spacing': 'warn',
            'template-curly-spacing': ['warn', 'never'],
            'wrap-iife': ['warn', 'any'],

            // To evaluate and possibly fix later
            '@typescript-eslint/consistent-type-definitions': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-floating-promises': 'off',
            '@typescript-eslint/no-misused-promises': 'off',
            '@typescript-eslint/no-require-imports': 'off',
            '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'off',
            '@typescript-eslint/no-unnecessary-condition': 'off',
            '@typescript-eslint/no-unsafe-argument': 'off',
            '@typescript-eslint/no-unsafe-assignment': 'off',
            '@typescript-eslint/no-unsafe-call': 'off',
            '@typescript-eslint/no-unsafe-member-access': 'off',
            '@typescript-eslint/no-unsafe-return': 'off',
            '@typescript-eslint/no-var-requires': 'off',
            '@typescript-eslint/prefer-promise-reject-errors': 'off',
            '@typescript-eslint/require-await': 'off',
            '@typescript-eslint/use-unknown-in-catch-callback-variable': 'off',
        }
    }
);
