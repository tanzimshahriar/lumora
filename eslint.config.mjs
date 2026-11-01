import eslintConfigPrettier from 'eslint-config-prettier/flat'
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'
import prettierPlugin from 'eslint-plugin-prettier'

const eslintConfig = [
  ...nextCoreWebVitals,
  eslintConfigPrettier,
  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      'no-unused-vars': 'off',
      'prettier/prettier': 'error',
      'react-hooks/set-state-in-effect': 'off',
      'react/no-unescaped-entities': 'off',
    },
  },
]

export default eslintConfig
