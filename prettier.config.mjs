const prettierConfig = {
  arrowParens: 'always',
  semi: false,
  trailingComma: 'all',
  singleQuote: true,
  bracketSpacing: true,
  plugins: ['prettier-plugin-tailwindcss'],
  tailwindStylesheet: './src/app/globals.css',
  tailwindFunctions: ['cn'],
}

export default prettierConfig
