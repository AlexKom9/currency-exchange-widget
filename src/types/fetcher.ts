export interface Fetcher {
  apiGet: (url: string) => Promise<any>
}
