<script setup lang="ts">
import { ref } from 'vue';
import { useResumeStore } from './store/resume';
import ModuleSelector from './components/ModuleSelector.vue';
import ModuleEditor from './components/ModuleEditor.vue';
import ResumePreview from './components/ResumePreview.vue';

const store = useResumeStore();
const activeModuleId = ref('basic-info');

const handleSelectModule = (moduleId: string) => {
  activeModuleId.value = moduleId;
};
</script>

<template>
  <a-layout style="min-height: 100vh; width: 100%;">
    <a-layout>
      <!-- 左侧模块选择器 -->
      <a-layout-sider width="250" theme="light" class="sidebar">
        <div class="sidebar-header">
          <h3>模块编辑</h3>
        </div>
        <ModuleSelector @select-module="handleSelectModule" />
      </a-layout-sider>
      
      <a-layout-content class="content">
        <a-row>
          <a-col :span="12">
            <a-card title="编辑" class="edit-card">
              <ModuleEditor :module-id="activeModuleId" />
            </a-card>
          </a-col>
          <a-col :span="12">
            <a-card title="预览" class="preview-card">
              <ResumePreview />
            </a-card>
          </a-col>
        </a-row>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<style scoped>
.sidebar {
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.sidebar-header {
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.sidebar-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
}

.content {
  padding-top: 0;
}

.edit-card, .preview-card {
  margin: 0 24px 24px 24px;
  height: calc(100vh - 24px);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

:deep(.ant-card-body) {
  flex: 1;
  overflow: auto;
  padding: 0;
}
</style>
