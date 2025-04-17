<template>
  <div class="financial-analysis">
    <div class="search-section">
      <el-input
        v-model="stockCode"
        placeholder="请输入股票代码"
        class="search-input"
        clearable
      >
        <template #append>
          <el-button @click="handleSearch" :loading="analysisStore.loading">
            <el-icon><Search /></el-icon>
            查询
          </el-button>
        </template>
      </el-input>
    </div>

    <el-row :gutter="20" v-if="analysisStore.metrics">
      <el-col :span="8">
        <el-card class="metric-card">
          <template #header>
            <div class="card-header">
              <span>ROE (净资产收益率)</span>
              <el-tooltip content="反映公司利用股东投入资本的获利能力" placement="top">
                <el-icon><InfoFilled /></el-icon>
              </el-tooltip>
            </div>
          </template>
          <div class="metric-value">
            {{ analysisStore.metrics.roe.toFixed(2) }}%
          </div>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card class="metric-card">
          <template #header>
            <div class="card-header">
              <span>负债率</span>
              <el-tooltip content="反映公司的长期偿债能力" placement="top">
                <el-icon><InfoFilled /></el-icon>
              </el-tooltip>
            </div>
          </template>
          <div class="metric-value">
            {{ analysisStore.metrics.debtRatio.toFixed(2) }}%
          </div>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card class="metric-card">
          <template #header>
            <div class="card-header">
              <span>股利支付率</span>
              <el-tooltip content="反映公司的分红政策" placement="top">
                <el-icon><InfoFilled /></el-icon>
              </el-tooltip>
            </div>
          </template>
          <div class="metric-value">
            {{ analysisStore.metrics.dividend.toFixed(2) }}%
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="mt-20" v-if="analysisStore.metrics">
      <el-col :span="8">
        <el-card class="metric-card">
          <template #header>
            <div class="card-header">
              <span>经营现金流</span>
              <el-tooltip content="反映公司的现金创造能力" placement="top">
                <el-icon><InfoFilled /></el-icon>
              </el-tooltip>
            </div>
          </template>
          <div class="metric-value">
            {{ (analysisStore.metrics.cashFlow / 100000000).toFixed(2) }}亿
          </div>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card class="metric-card">
          <template #header>
            <div class="card-header">
              <span>资本结构 (WACC)</span>
              <el-tooltip content="反映公司的融资成本" placement="top">
                <el-icon><InfoFilled /></el-icon>
              </el-tooltip>
            </div>
          </template>
          <div class="metric-value">
            {{ (analysisStore.metrics.wacc * 100).toFixed(2) }}%
          </div>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card class="metric-card">
          <template #header>
            <div class="card-header">
              <span>投资建议</span>
              <el-tooltip content="基于综合财务指标的投资建议" placement="top">
                <el-icon><InfoFilled /></el-icon>
              </el-tooltip>
            </div>
          </template>
          <div class="metric-value suggestion">
            {{ analysisStore.metrics.investmentDecision }}
          </div>
        </el-card>
      </el-col>
    </el-row>

    <div class="actions mt-20" v-if="analysisStore.metrics">
      <el-button type="primary" @click="handleGenerateReport" :loading="generating">
        <el-icon><Document /></el-icon>
        生成分析报告
      </el-button>
    </div>

    <el-empty v-if="!analysisStore.metrics && !analysisStore.loading" description="请输入股票代码查询财务指标" />

    <el-alert
      v-if="analysisStore.error"
      :title="analysisStore.error"
      type="error"
      show-icon
      closable
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAnalysisStore } from '@/stores/analysis'
import { Search, InfoFilled, Document } from '@element-plus/icons-vue'

const analysisStore = useAnalysisStore()
const stockCode = ref('')
const generating = ref(false)

const handleSearch = async () => {
  if (!stockCode.value) {
    ElMessage.warning('请输入股票代码')
    return
  }
  await analysisStore.fetchFinancialData(stockCode.value)
}

const handleGenerateReport = async () => {
  generating.value = true
  try {
    await analysisStore.generateReport()
    ElMessage.success('报告生成成功')
  } catch (error) {
    ElMessage.error('报告生成失败')
  } finally {
    generating.value = false
  }
}
</script>

<style scoped lang="scss">
.financial-analysis {
  .search-section {
    margin-bottom: 20px;
    .search-input {
      max-width: 400px;
    }
  }

  .metric-card {
    background-color: var(--el-bg-color);
    border: 1px solid var(--el-border-color);

    .card-header {
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--el-text-color-primary);

      .el-icon {
        font-size: 16px;
        color: var(--el-text-color-secondary);
        cursor: help;
      }
    }

    .metric-value {
      font-size: 24px;
      font-weight: bold;
      color: var(--el-text-color-primary);
      text-align: center;
      margin: 10px 0;

      &.suggestion {
        font-size: 18px;
      }
    }
  }

  .mt-20 {
    margin-top: 20px;
  }

  .actions {
    display: flex;
    justify-content: center;
  }
}
</style>