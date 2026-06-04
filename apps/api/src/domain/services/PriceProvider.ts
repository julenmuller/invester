export interface PriceProvider {
  getCurrentPrice(ticker: string): Promise<number>;
}
