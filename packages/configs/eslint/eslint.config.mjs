import globals from 'globals';
import eslintJs from '@eslint/js';
import eslintTs from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import importPlugin from 'eslint-plugin-import';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import reactRefreshPlugin from 'eslint-plugin-react-refresh';
import perfectionistPlugin from 'eslint-plugin-perfectionist';
import eslintPluginBoundaries from "eslint-plugin-boundaries";
import unusedImportsPlugin from 'eslint-plugin-unused-imports';

/**
 * @fileoverview Custom ESLint configuration for a React project with TypeScript.
 * 0 -> Off
 * 1 -> Warning
 * 2 -> Error
*/

/**
 * @rules common
 */
const commonRules = () => ({
  ...reactHooksPlugin.configs.recommended.rules,

  // typescript
  '@typescript-eslint/no-empty-object-type': 0,
  "@typescript-eslint/no-unused-vars": 0,
  '@typescript-eslint/no-explicit-any': 0,
  '@typescript-eslint/consistent-type-imports': 1,
  '@typescript-eslint/no-unused-expressions': 0,

  // arquitecture
  'func-names': 1,
  'no-bitwise': 2,
  'no-unused-vars': 0,
  'object-shorthand': 1,
  'no-useless-rename': 1,
  'default-case-last': 2,
  'consistent-return': 2,
  'no-constant-condition': 1,
  'default-case': [2, { commentPattern: '^no default$' }],
  'lines-around-directive': [2, { before: 'always', after: 'always' }],
  'arrow-body-style': [2, 'as-needed', { requireReturnForObjectLiteral: false }],

  // react
  'react/jsx-key': 1,
  'react/jsx-tag-spacing': 1,
  'react/prop-types': 0,
  'react/display-name': 1,
  'react/no-children-prop': 1,
  'react/jsx-boolean-value': 2,
  'react/self-closing-comp': 2,
  'react/react-in-jsx-scope': 0,
  'react/jsx-no-useless-fragment': [1, { allowExpressions: true }],
  'react/jsx-curly-brace-presence': [2, { props: 'never', children: 'never' }],

  // react refresh
  'react-refresh/only-export-components': [1, { allowConstantExport: true }],
});

/**
 * @rules import
 * from 'eslint-plugin-import'.
 */
const importRules = () => ({
  ...importPlugin.configs.recommended.rules,
  'import/named': 0,
  'import/export': 0,
  'import/no-unresolved': 0,
  'import/default': 0,
  'import/namespace': 0,
  'func-names': 0,
  'import/no-named-as-default': 0,
  'import/newline-after-import': 2,
  'import/no-named-as-default-member': 0,
  'import/no-cycle': [
    0, // disabled if slow
    { maxDepth: '∞', ignoreExternal: false, allowUnsafeDynamicCyclicDependency: false },
  ],
});

/**
 * @rules unused imports
 * from 'eslint-plugin-unused-imports'.
 */
const unusedImportsRules = () => ({
  'unused-imports/no-unused-imports': 1,
  'unused-imports/no-unused-vars': [
    0,
    { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' },
  ],
});

/**
 * @rules sort or imports/exports
 * from 'eslint-plugin-perfectionist'.
 */
const sortImportsRules = () => {
  const customGroups = {
    auth: ['custom-auth'],
    hooks: ['custom-hooks'],
    utils: ['custom-utils'],
    types: ['custom-types'],
    routes: ['custom-routes'],
    sections: ['custom-sections'],
    components: ['custom-components']
  };

  return {
    'perfectionist/sort-named-imports': [1, { type: 'line-length', order: 'asc' }],
    'perfectionist/sort-named-exports': [1, { type: 'line-length', order: 'asc' }],
    'perfectionist/sort-exports': [
      1,
      {
        order: 'asc',
        type: 'line-length',
        groupKind: 'values-first',
      },
    ],
    'perfectionist/sort-imports': [
      2,
      {
        order: 'asc',
        ignoreCase: true,
        type: 'line-length',
        environment: 'node',
        maxLineLength: undefined,
        newlinesBetween: 'always',
        internalPattern: ['^src/.+'],
        groups: [
          'style',
          'side-effect',
          'type',
          ['builtin', 'external'],
          customGroups.routes,
          customGroups.hooks,
          customGroups.utils,
          'internal',
          customGroups.components,
          customGroups.sections,
          customGroups.auth,
          customGroups.types,
          ['parent', 'sibling', 'index'],
          ['parent-type', 'sibling-type', 'index-type'],
          'object',
          'unknown',
        ],
        customGroups: {
          value: {
            [customGroups.auth]: ['^src/auth/.+'],
            [customGroups.hooks]: ['^src/hooks/.+'],
            [customGroups.utils]: ['^src/utils/.+'],
            [customGroups.types]: ['^src/types/.+'],
            [customGroups.routes]: ['^src/routes/.+'],
            [customGroups.sections]: ['^src/sections/.+'],
            [customGroups.components]: ['^src/components/.+'],
          },
        },
      },
    ],
  };
};

/**
 * @rules no anonymous default export
 * from 'no-anonymous-default-export'.
*/
const noAnonymousDefaultExport = () => ({
  'import/no-anonymous-default-export': [
    2,
    {
      allowArrowFunction: false,
      allowAnonymousClass: false,
      allowAnonymousFunction: false,
    },
  ],
});

const getBoundaryConfig = () => ({
  "boundaries/element-types": ["error", {
    default: "disallow",
    rules: [
      // domínio é a base, não depende de ninguém
      { from: ["domain"], allow: [] },

      // aplicação depende só do domínio
      { from: ["application"], allow: ["domain"] },

      // infraestrutura pode falar com aplicação e domínio
      { from: ["infrastructure"], allow: ["application", "domain"] },

      // interfaces (adapters, controllers, UI) podem depender de aplicação e domínio
      { from: ["interfaces"], allow: ["application", "domain"] },
    ]
  }]
})

const reactHooksRules = () => ({
  ...reactHooksPlugin.configs.recommended.rules,
  'react-hooks/exhaustive-deps': 2, // obriga dependências corretas no useEffect, useCallback, etc.
})

/**
 * Custom ESLint configuration.
 */
export const customConfig = {
  plugins: {
    boundaries: eslintPluginBoundaries,
    'react-hooks': reactHooksPlugin,
    'react-refresh': reactRefreshPlugin,
    'unused-imports': unusedImportsPlugin,
    perfectionist: perfectionistPlugin,
    import: importPlugin
  },
  settings: {
    ...importPlugin.configs.typescript.settings,
    boundaries: {
      defaultTag: "untyped",
      types: ["domain", "application", "infrastructure", "interfaces"],
      elements: [
        { type: "domain", pattern: "apps/backend/src/domain/*" },
        { type: "application", pattern: "apps/backend/src/application/*" },
        { type: "infrastructure", pattern: "apps/backend/src/infrastructure/*" },
        { type: "interfaces", pattern: "apps/backend/src/interfaces/*" }
      ]
    },
    'import/resolver': {
      ...importPlugin.configs.typescript.settings['import/resolver'],
      typescript: {
        project: './tsconfig.json',
      },
    },
  },
  rules: {
    ...commonRules(),
    ...getBoundaryConfig(),
    ...noAnonymousDefaultExport(),
    ...importRules(),
    ...unusedImportsRules(),
    ...sortImportsRules(),
    ...reactHooksRules(),
  },
}

// eslint-disable-next-line import/no-anonymous-default-export
export default [
  { files: ['**.{js,mjs,cjs,ts,jsx,tsx}'] },
  {
    ignores:
      ['**/node_modules/**',
        '**/dist/**',
        '**/build/**',
        '**/coverage/**']
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      },
      parserOptions: {
        // Define o diretório raiz do tsconfig para evitar ambiguidade em monorepos
        // Usa o diretório atual onde o ESLint está sendo executado (ex.: apps/frontend)
        tsconfigRootDir: process.cwd(),
      },
    },
    settings: { react: { version: 'detect' } },
  },
  eslintJs.configs.recommended,
  ...eslintTs.configs.recommended,
  reactPlugin.configs.flat.recommended,
  customConfig,
];
