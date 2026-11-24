const isProd = process.env.NODE_ENV === 'production'

export default {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
    ...(isProd ? { cssnano: { preset: 'default' } } : {}),
  },
}
