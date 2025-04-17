<template>
  <div class="stocks-view">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>股票行情</span>
          <el-button @click="refresh" :loading="marketStore.loading">
            <el-icon><Refresh /></el-icon>
            刷新
          </el-button>
        </div>
      </template>

      <el-table
        v-loading="marketStore.loading"
        :data="marketStore.stocks"
        style="width: 100%"
      >
        <el-table-column prop="code" label="股票代码" width="120" />
        <el-table-column prop="name" label="股票名称" />
        <el-table-column prop="price" label="最新价" width="100" />
        <el-table-column prop="change" label="涨跌幅" width="100">
          <template #default="{row}">
            <span :class="row.change >= 0 ? 'up' : 'down'">
              {{ row.change >= 0 ? '+' : '' }}{{ row.change.toFixed(2) }}%
            </span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { Refresh } from '@element-plus/icons-vue'
import { useMarketStore } from '@/stores/market'

const marketStore = useMarketStore()

const refresh = () => {
  marketStore.fetchStocks()
}

// 初始化加载数据
onMounted(() => {
  if (marketStore.stocks.length === 0) {
    refresh()
  }
})
</script>

<style scoped>
.up {
  color: #f56c6c;
}
.down {
  color: #67c23a;
}
</style>