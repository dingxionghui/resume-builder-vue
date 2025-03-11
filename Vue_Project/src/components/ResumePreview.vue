<script setup lang="ts">
import { useResumeStore } from '../store/resume';
import { ref, computed } from 'vue';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const store = useResumeStore();
const resumeContent = ref<HTMLElement | null>(null);
const isGeneratingPdf = ref(false);

// 定义额外字段选项（与BasicInfoEditor中的定义保持一致）
const extraFieldOptions = [
  { key: 'wechat', label: '微信号' },
  { key: 'city', label: '现居城市' },
  { key: 'github', label: 'GitHub' },
  { key: 'age', label: '年龄' },
  { key: 'workYears', label: '工作年限' },
  { key: 'gender', label: '性别' },
  { key: 'height', label: '身高' },
  { key: 'weight', label: '体重' },
  { key: 'hometown', label: '籍贯' },
  { key: 'ethnicity', label: '民族' },
  { key: 'politicalStatus', label: '政治面貌' },
  { key: 'maritalStatus', label: '婚姻状况' },
  { key: 'expectedSalary', label: '期望薪资' }
];

// 获取已添加的额外字段
const extraInfoFields = computed(() => {
  const basicFields = ['name', 'phone', 'email', 'avatar', 'jobIntention'];
  const extraKeys = Object.keys(store.basicInfo).filter(key => !basicFields.includes(key));
  
  return extraKeys.map(key => {
    const option = extraFieldOptions.find(opt => opt.key === key);
    return {
      key,
      label: option ? option.label : key,
      value: store.basicInfo[key]
    };
  }).filter(field => field.value);
});

const downloadPdf = async () => {
  if (!resumeContent.value) return;
  
  try {
    isGeneratingPdf.value = true;
    
    // 创建一个通知
    const notification = {
      message: 'PDF生成中...',
      description: '请稍候，正在生成您的简历PDF文件。',
      duration: 0,
    };
    // @ts-ignore - Ant Design Vue的通知API
    const key = Date.now();
    window.$notification.info({
      ...notification,
      key,
    });
    
    // 创建一个包装容器，确保样式隔离
    const wrapper = document.createElement('div');
    wrapper.style.position = 'absolute';
    wrapper.style.left = '-9999px';
    wrapper.style.top = '-9999px';
    wrapper.style.width = '800px';
    wrapper.style.backgroundColor = 'white';
    wrapper.style.padding = '30px';
    
    // 克隆元素并应用所有必要的样式
    const originalElement = resumeContent.value;
    const clonedElement = originalElement.cloneNode(true) as HTMLElement;
    
    // 复制所有计算后的样式
    const copyStyles = (source: HTMLElement, target: HTMLElement) => {
      const sourceStyles = window.getComputedStyle(source);
      Array.from(sourceStyles).forEach(key => {
        target.style.setProperty(key, sourceStyles.getPropertyValue(key), sourceStyles.getPropertyPriority(key));
      });
      
      // 递归处理子元素
      Array.from(source.children).forEach((child, index) => {
        if (target.children[index]) {
          copyStyles(child as HTMLElement, target.children[index] as HTMLElement);
        }
      });
    };
    
    // 将克隆元素添加到包装器
    wrapper.appendChild(clonedElement);
    document.body.appendChild(wrapper);
    
    // 复制样式
    copyStyles(originalElement, clonedElement);
    
    // 确保特定样式正确设置
    const avatarContainer = clonedElement.querySelector('.resume-avatar-container') as HTMLElement;
    if (avatarContainer) {
      avatarContainer.style.width = '100px';
      avatarContainer.style.position = 'relative';
      avatarContainer.style.flexShrink = '0';
    }
    
    const avatarElement = clonedElement.querySelector('.resume-avatar') as HTMLElement;
    if (avatarElement) {
      avatarElement.style.width = '100px';
      avatarElement.style.height = '120px';
      avatarElement.style.overflow = 'hidden';
      avatarElement.style.borderRadius = '4px';
      avatarElement.style.border = '1px solid #eee';
    }
    
    // 移除所有可能的黑色背景
    const allElements = clonedElement.querySelectorAll('*');
    allElements.forEach(el => {
      const element = el as HTMLElement;
      const computedStyle = window.getComputedStyle(element);
      if (computedStyle.backgroundColor === 'rgb(0, 0, 0)' || 
          computedStyle.backgroundColor.includes('rgba(0, 0, 0') ||
          computedStyle.backgroundColor === '#000000') {
        element.style.backgroundColor = 'transparent';
      }
    });
    
    // 等待图片加载
    const images = Array.from(clonedElement.querySelectorAll('img'));
    await Promise.all(images.map(img => {
      if (img.complete) return Promise.resolve();
      return new Promise(resolve => {
        img.onload = resolve;
        img.onerror = resolve;
      });
    }));
    
    // 使用html2canvas转换
    const canvas = await html2canvas(clonedElement, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      allowTaint: false,
      removeContainer: true,
      imageTimeout: 0,
      onclone: (_, element) => {
        // 额外的样式检查
        const elements = element.querySelectorAll('*');
        elements.forEach(el => {
          const computedStyle = window.getComputedStyle(el as Element);
          if (computedStyle.backgroundColor.includes('rgb(0, 0, 0)')) {
            (el as HTMLElement).style.backgroundColor = 'transparent';
          }
        });
      }
    });
    
    // 清理
    document.body.removeChild(wrapper);
    
    // 计算PDF尺寸（A4纸张）
    const imgWidth = 210; // A4宽度，单位mm
    const pageHeight = 297; // A4高度，单位mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    // 添加图像到PDF
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    
    // 如果内容超过一页，添加更多页
    if (imgHeight > pageHeight) {
      let position = -pageHeight; // 从第二页开始的位置
      
      for (let i = 1; i * pageHeight < imgHeight; i++) {
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        position -= pageHeight;
      }
    }
    
    // 生成文件名
    const fileName = `${store.basicInfo.name || '简历'}_${new Date().toLocaleDateString()}.pdf`;
    
    // 下载PDF
    pdf.save(fileName);
    
    // 更新通知
    // @ts-ignore
    window.$notification.success({
      key,
      message: 'PDF生成成功',
      description: `文件 "${fileName}" 已成功下载。`,
      duration: 4,
    });
    
  } catch (error) {
    console.error('生成PDF时出错:', error);
    // @ts-ignore
    window.$notification.error({
      message: 'PDF生成失败',
      description: '生成PDF时发生错误，请稍后重试。',
      duration: 4,
    });
  } finally {
    isGeneratingPdf.value = false;
  }
};

// 添加内容格式化函数
const formatContent = (content: string) => {
  // 如果内容包含 HTML 标签，直接返回纯文本
  if (content.includes('<') && content.includes('>')) {
    return content.replace(/<[^>]*>/g, '\n')
      .split('\n')
      .filter(line => line.trim())
      .join('\n');
  }
  // 否则保持原样返回
  return content;
};
</script>

<template>
  <div class="preview-panel">
    <div class="preview-header">
      <div class="preview-controls">
        <a-button 
          type="primary" 
          @click="downloadPdf"
          :loading="isGeneratingPdf"
        >
          {{ isGeneratingPdf ? '生成中...' : '下载PDF' }}
        </a-button>
        <div class="style-controls">
          <a-button size="small">模板风格</a-button>
          <a-button size="small">添加模块</a-button>
          <a-button size="small">间距配置</a-button>
        </div>
      </div>
    </div>
    
    <div class="preview-content" ref="resumeContent">
      <!-- 简历头部 -->
      <div class="resume-header">
        <div class="resume-name">{{ store.basicInfo.name || '姓名' }}</div>
        
        <div class="resume-info-container">
          <!-- 左侧信息区域 -->
          <div class="resume-info-left">
            <!-- 统一的信息显示区域 -->
            <div class="resume-info-content">
              <!-- 基础联系信息 -->
              <span v-if="store.basicInfo.phone" class="info-item">
                📞 {{ store.basicInfo.phone }}
              </span>
              <span v-if="store.basicInfo.email" class="info-item">
                📧 {{ store.basicInfo.email }}
              </span>
              <span v-if="store.basicInfo.jobIntention" class="info-item">
                🖥️ {{ store.basicInfo.jobIntention }}
              </span>
              
              <!-- 额外信息字段 -->
              <span 
                v-for="field in extraInfoFields" 
                :key="field.key" 
                class="info-item"
              >
                {{ field.label }}: {{ field.value }}
              </span>
            </div>
          </div>
          
          <!-- 右侧头像区域 -->
          <div class="resume-avatar-container" v-if="store.basicInfo.avatar">
            <div class="resume-avatar">
              <img :src="store.basicInfo.avatar" alt="头像">
            </div>
          </div>
        </div>
      </div>
      
      <!-- 模块内容 -->
      <div 
        v-for="module in store.modules.filter(m => m.enabled && m.id !== 'basic-info')" 
        :key="module.id"
        class="resume-section"
      >
        <div class="section-title">{{ module.name }}</div>
        <div 
          class="section-content" 
          v-if="module.content"
          v-html="module.content"
        ></div>
        <div 
          class="section-content placeholder" 
          v-else
        >
          点击左侧模块编辑此内容
        </div>
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
  margin-bottom: 30px;
}

.resume-name {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 15px;
  color: #333;
}

.resume-info-container {
  display: flex !important;
  justify-content: space-between !important;
  width: 100% !important;
}

.resume-info-left {
  flex: 1 !important;
  padding-right: 20px !important;
}

.resume-info-content {
  display: flex !important;
  flex-wrap: wrap !important;
  gap: 8px 16px !important; /* 垂直间距8px，水平间距16px */
  align-items: center !important;
  margin-bottom: 10px !important;
}

.info-item {
  background-color: #f5f5f5 !important;
  padding: 4px 12px !important;
  border-radius: 4px !important;
  white-space: nowrap !important;
  display: inline-flex !important;
  align-items: center !important;
  font-size: 14px !important;
  color: #666 !important;
}

.resume-avatar-container {
  width: 100px !important;
  flex-shrink: 0 !important;
  position: relative !important;
}

.resume-avatar {
  width: 100px !important;
  height: 120px !important;
  overflow: hidden !important;
  border-radius: 4px !important;
  border: 1px solid #eee !important;
}

.resume-avatar img {
  width: 100% !important;
  height: 100% !important;
  object-fit: cover !important;
}

.resume-section {
  margin-bottom: 25px;
  page-break-inside: avoid;
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
  line-height: 1.6;
  white-space: pre-wrap !important;
}

.section-content.placeholder {
  color: #999;
  font-style: italic;
}

/* 打印样式优化 */
@media print {
  .preview-content {
    padding: 0;
    box-shadow: none;
  }
  
  .resume-section {
    page-break-inside: avoid;
  }
}
</style> 