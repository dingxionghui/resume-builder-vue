<script setup lang="ts">
import { ref } from 'vue';
import { useResumeStore } from '../store/resume';

const store = useResumeStore();
const emit = defineEmits(['select-module']);

const activeModuleId = ref('basic-info');

const selectModule = (moduleId: string) => {
  if (isModuleEnabled(moduleId)) {
    activeModuleId.value = moduleId;
    emit('select-module', moduleId);
  }
};

const toggleModule = (moduleId: string, event: Event) => {
  event.stopPropagation();
  const module = store.modules.find(m => m.id === moduleId);
  if (module && !module.fixed) {
    module.enabled = !module.enabled;
  }
};

const isModuleEnabled = (moduleId: string) => {
  const module = store.modules.find(m => m.id === moduleId);
  return module ? module.enabled : false;
};

const addNewModule = () => {
  const moduleName = prompt('请输入新模块名称:');
  if (moduleName && moduleName.trim()) {
    // 生成唯一ID
    const moduleId = 'custom-' + Date.now();
    store.modules.push({
      id: moduleId,
      name: moduleName.trim(),
      enabled: true,
      fixed: false
    });
    
    // 自动选中新模块
    selectModule(moduleId);
  }
};
</script>

<template>
  <div class="options-panel">
    <h2>模块选择</h2>
    
    <!-- 基本信息模块（固定显示，不可拖动） -->
    <div 
      class="option-item fixed" 
      :class="{ active: activeModuleId === 'basic-info' }"
      @click="selectModule('basic-info')"
    >
      <span>基本信息</span>
      <a-switch disabled checked></a-switch>
    </div>
    
    <!-- 可排序的模块 -->
    <div class="sortable-options">
      <div 
        v-for="module in store.modules.filter(m => !m.fixed)" 
        :key="module.id"
        class="option-item"
        :class="{ active: activeModuleId === module.id }"
        @click="selectModule(module.id)"
      >
        <div class="drag-handle">≡</div>
        <span>{{ module.name }}</span>
        <a-switch 
          :checked="module.enabled" 
          @click="toggleModule(module.id, $event)"
        ></a-switch>
      </div>
    </div>
    
    <a-button class="add-button" @click="addNewModule">
      <span>+</span> 添加模块
    </a-button>
  </div>
</template>

<style scoped>
.options-panel {
  height: 100%;
  padding: 20px 10px;
  overflow-y: auto;
}

.options-panel h2 {
  font-size: 16px;
  margin-bottom: 20px;
  color: #333;
}

.option-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s;
  cursor: pointer;
}

.option-item:hover {
  background-color: #f5f5f5;
}

.option-item.active {
  background-color: #e6f0ff;
  border-left: 3px solid #4285f4;
  padding-left: 7px;
}

.option-item span {
  font-size: 14px;
  color: #333;
}

.option-item.fixed {
  background-color: #f8f8f8;
  border-left: 3px solid #4285f4;
  padding-left: 7px;
  margin-bottom: 10px;
}

.drag-handle {
  cursor: move;
  margin-right: 8px;
  color: #999;
  font-size: 16px;
}

.add-button {
  width: 100%;
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed #ccc;
}

.add-button span {
  margin-right: 5px;
}

.sortable-options {
  margin-bottom: 10px;
}
</style> 