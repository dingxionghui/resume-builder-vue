<script setup lang="ts">
import { ref, computed } from 'vue';
import { useResumeStore } from '../store/resume';
import draggable from 'vuedraggable';

const store = useResumeStore();
const emit = defineEmits(['select-module']);

const activeModuleId = ref('basic-info');

// 计算可拖拽的模块（排除固定模块）
const draggableModules = computed({
  get: () => {
    // 确保每次获取最新的模块列表
    return store.modules.filter(m => !m.fixed);
  },
  set: (newModules) => {
    // 获取所有模块的ID
    const newOrder = [
      // 保持固定模块在前面
      ...store.modules.filter(m => m.fixed).map(m => m.id),
      // 添加可拖动模块的新顺序
      ...newModules.map(m => m.id)
    ];
    
    // 更新模块顺序
    store.reorderModules(newOrder);
    console.log('模块顺序已更新:', newOrder);
  }
});

// 固定模块（不可拖动）
const fixedModules = computed(() => {
  return store.modules.filter(m => m.fixed);
});

const selectModule = (moduleId: string) => {
  if (isModuleEnabled(moduleId)) {
    activeModuleId.value = moduleId;
    emit('select-module', moduleId);
  }
};

const handleSwitchChange = (moduleId: string, checked: boolean, event: Event | undefined) => {
  if (event) {
    event.stopPropagation();
  }
  
  const module = store.modules.find(m => m.id === moduleId);
  if (module && !module.fixed) {
    module.enabled = checked;
  }
};

const isModuleEnabled = (moduleId: string) => {
  const module = store.modules.find(m => m.id === moduleId);
  return module ? module.enabled : false;
};

const addNewModule = () => {
  const moduleName = prompt('请输入新模块名称:');
  if (moduleName && moduleName.trim()) {
    const moduleId = store.addModule(moduleName.trim());
    selectModule(moduleId);
  }
};
</script>

<template>
  <div class="module-selector">
    <div class="module-list">
      <!-- 固定模块（不可拖动） -->
      <div 
        v-for="module in fixedModules" 
        :key="module.id"
        class="module-item"
        :class="{ active: activeModuleId === module.id, disabled: !module.enabled }"
        @click="selectModule(module.id)"
      >
        <span class="module-name">{{ module.name }}</span>
      </div>
      
      <!-- 可拖动模块 -->
      <draggable 
        v-model="draggableModules"
        item-key="id"
        handle=".drag-handle"
        :animation="150"
        ghost-class="ghost-item"
        @end="() => console.log('拖拽结束')"
      >
        <template #item="{element}">
          <div 
            class="module-item"
            :class="{ active: activeModuleId === element.id, disabled: !element.enabled }"
            @click="selectModule(element.id)"
          >
            <span class="drag-handle">≡</span>
            <span class="module-name">{{ element.name }}</span>
            <a-switch 
              :checked="element.enabled" 
              size="small"
              @change="(checked) => handleSwitchChange(element.id, checked, $event)"
              @click.stop
            />
          </div>
        </template>
      </draggable>
      
      <!-- 添加模块按钮 -->
      <div class="module-item add-module-item" @click="addNewModule">
        <span class="add-icon">+</span>
        <span class="module-name">添加自定义模块</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.module-selector {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.module-list {
  flex: 1;
  overflow-y: auto;
  border-right: 1px solid #f0f0f0;
}

.module-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.3s;
  border-bottom: 1px solid #f0f0f0;
}

.module-item:hover {
  background-color: #f5f5f5;
}

.module-item.active {
  background-color: #e6f7ff;
  border-right: 3px solid #1890ff;
}

.module-item.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.drag-handle {
  cursor: move;
  margin-right: 8px;
  color: #999;
  user-select: none;
}

.module-name {
  flex: 1;
}

.ghost-item {
  opacity: 0.5;
  background: #c8ebfb;
}

.add-module-item {
  color: #1890ff;
  background-color: #f0f8ff;
  margin-top: 10px;
}

.add-icon {
  font-size: 18px;
  margin-right: 8px;
  font-weight: bold;
}
</style> 