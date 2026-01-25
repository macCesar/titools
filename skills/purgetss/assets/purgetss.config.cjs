module.exports = {
  purge: {
    mode: 'all',
    method: 'sync',
    options: {
      missing: true,
      widgets: false,
      safelist: []
    }
  },
  theme: {
    extend: {
      colors: {},
      spacing: {}
    }
  }
}
