<script setup lang="ts">
</script>

<template>
  <router-view />
</template>

<style>
#app {
  width: 100%;
  height: 100vh;
  margin: 0;
  padding: 0;
  background-color: var(--el-bg-color-page);
  color: var(--el-text-color-primary);
}

/* 全局样式 */
.el-card {
  --el-card-border-color: var(--el-border-color-light);
}

.el-menu {
  --el-menu-bg-color: var(--el-bg-color);
  --el-menu-text-color: var(--el-text-color-primary);
  --el-menu-hover-bg-color: var(--el-color-primary-light-9);
}
</style>
