<template>
  <div class="bonds-view">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>债券行情</span>
        </div>
      </template>
      <el-table
        v-loading="marketStore.loading"
        :data="marketStore.bonds"
        style="width: 100%"
      >
        <el-table-column prop="code" label="债券代码" width="120" />
        <el-table-column prop="name" label="债券名称" />
        <el-table-column prop="price" label="最新价" width="100" />
        <el-table-column prop="yield" label="收益率" width="100" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { useMarketStore } from '@/stores/market'

const marketStore = useMarketStore()

// 组件挂载时获取债券数据
onMounted(() => {
  marketStore.fetchBonds()
})
</script>