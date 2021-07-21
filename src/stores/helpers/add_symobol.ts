export const addSymbol = (
  value: number | string,
  sign: '-' | '+',
  formatter?: (value: number) => string
) =>
  value
    ? `${sign}${
        typeof formatter === 'function' ? formatter(Number(value)) : value
      }`
    : ''
