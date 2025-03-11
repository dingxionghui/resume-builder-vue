<script setup lang="ts">
import { useResumeStore } from '../../store/resume';
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';

const store = useResumeStore();
const { modules } = storeToRefs(store);

const props = defineProps<{
  moduleId: string;
}>();

const content = ref('');

// 初始化编辑器内容
onMounted(() => {
  const module = modules.value.find(m => m.id === props.moduleId);
  if (module) {
    content.value = module.content || '';
  }
});

// 处理编辑器内容变化
const handleChange = (e: Event) => {
  const value = (e.target as HTMLTextAreaElement).value;
  console.log('内容变化:', value); // 调试日志
  store.updateModuleContent(props.moduleId, value);
};
</script>

<template>
  <div class="module-editor">
    <a-typography-title :level="4">{{ store.getModuleName(moduleId) }}</a-typography-title>
    
    <a-form-item>
      <a-textarea
        v-model:value="content"
        :rows="10"
        :auto-size="{ minRows: 10, maxRows: 20 }"
        @change="handleChange"
        @input="handleChange"
      />
    </a-form-item>
  </div>
</template>

<style scoped>
.module-editor {
  padding: 15px;
}

:deep(.ant-input) {
  font-size: 14px;
  line-height: 1.6;
  white-space: pre-wrap;
}
</style> 