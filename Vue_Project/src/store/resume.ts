import { defineStore } from 'pinia';

interface Module {
  id: string;
  name: string;
  enabled: boolean;
  fixed: boolean;
}

interface BasicInfo {
  name: string;
  phone: string;
  email: string;
  jobIntention: string;
  avatar: string;
  [key: string]: string;
}

export const useResumeStore = defineStore('resume', {
  state: () => ({
    modules: [
      { id: 'basic-info', name: '基本信息', enabled: true, fixed: true },
      { id: 'education', name: '教育经历', enabled: true, fixed: false },
      { id: 'skills', name: '专业技能', enabled: true, fixed: false },
      { id: 'work', name: '工作经历', enabled: true, fixed: false },
      { id: 'project', name: '项目经历', enabled: true, fixed: false },
      { id: 'university', name: '大学信息', enabled: false, fixed: false },
      { id: 'awards', name: '荣誉奖项', enabled: false, fixed: false },
      { id: 'research', name: '研究经历', enabled: false, fixed: false },
      { id: 'portfolio', name: '作品集', enabled: false, fixed: false },
      { id: 'other', name: '其他经历', enabled: false, fixed: false },
      { id: 'personal', name: '个人简介', enabled: false, fixed: false },
    ] as Module[],
    
    basicInfo: {
      name: '老鱼简历',
      phone: '13818996520',
      email: 'mycv@gmail.com',
      jobIntention: '前端开发工程师',
      avatar: '',
    } as BasicInfo,
    
    moduleContents: {} as Record<string, string>,
  }),
  
  actions: {
    updateBasicInfo(field: string, value: string) {
      this.basicInfo[field] = value;
    },
    
    updateModuleContent(moduleId: string, content: string) {
      this.moduleContents[moduleId] = content;
    },
    
    getModuleContent(moduleId: string) {
      return this.moduleContents[moduleId] || '';
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
      // 保持基本信息模块在第一位
      const basicInfoModule = this.modules.find(m => m.id === 'basic-info');
      const otherModules = this.modules.filter(m => m.id !== 'basic-info');
      
      // 根据新顺序排序其他模块
      const sortedModules = newOrder
        .filter(id => id !== 'basic-info')
        .map(id => otherModules.find(m => m.id === id))
        .filter(m => m !== undefined) as Module[];
      
      // 将未包含在新顺序中的模块添加到末尾
      const remainingModules = otherModules.filter(m => !newOrder.includes(m.id));
      
      // 更新模块数组
      this.modules = [
        basicInfoModule as Module,
        ...sortedModules,
        ...remainingModules
      ];
    }
  }
}); 