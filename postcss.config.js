module.exports = {
  plugins: {
    'postcss-flexbugs-fixes': {},
    '@csstools/postcss-global-data': {
      files: ['./styles/globals.css'],
    },
    'postcss-preset-env': {
      autoprefixer: {},
      stage: 3,
      features: {
        'custom-media-queries': true,
      }
    },
    cssnano: {
      preset: 'default',
    },
  },
};
