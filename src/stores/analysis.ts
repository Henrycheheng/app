import { defineStore } from 'pinia'
import http from '@/utils/http'

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
        const response = await http.get(`/api/stocks/financial/${stockCode}`)
        this.financialData = response?.data
        this.calculateMetrics()
      } catch (err) {
        this.error = '获取财务数据失败'
        console.error(err)
      } finally {
        this.loading = false
      }
    },

    calculateMetrics() {
      if (!this.financialData) return;

      const data = this.financialData;
      this.metrics = {
        // 确保所有数值计算都转换为数字类型
        roe: Number((data.netProfit / data.shareholderEquity * 100).toFixed(2)),
        debtRatio: Number((data.totalLiabilities / data.totalAssets * 100).toFixed(2)),
        dividend: Number((data.dividendPayment / data.netProfit * 100).toFixed(2)),
        cashFlow: Number(data.operatingCashFlow),
        investmentDecision: this.evaluateInvestment(data),
        capitalStructure: Number((data.longTermDebt / (data.longTermDebt + data.shareholderEquity) * 100).toFixed(2)),
        wacc: Number(this.calculateWACC(data).toFixed(2))
      };
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
        const response = await http.post('/api/report/generate', {
          metrics: this.metrics,
          financialData: this.financialData
        }, {
          responseType: 'blob'
        })

        if (response.status >= 400) {
          throw new Error('报告生成失败')
        }

        // 修复1：确保正确获取blob数据
        const blob = response.data instanceof Blob
          ? response.data
          : new Blob([response.data], { type: 'application/pdf' });

        // 修复2：创建更可靠的下载链接
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'financial-analysis-report.pdf';

        // 修复3：添加更可靠的事件处理
        a.onclick = () => {
          setTimeout(() => {
            URL.revokeObjectURL(url);
            document.body.removeChild(a);
          }, 100);
        };

        document.body.appendChild(a);
        a.click();

      } catch (err: any) {
        this.error = '生成报告失败: ' + (err?.message || '服务器错误');
        console.error(err);
      }
    }
  }
})