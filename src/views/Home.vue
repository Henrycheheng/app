<template>
  <div class="home-view">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>金融分析系统</span>
        </div>
      </template>
      <div class="welcome-message">
        <h3>欢迎使用金融分析系统</h3>
        <p>请从左侧菜单选择功能</p>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.home-view {
  padding: 20px;

  .welcome-message {
    text-align: center;
    padding: 40px 0;

    h3 {
      margin-bottom: 20px;
    }
  }
}
</style>