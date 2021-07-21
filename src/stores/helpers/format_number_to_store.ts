export const formatNumberToStore = (str: string | number = ''): string => {
  return String(str)
    .replace(/[^0-9.]/g, '')
    .replace(/^([^.]*\.)(.*)$/, function (_, pattern1, pattern2) {
      return pattern1 + pattern2.replaceAll('.', '')
    })
    .replace(/-|\+/, '')
    .split('.')
    .map((item, index) => (index === 1 ? item.slice(0, 2) : item))
    .join('.')
}
