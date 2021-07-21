import currencyFormatter from 'currency-formatter'

export function formatValueInCurrency({
  value,
  currency,
  precision = 0
}: {
  value: number
  currency: string,
  precision?: number
}) {
  return currencyFormatter.format(value, {
    code: currency,
    precision,
    format: '%s%v',
  })
}


