<template>
  <el-container class="layout-container">
    <el-aside width="200px" class="sidebar">
      <el-menu
        :default-active="route.path"
        class="el-menu-vertical"
        :router="true"
        background-color="#1f1f1f"
        text-color="#fff"
        active-text-color="#409EFF"
      >
        <el-menu-item index="/">
          <el-icon><House /></el-icon>
          <span>首页</span>
        </el-menu-item>

        <el-sub-menu index="/market">
          <template #title>
            <el-icon><TrendCharts /></el-icon>
            <span>行情数据</span>
          </template>
          <el-menu-item index="/market/stocks">股票行情</el-menu-item>
          <el-menu-item index="/market/bonds">债券行情</el-menu-item>
          <el-menu-item index="/market/funds">基金行情</el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="/analysis">
          <template #title>
            <el-icon><DataAnalysis /></el-icon>
            <span>财务分析</span>
          </template>
          <el-menu-item index="/analysis/financial">财务指标</el-menu-item>
          <el-menu-item index="/analysis/report">分析报告</el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header height="60px" class="header">
        <div class="header-title">
          <h2>金融分析系统</h2>
        </div>
      </el-header>

      <el-main class="main-content">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { House, TrendCharts, DataAnalysis } from '@element-plus/icons-vue'
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<style scoped lang="scss">
.layout-container {
  min-height: 100vh;
}

.sidebar {
  background-color: var(--el-bg-color);
  border-right: 1px solid var(--el-border-color);

  .el-menu {
    border-right: none;
  }
}

.header {
  background-color: var(--el-bg-color);
  border-bottom: 1px solid var(--el-border-color);
  display: flex;
  align-items: center;
  padding: 0 20px;

  .header-title {
    h2 {
      margin: 0;
      color: var(--el-text-color-primary);
    }
  }
}

.main-content {
  background-color: var(--el-bg-color-page);
  padding: 20px;
}
</style>