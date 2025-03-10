<script setup lang="ts">
import { ref, computed } from 'vue';
import ModuleSelector from './components/ModuleSelector.vue';
import ModuleEditor from './components/ModuleEditor.vue';
import ResumePreview from './components/ResumePreview.vue';

const currentModuleId = ref('basic-info');
const currentModuleTitle = computed(() => {
  const titles: Record<string, string> = {
    'basic-info': '基本信息',
    'education': '教育经历',
    'skills': '专业技能',
    // 其他模块...
  };
  return titles[currentModuleId.value] || '编辑模块';
});

const handleModuleSelect = (moduleId: string) => {
  currentModuleId.value = moduleId;
};
</script>

<template>
  <a-layout style="min-height: 100vh">
    <!-- 左侧模块选择 -->
    <a-layout-sider width="250" theme="light">
      <div class="logo">简历生成器</div>
      <module-selector @select-module="handleModuleSelect" />
    </a-layout-sider>
    
    <!-- 中间编辑区 -->
    <a-layout-content style="padding: 20px">
      <a-card :title="currentModuleTitle">
        <module-editor :module-id="currentModuleId" />
      </a-card>
    </a-layout-content>
    
    <!-- 右侧预览 -->
    <a-layout-sider width="400" theme="light" style="padding: 20px">
      <resume-preview />
    </a-layout-sider>
  </a-layout>
</template>

<style scoped>
.logo {
  height: 50px;
  line-height: 50px;
  color: #4285f4;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  border-bottom: 1px solid #e8e8e8;
  margin-bottom: 10px;
}
</style>
