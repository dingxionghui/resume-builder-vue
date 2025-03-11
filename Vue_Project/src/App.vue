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
  <a-layout style="min-height: 100vh; width: 100%;">
    <!-- 左侧模块选择 -->
    <a-layout-sider width="200" theme="light">
      <div class="logo">简历生成器</div>
      <module-selector @select-module="handleModuleSelect" />
    </a-layout-sider>
    
    <!-- 中间和右侧内容 -->
    <a-layout>
      <a-layout-content>
        <a-row>
          <!-- 编辑区 -->
          <a-col :span="12">
            <div style="padding: 20px; background: #f5f5f5; height: 100%;">
              <a-card :title="currentModuleTitle" class="edit-card">
                <module-editor :module-id="currentModuleId" />
              </a-card>
            </div>
          </a-col>
          
          <!-- 预览区 -->
          <a-col :span="12">
            <div style="padding: 20px; background: #f5f5f5; height: 100%;">
              <resume-preview />
            </div>
          </a-col>
        </a-row>
      </a-layout-content>
    </a-layout>
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

.edit-card {
  height: 100%;
}
</style>
