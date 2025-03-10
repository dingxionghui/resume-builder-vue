<script setup lang="ts">
import { useResumeStore } from '../../store/resume';

const store = useResumeStore();

const updateField = (field: string, value: string) => {
  store.updateBasicInfo(field, value);
};

const handleFileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];
    const reader = new FileReader();
    
    reader.onload = (e) => {
      if (e.target?.result) {
        store.updateBasicInfo('avatar', e.target.result as string);
      }
    };
    
    reader.readAsDataURL(file);
  }
};

const removeAvatar = () => {
  store.updateBasicInfo('avatar', '');
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
          <a-upload 
            name="avatar" 
            :show-upload-list="false"
            :before-upload="() => false"
            @change="handleFileUpload"
          >
            <a-button>上传头像</a-button>
          </a-upload>
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
    
    <div class="section-divider">
      <h3>更多信息</h3>
    </div>
    
    <div class="additional-options">
      <a-button class="option-tag" v-for="field in ['wechat', 'github', 'expected-salary', 'age', 'work-years']" :key="field">
        <span>+ {{ field }}</span>
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