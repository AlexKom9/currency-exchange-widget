export const formatNumberToStore = (str: string | number = ''): string => {
  let result = String(str)
    .replace(/[^0-9.]/g, '')
    .replace(/^([^.]*\.)(.*)$/, function (_, pattern1, pattern2) {
      return pattern1 + pattern2.replace(/\./g, '')
    })
    .replace(/-|\+/, '')
    .split('.')
    .map((item, index) => (index === 1 ? item.slice(0, 2) : item))
    .join('.')


  if (result.length === 2 && result[0] === '0' && Number(result[1]) > 0) {
    return result.slice(1)
  }

  return result
}
