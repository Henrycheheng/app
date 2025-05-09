import { defineStore } from 'pinia'
import http from '@/utils/http'

interface Bond {
  code: string
  name: string
  price: number
  yield: number
}

interface Fund {
  code: string
  name: string
  nav: number
  type: string
}

interface Stock {
  code: string
  name: string
  price: number
  change: number
}

export const useMarketStore = defineStore('market', {
  state: () => ({
    stocks: [] as Stock[],
    bonds: [] as Bond[],
    funds: [] as Fund[],
    loading: false,
    error: null as string | null
  }),

  getters: {
    // 获取涨幅最大的股票
    topGainer: (state) => {
      return state.stocks.length > 0
        ? [...state.stocks].sort((a, b) => b.change - a.change)[0]
        : null
    },
    // 获取收益率最高的债券
    highestYieldBond: (state) => {
      return state.bonds.length > 0
        ? [...state.bonds].sort((a, b) => b.yield - a.yield)[0]
        : null
    }
  },

  actions: {
    async fetchStocks() {
      this.loading = true
      try {
        const response = await http.get('/api/stocks')
        this.stocks = response.data.map((item: any) => ({
          code: item.symbol,
          name: item.name,
          price: item.currentPrice,
          change: item.changePercent
        }))
      } catch (err) {
        this.error = '获取股票数据失败'
        console.error(err)
      } finally {
        this.loading = false
      }
    },

    async fetchBonds() {
      this.loading = true
      try {
        const response = await http.get('/api/bonds')
        this.bonds = response.data.map((item: any) => ({
          code: item.bondCode,
          name: item.bondName,
          price: item.price,
          yield: item.yield
        }))
      } catch (err) {
        this.error = '获取债券数据失败'
        console.error(err)
      } finally {
        this.loading = false
      }
    },

    async fetchFunds() {
      this.loading = true
      try {
        const response = await http.get('/api/funds')
        this.funds = response.data.map((item: any) => ({
          code: item.fundCode,
          name: item.fundName,
          nav: item.netAssetValue,
          type: item.fundType
        }))
      } catch (err) {
        this.error = '获取基金数据失败'
        console.error(err)
      } finally {
        this.loading = false
      }
    }
  }
})