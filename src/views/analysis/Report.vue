<template>
  <div class="report-view">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>分析报告</span>
        </div>
      </template>
      <!-- 分析报告内容将在这里显示 -->
      <el-empty description="请先生成分析报告" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { useAnalysisStore } from '@/stores/analysis'

const analysisStore = useAnalysisStore()
</script>