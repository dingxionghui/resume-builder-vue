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
    <a-menu
      mode="inline"
      :selectedKeys="[activeModuleId]"
      class="module-menu"
    >
      <a-menu-item 
        v-for="module in store.modules" 
        :key="module.id"
        @click="selectModule(module.id)"
        :disabled="!module.enabled"
      >
        <div class="module-item">
          <span>{{ module.name }}</span>
          <a-switch 
            v-if="!module.fixed" 
            :checked="module.enabled" 
            size="small"
            @change="(checked) => handleSwitchChange(module.id, checked, $event)"
            @click.stop
          />
        </div>
      </a-menu-item>
    </a-menu>
    
    <div class="add-module">
      <a-button type="dashed" block @click="addNewModule">
        + 添加自定义模块
      </a-button>
    </div>
  </div>
</template>

<style scoped>
.module-selector {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.module-menu {
  flex: 1;
  border-right: 0;
}

.module-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.add-module {
  padding: 16px;
  border-top: 1px solid #f0f0f0;
}
</style> 