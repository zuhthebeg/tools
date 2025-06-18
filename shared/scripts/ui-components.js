/**
 * 🎨 Common UI Components for Static Tools
 * TypeScript tool-components를 JavaScript로 구현
 * 재사용 가능한 UI 컴포넌트들
 */

class UIComponents {
  
  // 📝 TextArea with Actions 컴포넌트
  static createTextAreaWithActions(options = {}) {
    const {
      id,
      label,
      placeholder = '',
      value = '',
      readonly = false,
      showActions = false,
      downloadFileName = 'result.txt',
      className = '',
      onChange = null
    } = options;

    const container = document.createElement('div');
    container.className = `form-group ${className}`;

    // 라벨과 액션 버튼들
    const labelContainer = document.createElement('div');
    labelContainer.className = 'flex items-center justify-between';

    const labelElement = document.createElement('label');
    labelElement.className = 'form-label';
    labelElement.textContent = label;
    labelElement.htmlFor = id;

    labelContainer.appendChild(labelElement);

    // 액션 버튼들
    if (showActions) {
      const actionsContainer = document.createElement('div');
      actionsContainer.className = 'flex gap-sm';

      const copyBtn = document.createElement('button');
      copyBtn.className = 'btn btn-accent text-xs';
      copyBtn.innerHTML = '📋 Copy';
      copyBtn.disabled = !value;
      copyBtn.onclick = async () => {
        const textarea = container.querySelector('textarea');
        if (!textarea.value) {
          ToolUtils.showToast('Nothing to copy!', 'warning');
          return;
        }
        const success = await ToolUtils.copyToClipboard(textarea.value);
        if (success) {
          ToolUtils.showToast('📋 Copied to clipboard!', 'success');
        } else {
          ToolUtils.showToast('❌ Failed to copy', 'error');
        }
      };

      const downloadBtn = document.createElement('button');
      downloadBtn.className = 'btn btn-secondary text-xs';
      downloadBtn.innerHTML = '💾 Download';
      downloadBtn.disabled = !value;
      downloadBtn.onclick = () => {
        const textarea = container.querySelector('textarea');
        if (!textarea.value) {
          ToolUtils.showToast('Nothing to download!', 'warning');
          return;
        }
        const success = ToolUtils.downloadFile(textarea.value, downloadFileName);
        if (success) {
          ToolUtils.showToast('💾 File downloaded!', 'success');
        }
      };

      actionsContainer.appendChild(copyBtn);
      actionsContainer.appendChild(downloadBtn);
      labelContainer.appendChild(actionsContainer);
    }

    container.appendChild(labelContainer);

    // TextArea 그룹
    const textareaGroup = document.createElement('div');
    textareaGroup.className = 'textarea-group';

    const textarea = document.createElement('textarea');
    textarea.id = id;
    textarea.className = 'form-textarea';
    textarea.placeholder = placeholder;
    textarea.value = value;
    textarea.readOnly = readonly;

    // 문자 카운터
    const counter = document.createElement('div');
    counter.className = 'textarea-counter';
    counter.textContent = `${value.length} characters`;

    // 이벤트 리스너
    textarea.addEventListener('input', (e) => {
      counter.textContent = `${e.target.value.length} characters`;
      
      // 액션 버튼 상태 업데이트
      if (showActions) {
        const copyBtn = container.querySelector('button:first-of-type');
        const downloadBtn = container.querySelector('button:last-of-type');
        copyBtn.disabled = !e.target.value;
        downloadBtn.disabled = !e.target.value;
      }
      
      if (onChange) {
        onChange(e.target.value);
      }
    });

    textareaGroup.appendChild(textarea);
    textareaGroup.appendChild(counter);
    container.appendChild(textareaGroup);

    return container;
  }

  // 📊 Status Display 컴포넌트
  static createStatusDisplay(options = {}) {
    const {
      status = 'Ready',
      type = 'info',
      showSpinner = false,
      className = ''
    } = options;

    const container = document.createElement('div');
    container.className = `status-display ${className}`;

    if (showSpinner) {
      const spinner = document.createElement('div');
      spinner.className = 'spinner';
      container.appendChild(spinner);
    }

    const statusText = document.createElement('span');
    statusText.className = `status-${type}`;
    statusText.textContent = status;
    container.appendChild(statusText);

    // 상태 업데이트 메서드
    container.updateStatus = (newStatus, newType = 'info', newShowSpinner = false) => {
      statusText.textContent = newStatus;
      statusText.className = `status-${newType}`;
      
      const existingSpinner = container.querySelector('.spinner');
      if (newShowSpinner && !existingSpinner) {
        const spinner = document.createElement('div');
        spinner.className = 'spinner';
        container.insertBefore(spinner, statusText);
      } else if (!newShowSpinner && existingSpinner) {
        existingSpinner.remove();
      }
    };

    return container;
  }

  // 🔧 Tool Controls 컴포넌트
  static createToolControls(options = {}) {
    const {
      onConvert = () => {},
      onClear = null,
      isLoading = false,
      disabled = false,
      children = []
    } = options;

    const container = document.createElement('div');
    container.className = 'grid grid-cols-1 gap-lg';

    // 자식 요소들 추가
    children.forEach(child => {
      if (typeof child === 'string') {
        const div = document.createElement('div');
        div.innerHTML = child;
        container.appendChild(div);
      } else {
        container.appendChild(child);
      }
    });

    // 버튼 컨테이너
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'flex items-end gap-md';

    const convertBtn = document.createElement('button');
    convertBtn.className = 'btn btn-primary flex-1';
    convertBtn.disabled = disabled || isLoading;
    convertBtn.innerHTML = isLoading ? 
      '🔄 Converting...' : 
      '🔄 Convert';
    convertBtn.onclick = onConvert;

    buttonContainer.appendChild(convertBtn);

    if (onClear) {
      const clearBtn = document.createElement('button');
      clearBtn.className = 'btn btn-ghost';
      clearBtn.textContent = 'Clear';
      clearBtn.onclick = onClear;
      buttonContainer.appendChild(clearBtn);
    }

    container.appendChild(buttonContainer);

    // 상태 업데이트 메서드
    container.updateLoading = (loading) => {
      convertBtn.disabled = disabled || loading;
      convertBtn.innerHTML = loading ? 
        '🔄 Converting...' : 
        '🔄 Convert';
    };

    return container;
  }

  // 🎨 Feature Card 컴포넌트
  static createFeatureCard(options = {}) {
    const {
      icon = '🔧',
      title = 'Feature',
      description = 'Feature description',
      className = ''
    } = options;

    const card = document.createElement('div');
    card.className = `feature-card glass glass-hover ${className}`;

    const iconElement = document.createElement('div');
    iconElement.className = 'feature-icon';
    iconElement.textContent = icon;

    const titleElement = document.createElement('h3');
    titleElement.className = 'feature-title gradient-text';
    titleElement.textContent = title;

    const descElement = document.createElement('p');
    descElement.className = 'feature-description';
    descElement.textContent = description;

    card.appendChild(iconElement);
    card.appendChild(titleElement);
    card.appendChild(descElement);

    return card;
  }

  // 🎯 Tool Header 컴포넌트
  static createToolHeader(options = {}) {
    const {
      title = 'Tool',
      icon = '🔧',
      backLink = '/',
      className = ''
    } = options;

    const header = document.createElement('header');
    header.className = `tool-header ${className}`;

    const content = document.createElement('div');
    content.className = 'header-content';

    // 타이틀 그룹
    const titleGroup = document.createElement('div');
    titleGroup.className = 'tool-title-group';

    const iconElement = document.createElement('div');
    iconElement.className = 'tool-icon';
    iconElement.textContent = icon;

    const titleElement = document.createElement('h1');
    titleElement.className = 'tool-title gradient-text';
    titleElement.textContent = title;

    titleGroup.appendChild(iconElement);
    titleGroup.appendChild(titleElement);

    // 뒤로가기 링크
    const backLinkElement = document.createElement('a');
    backLinkElement.className = 'back-link';
    backLinkElement.href = backLink;
    backLinkElement.innerHTML = '← Back to Portal';

    content.appendChild(titleGroup);
    content.appendChild(backLinkElement);
    header.appendChild(content);

    return header;
  }

  // 🦶 Tool Footer 컴포넌트
  static createToolFooter(options = {}) {
    const {
      title = 'Tool',
      className = ''
    } = options;

    const footer = document.createElement('footer');
    footer.className = `tool-footer ${className}`;

    const content = document.createElement('div');
    content.className = 'footer-content glass';

    const text = document.createElement('div');
    text.className = 'footer-text';
    text.innerHTML = `
      © 2025 ${title}. Made with ❤️ by 
      <a href="https://cocy.io" class="footer-link" target="_blank" rel="noopener noreferrer">COCY.IO</a>
    `;

    const meta = document.createElement('div');
    meta.className = 'footer-meta';
    meta.innerHTML = `
      <span>Privacy-First</span>
      <span>•</span>
      <span>Open Source</span>
      <span>•</span>
      <span>No Tracking</span>
    `;

    content.appendChild(text);
    content.appendChild(meta);
    footer.appendChild(content);

    return footer;
  }

  // 🔧 Select 컴포넌트
  static createSelect(options = {}) {
    const {
      id,
      label,
      value = '',
      choices = [],
      onChange = null,
      className = ''
    } = options;

    const container = document.createElement('div');
    container.className = `form-group ${className}`;

    if (label) {
      const labelElement = document.createElement('label');
      labelElement.className = 'form-label';
      labelElement.textContent = label;
      labelElement.htmlFor = id;
      container.appendChild(labelElement);
    }

    const select = document.createElement('select');
    select.id = id;
    select.className = 'form-select';
    select.value = value;

    choices.forEach(choice => {
      const option = document.createElement('option');
      if (typeof choice === 'string') {
        option.value = choice;
        option.textContent = choice;
      } else {
        option.value = choice.value;
        option.textContent = choice.label;
      }
      
      if (option.value === value) {
        option.selected = true;
      }
      
      select.appendChild(option);
    });

    if (onChange) {
      select.addEventListener('change', (e) => onChange(e.target.value));
    }

    container.appendChild(select);
    return container;
  }

  // ☑️ Checkbox 컴포넌트
  static createCheckbox(options = {}) {
    const {
      id,
      label,
      checked = false,
      onChange = null,
      className = ''
    } = options;

    const container = document.createElement('div');
    container.className = `flex items-center gap-sm ${className}`;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = id;
    checkbox.className = 'form-checkbox';
    checkbox.checked = checked;

    const labelElement = document.createElement('label');
    labelElement.className = 'text-sm cursor-pointer';
    labelElement.textContent = label;
    labelElement.htmlFor = id;

    if (onChange) {
      checkbox.addEventListener('change', (e) => onChange(e.target.checked));
    }

    container.appendChild(checkbox);
    container.appendChild(labelElement);

    return container;
  }

  // 📋 Tool Layout 컴포넌트 (전체 페이지 구조)
  static createToolLayout(options = {}) {
    const {
      title = 'Tool',
      icon = '🔧',
      description = 'Tool description',
      features = [],
      children = []
    } = options;

    // 메인 컨테이너
    const container = document.createElement('div');
    container.className = 'tool-container';

    // 헤더
    const header = this.createToolHeader({ title, icon });
    container.appendChild(header);

    // 메인 콘텐츠
    const main = document.createElement('main');
    main.className = 'content-wrapper';

    const contentCard = document.createElement('div');
    contentCard.className = 'glass floating';
    contentCard.style.padding = 'var(--spacing-xl)';

    // 설명
    const descElement = document.createElement('div');
    descElement.className = 'text-center';
    descElement.style.marginBottom = 'var(--spacing-2xl)';
    descElement.innerHTML = `<p class="text-lg">${description}</p>`;
    contentCard.appendChild(descElement);

    // 자식 콘텐츠 추가
    children.forEach(child => {
      if (typeof child === 'string') {
        const div = document.createElement('div');
        div.innerHTML = child;
        contentCard.appendChild(div);
      } else {
        contentCard.appendChild(child);
      }
    });

    main.appendChild(contentCard);

    // 기능 카드들
    if (features.length > 0) {
      const featureGrid = document.createElement('div');
      featureGrid.className = 'feature-grid';
      
      features.forEach(feature => {
        const card = this.createFeatureCard(feature);
        featureGrid.appendChild(card);
      });
      
      main.appendChild(featureGrid);
    }

    container.appendChild(main);

    // 푸터
    const footer = this.createToolFooter({ title });
    container.appendChild(footer);

    return container;
  }
}

// 🌐 전역 노출
window.UIComponents = UIComponents;

console.log('🎨 UI Components loaded successfully!');
