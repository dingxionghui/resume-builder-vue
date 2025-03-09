// 将这些函数定义移到文件最前面，确保它们在被调用之前就已经定义
function createRichTextEditor(moduleId, targetSection) {
    console.log('为模块创建富文本编辑器:', moduleId);
    
    // 检查目标区域
    if (!targetSection) {
        console.error('创建富文本编辑器失败：目标区域不存在');
        return null;
    }
    
    // 完全清空目标区域
    targetSection.innerHTML = '';
    
    // 创建富文本编辑器HTML，确保ID唯一，添加更显眼的样式
    const editorId = `editor-${moduleId}-${Date.now()}`;
    const contentId = `content-${moduleId}-${Date.now()}`;
    
    // 获取当前模块的预览内容（如果有）以便在编辑器中显示
    let currentContent = '';
    const previewSection = document.getElementById(`preview-${moduleId}`);
    if (previewSection) {
        const contentContainer = previewSection.querySelector('.section-content');
        if (contentContainer && contentContainer.innerHTML.trim()) {
            currentContent = contentContainer.innerHTML;
        }
    }
    
    // 如果没有现有内容，使用默认内容
    if (!currentContent) {
        currentContent = getDefaultContent(moduleId);
    }
    
    // 创建明显的编辑器HTML - 确保所有模块使用相同的样式
    const editorHTML = `
        <div class="rich-text-editor" id="${editorId}" data-module="${moduleId}" style="display:block; width:100%; min-height:250px; border:2px solid #4a90e2; margin-top:10px; background:#fff; box-shadow:0 4px 8px rgba(0,0,0,0.1); position:relative; z-index:100;">
            <div class="editor-toolbar" style="display:flex; padding:8px; background:#e1f5fe; border-bottom:2px solid #4a90e2;">
                <div style="background:#ff5722; color:white; padding:4px 8px; margin-right:10px; border-radius:4px; font-weight:bold;">编辑器工具栏</div>
                <button class="toolbar-btn" data-command="bold" title="加粗" style="margin:0 5px; padding:4px 8px; background:#f0f0f0; border:1px solid #ddd; border-radius:4px;"><i class="fas fa-bold">B</i></button>
                <button class="toolbar-btn" data-command="italic" title="斜体" style="margin:0 5px; padding:4px 8px; background:#f0f0f0; border:1px solid #ddd; border-radius:4px;"><i class="fas fa-italic">I</i></button>
                <button class="toolbar-btn" data-command="underline" title="下划线" style="margin:0 5px; padding:4px 8px; background:#f0f0f0; border:1px solid #ddd; border-radius:4px;"><i class="fas fa-underline">U</i></button>
                <span class="toolbar-separator" style="margin:0 10px;">|</span>
                <button class="toolbar-btn" data-command="insertUnorderedList" title="无序列表" style="margin:0 5px; padding:4px 8px; background:#f0f0f0; border:1px solid #ddd; border-radius:4px;"><i class="fas fa-list-ul">•</i></button>
                <button class="toolbar-btn" data-command="insertOrderedList" title="有序列表" style="margin:0 5px; padding:4px 8px; background:#f0f0f0; border:1px solid #ddd; border-radius:4px;"><i class="fas fa-list-ol">1.</i></button>
                <button class="toolbar-btn" data-command="createLink" title="插入链接" style="margin:0 5px; padding:4px 8px; background:#f0f0f0; border:1px solid #ddd; border-radius:4px;"><i class="fas fa-link">🔗</i></button>
            </div>
            <div class="editor-content" contenteditable="true" id="${contentId}" data-module="${moduleId}" style="padding:15px; min-height:200px; border:1px solid #e0e0e0; background:white; font-size:16px;">
                ${currentContent}
            </div>
            <div style="background:#fffde7; padding:8px; border-top:1px solid #e0e0e0; font-size:14px; color:#616161;">
                <span style="color:#f44336; font-weight:bold;">模块ID: ${moduleId}</span> - 在上面的编辑区域中编辑内容，变更将实时显示在右侧预览区
            </div>
        </div>
    `;
    
    // 添加到目标区域
    targetSection.innerHTML = editorHTML;
    
    // 获取编辑器元素
    const editor = document.getElementById(editorId);
    const content = document.getElementById(contentId);
    
    if (!editor || !content) {
        console.error('创建富文本编辑器失败：未找到编辑器或内容元素');
        return null;
    }
    
    // 初始化富文本编辑器
    initRichTextEditor(editor, moduleId);
    
    // 立即更新预览区域
    updatePreviewContent(moduleId, content.innerHTML);
    
    console.log('富文本编辑器创建完成:', moduleId, '编辑器ID:', editorId, '内容ID:', contentId);
    
    return editor;
}

function initRichTextEditor(editor, moduleId) {
    if (!editor) {
        console.error('初始化富文本编辑器失败: 未找到编辑器元素');
        return;
    }
    
    const toolbar = editor.querySelector('.editor-toolbar');
    const content = editor.querySelector('.editor-content');
    
    if (!toolbar || !content) {
        console.error('初始化富文本编辑器失败: 未找到工具栏或内容元素');
        return;
    }
    
    console.log('初始化富文本编辑器:', moduleId, '内容元素:', content.id);
    
    // 为工具栏按钮添加事件监听
    const buttons = toolbar.querySelectorAll('.toolbar-btn');
    buttons.forEach(button => {
        // 移除现有的事件监听器
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
        
        // 添加新的事件监听器
        newButton.addEventListener('click', function(e) {
            e.preventDefault(); // 防止按钮默认行为
            e.stopPropagation(); // 阻止事件冒泡
            
            const command = this.getAttribute('data-command');
            
            if (command === 'createLink') {
                const url = prompt('请输入链接地址:', 'http://');
                if (url) {
                    document.execCommand(command, false, url);
                }
            } else {
                document.execCommand(command, false, null);
            }
            
            // 更新按钮状态
            updateButtonStates(toolbar);
            
            // 强制更新预览 - 这很重要
            console.log(`${moduleId} 按钮点击，强制更新预览`);
            updatePreviewContent(moduleId, content.innerHTML);
        });
    });
    
    // 强化编辑器内容变化监听 - 使用MutationObserver
    const observer = new MutationObserver(function(mutations) {
        console.log(`${moduleId} 内容变化 (MutationObserver)`, content.innerHTML.substring(0, 50) + '...');
        updatePreviewContent(moduleId, content.innerHTML);
    });
    
    // 配置观察选项
    observer.observe(content, {
        attributes: true,
        childList: true,
        characterData: true,
        subtree: true
    });
    
    // 保留原有的事件监听
    content.addEventListener('input', function() {
        console.log(`${moduleId} 内容变化 (input)`, this.innerHTML.substring(0, 50) + '...');
        updatePreviewContent(moduleId, this.innerHTML);
    });
    
    content.addEventListener('keyup', function() {
        console.log(`${moduleId} 内容变化 (keyup)`, this.innerHTML.substring(0, 50) + '...');
        updatePreviewContent(moduleId, this.innerHTML);
    });
    
    content.addEventListener('paste', function() {
        setTimeout(() => {
            console.log(`${moduleId} 内容变化 (paste)`, this.innerHTML.substring(0, 50) + '...');
            updatePreviewContent(moduleId, this.innerHTML);
        }, 10);
    });
    
    content.addEventListener('blur', function() {
        console.log(`${moduleId} 失去焦点，更新内容`);
        updatePreviewContent(moduleId, this.innerHTML);
    });
    
    // 立即更新一次预览内容
    updatePreviewContent(moduleId, content.innerHTML);
}

// 更新预览内容
function updatePreviewContent(moduleId, content) {
    console.log('更新预览内容:', moduleId);
    if (!moduleId) {
        console.error('模块ID为空，无法更新预览内容');
        return;
    }
    
    // 确保预览区域存在
    const previewSection = document.getElementById(`preview-${moduleId}`);
    if (!previewSection) {
        console.error('未找到预览区域，创建一个新的:', moduleId);
        ensurePreviewSection(moduleId);
        return updatePreviewContent(moduleId, content); // 重新尝试更新
    }
    
    const contentContainer = previewSection.querySelector('.section-content');
    if (!contentContainer) {
        console.error('未找到预览内容容器:', moduleId);
        return;
    }
    
    // 更新内容
    contentContainer.innerHTML = content;
    console.log('预览内容已更新:', moduleId);
    
    // 确保预览区域可见（如果模块开关是打开的）
    const toggle = document.getElementById(`${moduleId}-toggle`);
    if (toggle && toggle.checked) {
        previewSection.style.display = 'block';
    }
}

// 确保预览区域存在
function ensurePreviewSection(moduleId) {
    console.log('确保预览区域存在:', moduleId);
    
    let previewSection = document.getElementById(`preview-${moduleId}`);
    
    if (!previewSection) {
        console.log('创建新的预览区域:', moduleId);
        
        // 获取模块名称
        const moduleItem = document.querySelector(`.option-item[data-module="${moduleId}"]`);
        const moduleName = moduleItem ? moduleItem.querySelector('span').textContent : moduleId;
        
        // 创建预览区域
        previewSection = document.createElement('div');
        previewSection.id = `preview-${moduleId}`;
        previewSection.className = 'resume-section';
        previewSection.innerHTML = `
            <div class="section-title">${moduleName}</div>
            <div class="section-content">
                <p>点击左侧模块编辑此内容</p>
            </div>
        `;
        
        // 添加到预览容器
        const resumePreview = document.getElementById('resume-preview');
        if (resumePreview) {
            resumePreview.appendChild(previewSection);
        } else {
            console.error('未找到预览容器，无法添加预览区域');
        }
    }
    
    return previewSection;
}

// 获取默认内容
function getDefaultContent(moduleId) {
    const defaultContents = {
        'education': `
            <div class="education-item">
                <div class="education-header">
                    <span class="education-school">浙江大学</span>
                    <span class="education-time">2019-09 ~ 2023-06</span>
                </div>
                <div class="education-major">计算机科学与技术 本科</div>
                <div class="education-description">
                    <p>描述你的学习经历、成就和活动...</p>
                </div>
            </div>
        `,
        'skills': `
            <p>描述你的技能，尽量具体和量化，使用数字、百分比或具体的项目经验来支持你的陈述。</p>
            <p>如，"成功管理了5个项目，每个项目的预算超过100万美元，并在预定时间内完成了它们"</p>
        `,
        'work': `
            <div class="work-item">
                <div class="work-header">
                    <span class="work-company">鱼互联网有限公司</span>
                    <span class="work-time">2023-02 ~ 2023-04</span>
                </div>
                <div class="work-position">创新业务部 全栈开发 杭州</div>
                <div class="work-description">
                    <p>工作描述...</p>
                </div>
            </div>
        `
    };
    
    return defaultContents[moduleId] || `<p>在这里编辑${moduleId}内容...</p>`;
}

function updateButtonStates(toolbar) {
    const buttons = toolbar.querySelectorAll('.toolbar-btn');
    buttons.forEach(button => {
        const command = button.getAttribute('data-command');
        if (document.queryCommandState(command)) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}

// 修复基本信息模块的实时预览问题
function initEditButton() {
    console.log('初始化编辑按钮');
    
    // 获取所有编辑按钮
    const editButtons = document.querySelectorAll('.edit-btn');
    
    editButtons.forEach(button => {
        // 移除现有的事件监听器
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
        
        // 添加新的事件监听器
        newButton.addEventListener('click', function() {
            // 获取字段ID
            const fieldId = this.getAttribute('data-field');
            if (!fieldId) return;
            
            // 获取输入框和显示元素
            const inputElement = document.getElementById(fieldId);
            const displayElement = document.getElementById(`${fieldId}-display`);
            
            if (inputElement && displayElement) {
                const isEditing = this.classList.contains('editing');
                
                if (isEditing) {
                    // 保存模式 -> 显示模式
                    displayElement.textContent = inputElement.value;
                    displayElement.style.display = 'inline';
                    inputElement.style.display = 'none';
                    this.textContent = '编辑';
                    this.classList.remove('editing');
                    
                    // 更新预览区域
                    updateBasicInfoPreview(fieldId, inputElement.value);
                } else {
                    // 显示模式 -> 编辑模式
                    inputElement.value = displayElement.textContent;
                    displayElement.style.display = 'none';
                    inputElement.style.display = 'inline';
                    inputElement.focus();
                    this.textContent = '保存';
                    this.classList.add('editing');
                }
            }
        });
    });
    
    // 为基本信息输入框添加实时预览
    const basicInfoInputs = document.querySelectorAll('#basic-info-edit input, #basic-info-edit textarea');
    basicInfoInputs.forEach(input => {
        // 移除现有的事件监听器
        const newInput = input.cloneNode(true);
        input.parentNode.replaceChild(newInput, input);
        
        // 添加新的事件监听器
        newInput.addEventListener('input', function() {
            const fieldId = this.id;
            if (fieldId) {
                updateBasicInfoPreview(fieldId, this.value);
            }
        });
    });
    
    console.log('编辑按钮初始化完成');
}

// 添加基本信息预览更新函数
function updateBasicInfoPreview(fieldId, value) {
    console.log('更新基本信息预览:', fieldId, value);
    
    // 映射字段ID到预览区域的元素ID
    const previewMap = {
        'name': 'preview-name',
        'title': 'preview-title',
        'phone': 'preview-phone',
        'email': 'preview-email',
        'location': 'preview-location',
        'website': 'preview-website',
        'objective': 'preview-objective'
    };
    
    // 获取预览元素ID
    const previewId = previewMap[fieldId];
    if (previewId) {
        // 更新预览元素
        const previewElement = document.getElementById(previewId);
        if (previewElement) {
            previewElement.textContent = value;
            console.log('基本信息预览已更新:', previewId);
        }
    }
}

// 修复 createNewModule 函数，确保新模块能正确创建
function createNewModule(moduleName) {
    console.log('创建新模块:', moduleName);
    
    // 生成唯一的模块ID
    const moduleId = 'custom-' + Date.now();
    
    // 创建新的模块项
    const moduleItem = document.createElement('div');
    moduleItem.className = 'option-item';
    moduleItem.setAttribute('draggable', 'true');
    moduleItem.setAttribute('data-module', moduleId);
    
    // 设置模块项的HTML内容
    moduleItem.innerHTML = `
        <div class="drag-handle">≡</div>
        <span>${moduleName}</span>
        <label class="switch">
            <input type="checkbox" id="${moduleId}-toggle" checked>
            <span class="slider round"></span>
        </label>
    `;
    
    // 添加到可排序的模块列表中
    const sortableOptions = document.getElementById('sortable-options');
    if (!sortableOptions) {
        console.error('未找到可排序的模块列表，无法添加新模块');
        return;
    }
    
    sortableOptions.appendChild(moduleItem);
    
    // 创建预览区域
    const previewSection = document.createElement('div');
    previewSection.className = 'resume-section';
    previewSection.id = `preview-${moduleId}`;
    previewSection.innerHTML = `
        <div class="section-title">${moduleName}</div>
        <div class="section-content">
            <p>点击左侧模块编辑此内容</p>
        </div>
    `;
    
    // 添加到预览容器
    const resumePreview = document.getElementById('resume-preview');
    if (resumePreview) {
        resumePreview.appendChild(previewSection);
    } else {
        console.error('未找到预览容器，无法添加预览区域');
    }
    
    // 为新模块的点击事件添加监听器
    moduleItem.addEventListener('click', function(e) {
        // 如果点击的是开关或其子元素，不处理
        if (e.target.closest('.switch')) {
            return;
        }
        
        // 获取模块ID和开关状态
        const moduleId = this.getAttribute('data-module');
        const toggle = this.querySelector('input[type="checkbox"]');
        
        console.log('新模块被点击:', moduleId);
        
        // 只有当开关打开时才允许切换编辑区域
        if (toggle && toggle.checked) {
            // 更新当前选中的模块样式
            document.querySelectorAll('.option-item').forEach(mi => mi.classList.remove('active'));
            this.classList.add('active');
            
            // 显示对应的编辑区域
            showEditSection(moduleId);
        }
    });
    
    // 为新模块的开关添加事件监听器
    const toggle = moduleItem.querySelector(`#${moduleId}-toggle`);
    if (toggle) {
        toggle.addEventListener('change', function() {
            console.log('模块开关切换:', moduleId, this.checked ? '开启' : '关闭');
            
            const previewSection = document.getElementById(`preview-${moduleId}`);
            if (previewSection) {
                if (this.checked) {
                    previewSection.style.display = 'block';
                } else {
                    previewSection.style.display = 'none';
                }
            }
        });
    }
    
    // 立即创建编辑区域
    const editSection = ensureEditSection(moduleId);
    
    // 自动选中新模块并显示编辑区域
    document.querySelectorAll('.option-item').forEach(mi => mi.classList.remove('active'));
    moduleItem.classList.add('active');
    showEditSection(moduleId);
    
    console.log('新模块创建完成:', moduleId);
    return moduleId;
}

// 修复 showEditSection 函数，确保富文本编辑器正确显示
function showEditSection(moduleId) {
    console.log('显示编辑区域:', moduleId);
    
    // 隐藏所有编辑区域
    const editSections = document.querySelectorAll('.edit-section');
    editSections.forEach(section => {
        section.classList.remove('active');
        section.style.display = 'none';
    });
    
    // 基本信息模块特殊处理
    if (moduleId === 'basic-info') {
        console.log('显示基本信息编辑区域');
        
        // 查找基本信息编辑区域
        const basicInfoSection = document.getElementById('basic-info-edit');
        if (basicInfoSection) {
            basicInfoSection.classList.add('active');
            basicInfoSection.style.display = 'block';
            
            // 更新编辑区域标题
            const sectionTitle = document.querySelector(`.option-item[data-module="${moduleId}"] span`).textContent;
            const titleElement = document.getElementById('current-section-title');
            if (titleElement) {
                titleElement.textContent = sectionTitle;
            }
            
            console.log('基本信息编辑区域已显示');
        } else {
            console.error('未找到基本信息编辑区域');
        }
        
        // 初始化编辑按钮
        initEditButton();
        return;
    }
    
    // 其他模块使用富文本编辑器
    // 确保编辑区域存在并获取它
    const targetSection = ensureEditSection(moduleId);
    
    // 显示编辑区域，并强制应用显示样式
    if (targetSection) {
        targetSection.classList.add('active');
        // 强制显示样式
        targetSection.style.display = 'block';
        targetSection.style.visibility = 'visible';
        targetSection.style.opacity = '1';
        
        // 更新编辑区域标题
        const sectionTitle = document.querySelector(`.option-item[data-module="${moduleId}"] span`).textContent;
        const titleElement = document.getElementById('current-section-title');
        if (titleElement) {
            titleElement.textContent = sectionTitle;
        }
        
        // 强制重新创建富文本编辑器
        console.log('强制重新创建富文本编辑器:', moduleId);
        createRichTextEditor(moduleId, targetSection);
        
        console.log('编辑区域已切换到:', sectionTitle);
    }
    
    // 初始化编辑按钮
    initEditButton();
}

// 修复 ensureEditSection 函数，使用更灵活的方式查找中间区域
function ensureEditSection(moduleId) {
    console.log('确保编辑区域存在:', moduleId);
    
    // 首先确保编辑容器存在
    let editContainer = document.querySelector('.edit-container');
    if (!editContainer) {
        console.log('未找到编辑容器，创建新的编辑容器');
        
        // 创建编辑容器
        editContainer = document.createElement('div');
        editContainer.className = 'edit-container';
        
        // 尝试多种可能的中间区域选择器
        const possibleContainers = [
            document.querySelector('.middle-column'),
            document.querySelector('.content-column'),
            document.querySelector('.editor-column'),
            document.querySelector('.center-column'),
            document.querySelector('.edit-area'),
            document.querySelector('main'),
            document.getElementById('edit-area'),
            document.getElementById('middle-section')
        ];
        
        // 找到第一个存在的容器
        const middleColumn = possibleContainers.find(container => container !== null);
        
        if (middleColumn) {
            console.log('找到可用容器:', middleColumn.className || middleColumn.id);
            
            // 尝试查找当前编辑区域标题，如果有则在其后插入编辑容器
            const titleElement = middleColumn.querySelector('#current-section-title');
            if (titleElement) {
                titleElement.after(editContainer);
            } else {
                // 否则直接添加到中间区域
                middleColumn.appendChild(editContainer);
            }
            console.log('编辑容器已创建并添加到DOM');
        } else {
            // 最后的尝试：直接添加到body
            console.log('找不到合适的中间区域，尝试直接添加到页面主体');
            
            // 查找左侧和右侧列，将编辑容器添加到它们之间
            const leftColumn = document.querySelector('.left-column') || document.querySelector('.sidebar');
            
            if (leftColumn && leftColumn.parentNode) {
                // 在左侧列之后插入
                leftColumn.after(editContainer);
                console.log('编辑容器已添加到左侧列之后');
            } else {
                // 如果都找不到，直接添加到body
                document.body.appendChild(editContainer);
                console.log('编辑容器已添加到页面主体');
            }
            
            // 设置基本样式，使容器可见
            editContainer.style.width = '50%';
            editContainer.style.margin = '0 auto';
            editContainer.style.padding = '20px';
            editContainer.style.backgroundColor = '#fff';
            editContainer.style.border = '1px solid #ddd';
            editContainer.style.minHeight = '400px';
        }
    }
    
    // 查找或创建编辑区域
    let targetSection = document.getElementById(`${moduleId}-edit`);
    
    // 如果编辑区域不存在，创建一个新的
    if (!targetSection) {
        console.log('创建新的编辑区域:', moduleId);
        
        // 创建新的编辑区域
        targetSection = document.createElement('div');
        targetSection.id = `${moduleId}-edit`;
        targetSection.className = 'edit-section';
        targetSection.style.display = 'none';  // 初始不显示
        
        // 添加到编辑容器
        editContainer.appendChild(targetSection);
        
        // 为新创建的编辑区域添加富文本编辑器
        createRichTextEditor(moduleId, targetSection);
    } else {
        // 检查编辑区域是否有富文本编辑器，如果没有则创建
        const existingEditors = targetSection.querySelectorAll('.rich-text-editor');
        if (existingEditors.length === 0) {
            console.log('编辑区域缺少富文本编辑器，创建新的:', moduleId);
            createRichTextEditor(moduleId, targetSection);
        } else {
            console.log('编辑区域已有富文本编辑器:', moduleId, '数量:', existingEditors.length);
        }
    }
    
    return targetSection;
}

// 添加一个全局函数，用于强制重新创建所有模块的富文本编辑器
function reinitializeAllEditors() {
    console.log('强制重新初始化所有富文本编辑器');
    
    // 获取所有模块项
    const allModuleItems = document.querySelectorAll('.option-item');
    allModuleItems.forEach(item => {
        const moduleId = item.getAttribute('data-module');
        if (moduleId && moduleId !== 'basic-info') {  // 基本信息模块不需要富文本编辑器
            // 获取编辑区域
            const editSection = document.getElementById(`${moduleId}-edit`);
            if (editSection) {
                // 移除现有的富文本编辑器
                const existingEditors = editSection.querySelectorAll('.rich-text-editor');
                existingEditors.forEach(editor => editor.remove());
                
                // 重新创建富文本编辑器
                createRichTextEditor(moduleId, editSection);
                console.log(`重新创建了 ${moduleId} 的富文本编辑器`);
            }
        }
    });
}

// 修改 DOMContentLoaded 事件处理函数，添加延迟初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('页面已加载，开始初始化...');
    
    // 立即初始化所有模块的编辑区域和预览区域
    console.log('初始化所有模块...');
    
    // 获取所有模块项
    const allModuleItems = document.querySelectorAll('.option-item');
    allModuleItems.forEach(item => {
        const moduleId = item.getAttribute('data-module');
        if (moduleId && moduleId !== 'basic-info') {  // 基本信息模块不需要富文本编辑器
            console.log('初始化模块:', moduleId);
            
            // 确保预览区域存在
            ensurePreviewSection(moduleId);
            
            // 提前创建编辑区域
            ensureEditSection(moduleId);
            
            // 如果模块的开关是打开的，则显示预览区域
            const toggle = document.getElementById(`${moduleId}-toggle`);
            if (toggle && toggle.checked) {
                const previewSection = document.getElementById(`preview-${moduleId}`);
                if (previewSection) {
                    previewSection.style.display = 'block';
                }
            }
        }
    });
    
    // 在页面完全加载后，强制重新初始化所有编辑器
    setTimeout(function() {
        reinitializeAllEditors();
        
        // 显示默认选中的模块
        const activeModule = document.querySelector('.option-item.active');
        if (activeModule) {
            const moduleId = activeModule.getAttribute('data-module');
            if (moduleId) {
                console.log('显示默认选中的模块:', moduleId);
                showEditSection(moduleId);
            }
        }
    }, 1000);
    
    // 左侧模块选择功能 - 点击切换中间编辑区
    const optionItems = document.querySelectorAll('.option-item');
    optionItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // 如果点击的是开关或其子元素，不处理
            if (e.target.closest('.switch')) {
                return;
            }
            
            // 获取模块ID和开关状态
            const moduleId = this.getAttribute('data-module');
            const toggle = this.querySelector('input[type="checkbox"]');
            
            console.log('模块被点击:', moduleId);
            
            // 只有当开关打开时才允许切换编辑区域
            if (toggle && toggle.checked) {
                // 更新当前选中的模块样式
                document.querySelectorAll('.option-item').forEach(mi => mi.classList.remove('active'));
                this.classList.add('active');
                
                // 显示对应的编辑区域
                showEditSection(moduleId);
            }
        });
    });
    
    // 尝试多种方式查找添加模块按钮
    const addModuleBtn = document.getElementById('add-module-btn') || 
                         document.querySelector('.add-module-btn') || 
                         document.querySelector('[data-action="add-module"]');
    
    if (addModuleBtn) {
        console.log('找到添加模块按钮，添加点击事件');
        
        // 移除现有的事件监听器
        const newBtn = addModuleBtn.cloneNode(true);
        addModuleBtn.parentNode.replaceChild(newBtn, addModuleBtn);
        
        // 添加新的事件监听器
        newBtn.addEventListener('click', function() {
            console.log('添加模块按钮被点击');
            const moduleName = prompt('请输入新模块名称:');
            if (moduleName && moduleName.trim()) {
                createNewModule(moduleName.trim());
            }
        });
    } else {
        console.error('未找到添加模块按钮');
    }
    
    // 初始化编辑按钮
    initEditButton();
    
    // 其他初始化代码...
    
    console.log('初始化完成');
}); 