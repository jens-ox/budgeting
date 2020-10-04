import currency from 'currency.js'

const showAmount = (cents: number): string =>
  currency(cents, { fromCents: true }).format({ symbol: '€' })

export default showAmount
