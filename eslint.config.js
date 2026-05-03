import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import noUnsanitized from 'eslint-plugin-no-unsanitized'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    plugins: {
      'no-unsanitized': noUnsanitized,
    },
    rules: {
      'no-unsanitized/method': 'error',
      'no-unsanitized/property': 'error',
      // Enforce AGPL/MIT boundary: src/ must never import from generator/.
      // See LICENSING.md.
      'no-restricted-imports': ['error', {
        patterns: [{
          group: ['**/generator/**', '../generator/**', '../../generator/**'],
          message: 'src/ is MIT; generator/ is AGPL-3.0. Importing across this boundary would taint the runtime. See LICENSING.md.',
        }],
      }],
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
])
