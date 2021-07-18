// export const getMock = (path) => {
//   const fileValue = String(fs.readFileSync(path))
import { RatesResponse } from '../../fixtures/rates_response'
import { Fetcher } from '../../types/fetcher'

//   try {
//     return JSON.parse(fileValue)
//   } catch (e) {
//     throw new Error(
//       JSON.stringify({
//         error: e.message,
//         fileName: path,
//         fileValue: fileValue,
//       }),
//     )
//   }
// }

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export class FakeFetcher implements Fetcher {
  randomizeRates: boolean
  responsesToMock: Array<typeof RatesResponse>

  constructor({ randomizeRates = true } = {}) {
    this.randomizeRates = randomizeRates
    this.responsesToMock = []
  }

  apiGet(url: string) {
    if (url.includes('openexchangerates.org/api/latest.json')) {
      return new Promise((resolve) => {
        if (!this.randomizeRates) {
          if (this.responsesToMock.length) {
            resolve(this.responsesToMock.pop() || {})
            return
          }

          resolve(RatesResponse)
        }

        const processedRates = Object.entries(RatesResponse.rates).reduce(
          (accum, [key, value]: [string, number]) => {
            const cof = value / 100
            const diff = getRandomInt(0, 5)

            return { ...accum, [key]: value + diff * cof }
          },
          {}
        )

        resolve({ ...RatesResponse, rates: processedRates })
      })
    }

    return new Promise((_, reject) => {
      reject({ status: 404, message: 'Not found' })
    })
  }
}
