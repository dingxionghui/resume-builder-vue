<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue';
import { useResumeStore } from '../../store/resume';
import { storeToRefs } from 'pinia';

const props = defineProps<{
  moduleId: string
}>();

const store = useResumeStore();
const { modules } = storeToRefs(store);
const editorRef = ref<HTMLDivElement | null>(null);

// 初始化编辑器内容
const initEditor = () => {
  const module = modules.value.find(m => m.id === props.moduleId);
  if (module && editorRef.value) {
    // 安全地访问content属性
    const content = module.content || '';
    console.log(`初始化模块 ${props.moduleId} 内容:`, content.substring(0, 50));
    editorRef.value.innerHTML = content;
  }
};

// 监听模块ID变化，更新编辑器内容
watch(() => props.moduleId, (newId, oldId) => {
  console.log(`模块切换: ${oldId} -> ${newId}`);
  nextTick(() => {
    initEditor();
  });
}, { immediate: true });

onMounted(() => {
  if (editorRef.value) {
    // 使用MutationObserver监听DOM变化
    const observer = new MutationObserver(() => {
      if (editorRef.value) {
        const content = editorRef.value.innerHTML;
        console.log(`[MutationObserver] 模块 ${props.moduleId} 内容变化:`, content.substring(0, 50));
        store.updateModuleContent(props.moduleId, content);
      }
    });
    
    observer.observe(editorRef.value, {
      attributes: true,
      childList: true,
      characterData: true,
      subtree: true
    });
    
    // 初始化编辑器内容
    initEditor();
  }
});

// 处理各种编辑事件
const handleInput = () => {
  if (editorRef.value) {
    const content = editorRef.value.innerHTML;
    console.log(`[Input] 模块 ${props.moduleId} 内容变化:`, content.substring(0, 50));
    store.updateModuleContent(props.moduleId, content);
  }
};

const handleKeyup = () => {
  if (editorRef.value) {
    const content = editorRef.value.innerHTML;
    console.log(`[Keyup] 模块 ${props.moduleId} 内容变化:`, content.substring(0, 50));
    store.updateModuleContent(props.moduleId, content);
  }
};

const handlePaste = () => {
  setTimeout(() => {
    if (editorRef.value) {
      const content = editorRef.value.innerHTML;
      console.log(`[Paste] 模块 ${props.moduleId} 内容变化:`, content.substring(0, 50));
      store.updateModuleContent(props.moduleId, content);
    }
  }, 10);
};

// 执行编辑器命令
const execCommand = (command: string, value: string | null = null) => {
  document.execCommand(command, false, value);
  handleInput();
};

// 插入链接
const insertLink = () => {
  const url = prompt('请输入链接地址:', 'http://');
  if (url) {
    execCommand('createLink', url);
  }
};
</script>

<template>
  <div class="rich-text-editor">
    <!-- 工具栏 -->
    <div class="editor-toolbar">
      <button @click="execCommand('bold')" title="加粗"><b>B</b></button>
      <button @click="execCommand('italic')" title="斜体"><i>I</i></button>
      <button @click="execCommand('underline')" title="下划线"><u>U</u></button>
      <span class="separator">|</span>
      <button @click="execCommand('insertUnorderedList')" title="无序列表">•</button>
      <button @click="execCommand('insertOrderedList')" title="有序列表">1.</button>
      <button @click="insertLink" title="插入链接">🔗</button>
    </div>
    
    <!-- 编辑区域 -->
    <div 
      ref="editorRef"
      class="editor-content" 
      contenteditable="true"
      @input="handleInput"
      @keyup="handleKeyup"
      @paste="handlePaste"
    ></div>
  </div>
</template>

<style scoped>
.rich-text-editor {
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  overflow: hidden;
}

.editor-toolbar {
  padding: 8px;
  border-bottom: 1px solid #d9d9d9;
  background-color: #f5f5f5;
  display: flex;
  gap: 5px;
}

.editor-toolbar button {
  background: white;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  padding: 4px 8px;
  cursor: pointer;
}

.editor-toolbar button:hover {
  background-color: #e6f7ff;
  border-color: #1890ff;
}

.separator {
  color: #d9d9d9;
  margin: 0 5px;
}

.editor-content {
  padding: 12px;
  min-height: 200px;
  max-height: 500px;
  overflow-y: auto;
  line-height: 1.6;
}

.editor-content:focus {
  outline: none;
  border-color: #40a9ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}
</style> 