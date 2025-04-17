<template>
  <div class="funds-view">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>基金行情</span>
        </div>
      </template>
      <el-table
        v-loading="marketStore.loading"
        :data="marketStore.funds"
        style="width: 100%"
      >
        <el-table-column prop="code" label="基金代码" width="120" />
        <el-table-column prop="name" label="基金名称" />
        <el-table-column prop="nav" label="单位净值" width="100" />
        <el-table-column prop="type" label="基金类型" width="120" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { useMarketStore } from '@/stores/market'

const marketStore = useMarketStore()

// 组件挂载时获取基金数据
onMounted(() => {
  marketStore.fetchFunds()
})
</script>