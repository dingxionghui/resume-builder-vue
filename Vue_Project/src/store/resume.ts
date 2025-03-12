import { defineStore } from 'pinia';

interface Module {
  id: string;
  name: string;
  content: string;
  enabled: boolean;
  fixed?: boolean;
}

interface BasicInfo {
  name: string;
  phone: string;
  email: string;
  avatar: string;
  jobIntention: string;
  [key: string]: string;
}

export const useResumeStore = defineStore('resume', {
  state: () => ({
    modules: [
      { 
        id: 'basic-info', 
        name: '基本信息', 
        enabled: true, 
        fixed: true,
        content: '' 
      },
      { 
        id: 'education', 
        name: '教育经历', 
        enabled: true, 
        fixed: false,
        content: '在这里填写你的教育经历，按照时间倒序排列。\n\n例如：\n学校名称：XX大学\n专业：计算机科学与技术\n学历：本科\n在校时间：2019-2023' 
      },
      { 
        id: 'skills', 
        name: '专业技能', 
        enabled: true, 
        fixed: false,
        content: '描述你的技能，尽量具体和量化，使用数字、百分比或具体的项目经验来支持你的陈述。\n\n例如：\n• 熟练掌握 HTML、CSS、JavaScript\n• 熟悉 Vue.js、React 等前端框架\n• 了解 Node.js 和常用后端技术' 
      },
      { 
        id: 'work', 
        name: '工作经历', 
        enabled: true, 
        fixed: false,
        content: '按照时间倒序描述你的工作经历。\n\n例如：\n公司名称：XX科技有限公司\n职位：前端开发工程师\n工作时间：2023.7 - 至今\n工作内容：\n• 负责公司主要产品的前端开发\n• 参与技术方案设计和评审' 
      },
      { 
        id: 'project', 
        name: '项目经历', 
        enabled: true, 
        fixed: false,
        content: '描述你参与过的重要项目。\n\n例如：\n项目名称：XX管理系统\n项目描述：一个基于Vue3的后台管理系统\n负责内容：\n• 核心功能模块开发\n• 性能优化' 
      },
      { id: 'university', name: '大学信息', enabled: false, fixed: false },
      { id: 'awards', name: '荣誉奖项', enabled: false, fixed: false },
      { id: 'research', name: '研究经历', enabled: false, fixed: false },
      { id: 'portfolio', name: '作品集', enabled: false, fixed: false },
      { id: 'other', name: '其他经历', enabled: false, fixed: false },
      { id: 'personal', name: '个人简介', enabled: false, fixed: false },
    ] as Module[],
    
    basicInfo: {
      name: '我的简历',
      phone: '13818996520',
      email: 'mycv@gmail.com',
      jobIntention: '前端开发工程师',
      avatar: '',
    } as BasicInfo,
  }),
  
  actions: {
    updateBasicInfo(field: string, value: string) {
      this.basicInfo[field] = value;
    },
    
    updateModuleContent(moduleId: string, content: string) {
      const moduleIndex = this.modules.findIndex(m => m.id === moduleId);
      if (moduleIndex !== -1) {
        this.modules[moduleIndex] = {
          ...this.modules[moduleIndex],
          content: content
        };
      }
    },
    
    getModuleContent(moduleId: string) {
      const module = this.modules.find(m => m.id === moduleId);
      return module?.content || '';
    },
    
    getModuleName(moduleId: string) {
      const module = this.modules.find(m => m.id === moduleId);
      return module?.name || '';
    },
    
    toggleModule(moduleId: string) {
      const module = this.modules.find(m => m.id === moduleId);
      if (module && !module.fixed) {
        module.enabled = !module.enabled;
      }
    },
    
    addModule(name: string) {
      const id = 'custom-' + Date.now();
      this.modules.push({
        id,
        name,
        enabled: true,
        fixed: false
      });
      return id;
    },
    
    reorderModules(newOrder: string[]) {
      console.log('重新排序模块:', newOrder);
      
      // 创建一个新的模块数组，按照newOrder的顺序排列
      const orderedModules = newOrder
        .map(id => this.modules.find(m => m.id === id))
        .filter(m => m !== undefined) as Module[];
      
      // 添加任何不在newOrder中的模块（如果有的话）
      const remainingModules = this.modules.filter(m => !newOrder.includes(m.id));
      
      // 更新模块数组
      this.modules = [...orderedModules, ...remainingModules];
      
      console.log('模块排序后:', this.modules.map(m => m.id));
    }
  },
  
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'resume-store',
        storage: localStorage,
      },
    ],
  },
}); 