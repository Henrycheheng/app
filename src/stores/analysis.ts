import { defineStore } from 'pinia'
import axios from 'axios'

interface FinancialMetrics {
  roe: number
  debtRatio: number
  dividend: number
  cashFlow: number
  investmentDecision: string
  capitalStructure: number
  wacc: number
}

export const useAnalysisStore = defineStore('analysis', {
  state: () => ({
    financialData: null as any,
    metrics: null as FinancialMetrics | null,
    loading: false,
    error: null as string | null
  }),

  actions: {
    async fetchFinancialData(stockCode: string) {
      this.loading = true
      try {
        const response = await axios.get(`/api/financial/${stockCode}`)
        this.financialData = response.data
        this.calculateMetrics()
      } catch (err) {
        this.error = '获取财务数据失败'
        console.error(err)
      } finally {
        this.loading = false
      }
    },

    calculateMetrics() {
      if (!this.financialData) return

      const data = this.financialData
      this.metrics = {
        // ROE = 净利润 / 股东权益
        roe: data.netProfit / data.shareholderEquity * 100,

        // 负债率 = 总负债 / 总资产
        debtRatio: data.totalLiabilities / data.totalAssets * 100,

        // 股利支付率
        dividend: data.dividendPayment / data.netProfit * 100,

        // 经营现金流量
        cashFlow: data.operatingCashFlow,

        // 投融资决策评估
        investmentDecision: this.evaluateInvestment(data),

        // 资本结构
        capitalStructure: data.longTermDebt / (data.longTermDebt + data.shareholderEquity) * 100,

        // WACC计算
        wacc: this.calculateWACC(data)
      }
    },

    evaluateInvestment(data: any): string {
      // 根据多个指标综合评估投资决策
      const roe = data.netProfit / data.shareholderEquity
      const debtRatio = data.totalLiabilities / data.totalAssets
      const cashFlow = data.operatingCashFlow

      if (roe > 0.15 && debtRatio < 0.5 && cashFlow > 0) {
        return '投资建议：适合投资'
      } else if (roe > 0.1 && debtRatio < 0.7 && cashFlow > 0) {
        return '投资建议：谨慎投资'
      } else {
        return '投资建议：暂不建议投资'
      }
    },

    calculateWACC(data: any): number {
      // WACC = 权益成本 * 权益比例 + 债务成本 * (1 - 所得税率) * 债务比例
      const equityRatio = data.shareholderEquity / (data.totalAssets)
      const debtRatio = 1 - equityRatio
      const equityCost = 0.1 // 假设权益成本为10%
      const debtCost = 0.05 // 假设债务成本为5%
      const taxRate = 0.25 // 假设所得税率为25%

      return equityCost * equityRatio + debtCost * (1 - taxRate) * debtRatio
    },

    async generateReport() {
      if (!this.metrics) return

      try {
        const response = await axios.post('/api/report/generate', {
          metrics: this.metrics,
          financialData: this.financialData
        }, {
          responseType: 'blob'
        })

        // 创建下载链接
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', 'financial-analysis-report.pdf')
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } catch (err) {
        this.error = '生成报告失败'
        console.error(err)
      }
    }
  }
})