<script setup lang="ts">
import { useResumeStore } from '../../store/resume';
import { ref, computed } from 'vue';

const store = useResumeStore();
const fileInput = ref<HTMLInputElement | null>(null);

// 定义额外字段选项
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

// 计算未添加的字段
const availableExtraFields = computed(() => {
  const currentFields = Object.keys(store.basicInfo);
  return extraFieldOptions.filter(field => !currentFields.includes(field.key));
});

const updateField = (field: string, value: string) => {
  store.updateBasicInfo(field, value);
};

const addExtraField = (field: { key: string, label: string }) => {
  // 添加新字段到基本信息中，初始值为空字符串
  store.updateBasicInfo(field.key, '');
};

const removeExtraField = (fieldKey: string) => {
  // 从基本信息中移除字段
  const { [fieldKey]: _, ...rest } = store.basicInfo;
  store.basicInfo = { ...rest };
};

const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleFileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];
    const reader = new FileReader();
    
    reader.onload = (e) => {
      if (e.target?.result) {
        store.updateBasicInfo('avatar', e.target.result as string);
        console.log('Avatar updated:', e.target.result);
      }
    };
    
    reader.readAsDataURL(file);
  }
};

const removeAvatar = () => {
  store.updateBasicInfo('avatar', '');
};

// 获取字段的显示标签
const getFieldLabel = (key: string) => {
  const field = extraFieldOptions.find(f => f.key === key);
  return field ? field.label : key;
};
</script>

<template>
  <div class="basic-info-edit">
    <div class="form-group">
      <label>姓名</label>
      <a-input 
        v-model:value="store.basicInfo.name" 
        placeholder="请输入姓名"
        @change="updateField('name', $event.target.value)"
      />
    </div>
    
    <div class="form-group">
      <label>电话</label>
      <a-input 
        v-model:value="store.basicInfo.phone" 
        placeholder="请输入电话号码"
        @change="updateField('phone', $event.target.value)"
      />
    </div>
    
    <div class="form-group">
      <label>邮箱</label>
      <a-input 
        v-model:value="store.basicInfo.email" 
        placeholder="请输入邮箱地址"
        @change="updateField('email', $event.target.value)"
      />
    </div>
    
    <div class="form-group">
      <label>头像</label>
      <div class="avatar-upload">
        <div class="avatar-preview">
          <img :src="store.basicInfo.avatar" alt="" v-if="store.basicInfo.avatar">
        </div>
        <div class="avatar-controls">
          <input 
            type="file" 
            accept="image/*" 
            style="display: none" 
            ref="fileInput"
            @change="handleFileUpload"
          />
          <a-button @click="triggerFileInput">上传头像</a-button>
          <a-button @click="removeAvatar" v-if="store.basicInfo.avatar">删除</a-button>
        </div>
      </div>
    </div>
    
    <div class="form-group">
      <label>求职意向</label>
      <a-input 
        v-model:value="store.basicInfo.jobIntention" 
        placeholder="例如：前端开发工程师"
        @change="updateField('jobIntention', $event.target.value)"
      />
    </div>
    
    <!-- 动态添加的额外字段 -->
    <div 
      v-for="key in Object.keys(store.basicInfo).filter(k => !['name', 'phone', 'email', 'avatar', 'jobIntention'].includes(k))" 
      :key="key"
      class="form-group extra-field"
    >
      <div class="field-header">
        <label>{{ getFieldLabel(key) }}</label>
        <a-button 
          type="text" 
          danger 
          size="small"
          @click="removeExtraField(key)"
        >
          <span class="remove-icon">×</span>
        </a-button>
      </div>
      <a-input 
        v-model:value="store.basicInfo[key]" 
        :placeholder="`请输入${getFieldLabel(key)}`"
        @change="updateField(key, $event.target.value)"
      />
    </div>
    
    <div class="section-divider">
      <h3>更多信息</h3>
    </div>
    
    <div class="additional-options">
      <a-button 
        class="option-tag" 
        v-for="field in availableExtraFields" 
        :key="field.key"
        @click="addExtraField(field)"
      >
        <span>+ {{ field.label }}</span>
      </a-button>
    </div>
  </div>
</template>

<style scoped>
.basic-info-edit {
  padding: 10px;
}

.form-group {
  margin-bottom: 15px;
  position: relative;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-size: 14px;
  color: #666;
}

.field-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.remove-icon {
  font-size: 16px;
  font-weight: bold;
}

.extra-field {
  background-color: #f9f9f9;
  padding: 10px;
  border-radius: 4px;
  border-left: 3px solid #4285f4;
}

.avatar-upload {
  display: flex;
  flex-direction: column;
}

.avatar-preview {
  width: 80px;
  height: 80px;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  background-color: #f5f5f5;
}

.avatar-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.section-divider {
  margin: 20px 0;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

.section-divider h3 {
  font-size: 16px;
  color: #333;
  font-weight: normal;
}

.additional-options {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 15px;
}

.option-tag {
  margin: 5px;
}
</style> 