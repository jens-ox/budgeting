module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true
  },
  theme: {
    extend: {
      screens: {
        print: { raw: 'print' }
      }
    },
    stroke: (theme) => ({
      gray: theme('colors.gray.300')
    }),
    fill: (theme) => ({
      gray: theme('colors.gray.600'),
      green: theme('colors.green.500'),
      red: theme('colors.red.500')
    })
  }
}
