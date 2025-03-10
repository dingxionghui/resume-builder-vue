<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useResumeStore } from '../../store/resume';

const props = defineProps<{
  moduleId: string,
  content?: string
}>();

const store = useResumeStore();
const editorContent = ref(props.content || getDefaultContent(props.moduleId));

// 执行编辑器命令
const execCommand = (command: string, value: string | null = null) => {
  document.execCommand(command, false, value);
  updateContent();
};

// 插入链接
const insertLink = () => {
  const url = prompt('请输入链接地址:', 'http://');
  if (url) {
    execCommand('createLink', url);
  }
};

// 更新内容到store
const updateContent = () => {
  const content = editorContent.value;
  store.updateModuleContent?.(props.moduleId, content);
};

// 获取默认内容
function getDefaultContent(moduleId: string) {
  const defaultContents: Record<string, string> = {
    'education': `
      <div class="education-item">
        <div class="edu-header">
          <span class="edu-school">浙江大学</span>
          <span class="edu-time">2019-09 ~ 2023-06</span>
        </div>
        <div class="edu-major">计算机科学与技术 本科</div>
        <div class="edu-description">
          <p>描述你的学习经历、成就和活动...</p>
        </div>
      </div>
    `,
    'skills': `
      <p>描述你的技能，尽量具体和量化，使用数字、百分比或具体的项目经验来支持你的陈述。</p>
      <p>如，"成功管理了5个项目，每个项目的预算超过100万美元，并在预定时间内完成了它们"</p>
    `,
    'work': `
      <div class="work-item">
        <div class="work-header">
          <span class="work-company">鱼互联网有限公司</span>
          <span class="work-time">2023-02 ~ 2023-04</span>
        </div>
        <div class="work-position">创新业务部 全栈开发 杭州</div>
        <div class="work-description">
          <p>工作描述...</p>
        </div>
      </div>
    `
  };
  
  return defaultContents[moduleId] || `<p>在这里编辑${moduleId}内容...</p>`;
}

// 监听内容变化
watch(() => props.moduleId, () => {
  editorContent.value = getDefaultContent(props.moduleId);
});
</script>

<template>
  <div class="rich-text-editor">
    <div class="editor-toolbar">
      <a-button-group>
        <a-button @click="execCommand('bold')" title="加粗">B</a-button>
        <a-button @click="execCommand('italic')" title="斜体">I</a-button>
        <a-button @click="execCommand('underline')" title="下划线">U</a-button>
      </a-button-group>
      
      <a-divider type="vertical" />
      
      <a-button-group>
        <a-button @click="execCommand('justifyLeft')" title="左对齐">⟵</a-button>
        <a-button @click="execCommand('justifyCenter')" title="居中对齐">⟷</a-button>
        <a-button @click="execCommand('justifyRight')" title="右对齐">⟶</a-button>
      </a-button-group>
      
      <a-divider type="vertical" />
      
      <a-button-group>
        <a-button @click="execCommand('insertUnorderedList')" title="无序列表">•</a-button>
        <a-button @click="execCommand('insertOrderedList')" title="有序列表">1.</a-button>
        <a-button @click="insertLink" title="插入链接">🔗</a-button>
      </a-button-group>
    </div>
    
    <div 
      class="editor-content" 
      contenteditable="true"
      v-html="editorContent"
      @input="updateContent"
    ></div>
  </div>
</template>

<style scoped>
.rich-text-editor {
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 20px;
}

.editor-toolbar {
  background-color: #f5f5f5;
  border-bottom: 1px solid #ddd;
  padding: 8px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.editor-content {
  min-height: 200px;
  padding: 15px;
  background-color: white;
  overflow-y: auto;
  line-height: 1.5;
}

.editor-content:focus {
  outline: none;
}

/* 编辑器内容样式 */
:deep(.editor-content p) {
  margin-bottom: 10px;
}

:deep(.editor-content ul), :deep(.editor-content ol) {
  margin-left: 20px;
  margin-bottom: 10px;
}

:deep(.editor-content a) {
  color: #4285f4;
  text-decoration: underline;
}
</style> 