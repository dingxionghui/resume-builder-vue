<script setup lang="ts">
import { useResumeStore } from '../store/resume';
import { ref } from 'vue';

const store = useResumeStore();

const downloadPdf = () => {
  alert('PDF下载功能将在后续实现');
  // 这里将实现PDF下载功能
};
</script>

<template>
  <div class="preview-panel">
    <div class="preview-header">
      <div class="preview-controls">
        <a-button type="primary" @click="downloadPdf">下载PDF</a-button>
        <div class="style-controls">
          <a-button size="small">模板风格</a-button>
          <a-button size="small">添加模块</a-button>
          <a-button size="small">间距配置</a-button>
        </div>
      </div>
    </div>
    
    <div class="preview-content">
      <!-- 简历头部 -->
      <div class="resume-header">
        <div class="resume-name">{{ store.basicInfo.name || '姓名' }}</div>
        <div class="resume-contact">
          <span v-if="store.basicInfo.phone">📱 {{ store.basicInfo.phone }}</span>
          <span v-if="store.basicInfo.email">📧 {{ store.basicInfo.email }}</span>
        </div>
        <div class="resume-status">
          <span v-if="store.basicInfo.jobIntention">🖥️ {{ store.basicInfo.jobIntention }}</span>
        </div>
        <div class="resume-avatar" v-if="store.basicInfo.avatar">
          <img :src="store.basicInfo.avatar" alt="头像">
        </div>
      </div>
      
      <!-- 模块内容 -->
      <div 
        v-for="module in store.modules.filter(m => m.enabled)" 
        :key="module.id"
        class="resume-section"
      >
        <div class="section-title">{{ module.name }}</div>
        <div class="section-content" v-html="store.getModuleContent?.(module.id) || '点击左侧模块编辑此内容'"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.preview-panel {
  height: 100%;
  overflow-y: auto;
}

.preview-header {
  margin-bottom: 20px;
}

.preview-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.style-controls {
  display: flex;
  gap: 10px;
}

.preview-content {
  background-color: white;
  border-radius: 4px;
  padding: 30px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

/* 简历样式 */
.resume-header {
  position: relative;
  margin-bottom: 30px;
}

.resume-name {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
}

.resume-contact, .resume-status {
  display: flex;
  gap: 15px;
  margin-bottom: 5px;
  font-size: 14px;
  color: #666;
}

.resume-avatar {
  position: absolute;
  top: 0;
  right: 0;
  width: 80px;
  height: 100px;
  overflow: hidden;
  border-radius: 4px;
}

.resume-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.resume-section {
  margin-bottom: 25px;
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  color: #4285f4;
  padding-bottom: 8px;
  border-bottom: 2px solid #4285f4;
  margin-bottom: 15px;
}

.section-content {
  font-size: 14px;
  color: #333;
}
</style> 