<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useResumeStore } from '../store/resume';
import BasicInfoEditor from './editors/BasicInfoEditor.vue';
import RichTextEditor from './editors/RichTextEditor.vue';

const props = defineProps<{
  moduleId: string
}>();

const store = useResumeStore();

// 根据模块ID确定使用哪个编辑器组件
const editorComponent = computed(() => {
  if (props.moduleId === 'basic-info') {
    return BasicInfoEditor;
  } else {
    return RichTextEditor;
  }
});

// 获取当前模块的内容
const getModuleContent = () => {
  if (props.moduleId === 'basic-info') {
    return store.basicInfo;
  } else {
    // 从store中获取其他模块内容
    return store.getModuleContent?.(props.moduleId) || '';
  }
};

const moduleContent = ref(getModuleContent());

// 当模块ID变化时更新内容
watch(() => props.moduleId, () => {
  moduleContent.value = getModuleContent();
});
</script>

<template>
  <div class="edit-section">
    <component 
      :is="editorComponent" 
      :module-id="moduleId" 
      :content="moduleContent"
    />
  </div>
</template>

<style scoped>
.edit-section {
  min-height: 300px;
}
</style> 