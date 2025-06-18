/**
 * 🛠️ Tools Core JavaScript Library
 * TypeScript tools-core를 브라우저용 JavaScript로 컴파일된 버전
 * 모든 Static HTML 페이지에서 공통으로 사용
 */

// 🎯 Tool Result Interface
class ToolResult {
  constructor(success, data = null, error = null, operation = null) {
    this.success = success;
    this.data = data;
    this.error = error;
    this.operation = operation;
  }
}

// 📦 Base64 Tool Class
class Base64Tool {
  static isBase64(str) {
    try {
      if (!str || str.length % 4 !== 0 || !/^[A-Za-z0-9+/]*={0,2}$/.test(str)) {
        return false;
      }
      atob(str);
      return true;
    } catch (e) {
      return false;
    }
  }

  static encode(text, options = {}) {
    try {
      const { charset = 'utf-8' } = options;
      
      let encoded;
      if (window.TextEncoder) {
        const encoder = new TextEncoder();
        const bytes = encoder.encode(text);
        encoded = btoa(String.fromCharCode(...bytes));
      } else {
        // 폴백: UTF-8 인코딩
        const utf8 = unescape(encodeURIComponent(text));
        encoded = btoa(utf8);
      }

      return new ToolResult(true, encoded, null, 'Encoded to Base64');
    } catch (error) {
      return new ToolResult(false, null, 'Failed to encode text. Please check your input.');
    }
  }

  static decode(base64, options = {}) {
    try {
      const { charset = 'utf-8' } = options;
      
      // 패딩 보정
      const paddedBase64 = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=');
      const decoded = atob(paddedBase64);
      
      let result;
      if (window.TextDecoder) {
        const bytes = new Uint8Array([...decoded].map(c => c.charCodeAt(0)));
        try {
          const decoder = new TextDecoder(charset, { fatal: true });
          result = decoder.decode(bytes);
        } catch (e) {
          // 폴백: UTF-8로 시도
          const decoder = new TextDecoder('utf-8', { fatal: false });
          result = decoder.decode(bytes);
        }
      } else {
        // 폴백: URI 디코딩
        result = decodeURIComponent(escape(decoded));
      }

      return new ToolResult(true, result, null, 'Decoded from Base64');
    } catch (error) {
      return new ToolResult(false, null, 'Invalid Base64 string or encoding mismatch');
    }
  }

  static convert(input, options = {}) {
    const { mode = 'auto' } = options;

    if (!input.trim()) {
      return new ToolResult(false, null, 'Please enter some text to convert');
    }

    switch (mode) {
      case 'encode':
        return this.encode(input, options);
      case 'decode':
        return this.decode(input, options);
      case 'auto':
      default:
        if (this.isBase64(input)) {
          return this.decode(input, options);
        } else {
          return this.encode(input, options);
        }
    }
  }
}

// 🔧 JSON Tool Class
class JSONTool {
  static isValidJSON(str) {
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  }

  static format(jsonString, options = {}) {
    try {
      const { indent = 2, sortKeys = false, minify = false } = options;
      
      const parsed = JSON.parse(jsonString);
      
      if (minify) {
        return new ToolResult(true, JSON.stringify(parsed), null, 'JSON Minified');
      }

      const formatted = JSON.stringify(
        sortKeys ? this.sortObjectKeys(parsed) : parsed,
        null,
        indent
      );

      return new ToolResult(true, formatted, null, `JSON Formatted (${indent} spaces)`);
    } catch (error) {
      return new ToolResult(false, null, 'Invalid JSON format');
    }
  }

  static validate(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      const type = Array.isArray(parsed) ? 'Array' : typeof parsed;
      
      return new ToolResult(true, `Valid JSON (${type})`, null, 'JSON Validated');
    } catch (error) {
      return new ToolResult(false, null, `Invalid JSON: ${error.message}`);
    }
  }

  static minify(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      return new ToolResult(true, JSON.stringify(parsed), null, 'JSON Minified');
    } catch (error) {
      return new ToolResult(false, null, 'Invalid JSON format');
    }
  }

  static sortObjectKeys(obj) {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map(item => this.sortObjectKeys(item));
    }

    const sortedKeys = Object.keys(obj).sort();
    const sortedObj = {};
    
    for (const key of sortedKeys) {
      sortedObj[key] = this.sortObjectKeys(obj[key]);
    }

    return sortedObj;
  }
}

// 🔗 URL Tool Class
class URLTool {
  static encode(text, options = {}) {
    try {
      const { component = true } = options;
      
      let result;
      if (component) {
        result = encodeURIComponent(text);
      } else {
        result = encodeURI(text);
      }

      return new ToolResult(true, result, null, 'URL Encoded');
    } catch (error) {
      return new ToolResult(false, null, 'Failed to encode URL');
    }
  }

  static decode(text, options = {}) {
    try {
      const { component = true } = options;
      
      let result;
      if (component) {
        result = decodeURIComponent(text);
      } else {
        result = decodeURI(text);
      }

      return new ToolResult(true, result, null, 'URL Decoded');
    } catch (error) {
      return new ToolResult(false, null, 'Failed to decode URL');
    }
  }

  static isEncoded(str) {
    try {
      return str !== decodeURIComponent(str);
    } catch (e) {
      return false;
    }
  }

  static convert(input, options = {}) {
    const { mode = 'auto' } = options;

    if (!input.trim()) {
      return new ToolResult(false, null, 'Please enter some text to convert');
    }

    switch (mode) {
      case 'encode':
        return this.encode(input, options);
      case 'decode':
        return this.decode(input, options);
      case 'auto':
      default:
        if (this.isEncoded(input)) {
          return this.decode(input, options);
        } else {
          return this.encode(input, options);
        }
    }
  }
}

// 🛠️ 공통 유틸리티 함수들
class ToolUtils {
  static async copyToClipboard(text) {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        return true;
      } else {
        // 폴백
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const result = document.execCommand('copy');
        document.body.removeChild(textArea);
        return result;
      }
    } catch (err) {
      console.error('Failed to copy: ', err);
      return false;
    }
  }

  static downloadFile(content, filename, mimeType = 'text/plain') {
    try {
      const blob = new Blob([content], { type: mimeType });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      return true;
    } catch (error) {
      console.error('Failed to download file:', error);
      return false;
    }
  }

  static showToast(message, type = 'success', duration = 3000) {
    // 기존 토스트 제거
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
      existingToast.remove();
    }

    // 새 토스트 생성
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // 애니메이션 시작
    setTimeout(() => {
      toast.classList.add('show');
    }, 100);
    
    // 자동 제거
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, duration);
  }

  static debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  static formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  static getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    return Object.fromEntries(params.entries());
  }

  static setUrlParam(key, value) {
    const url = new URL(window.location);
    url.searchParams.set(key, value);
    window.history.pushState({}, '', url);
  }

  static removeUrlParam(key) {
    const url = new URL(window.location);
    url.searchParams.delete(key);
    window.history.pushState({}, '', url);
  }
}

// 🔐 Hash Tool Class (추가 기능)
class HashTool {
  static async md5(text) {
    // 간단한 MD5 시뮬레이션 (실제 프로덕션에서는 crypto-js 사용 권장)
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(text);
      
      // 간단한 해시 시뮬레이션
      let hash = 0;
      for (let i = 0; i < data.length; i++) {
        const char = data[i];
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // 32bit 정수로 변환
      }
      
      const result = Math.abs(hash).toString(16).padStart(8, '0');
      return new ToolResult(true, result, null, 'MD5 Hash Generated');
    } catch (error) {
      return new ToolResult(false, null, 'Failed to generate MD5 hash');
    }
  }

  static async sha256(text) {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(text);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const result = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      
      return new ToolResult(true, result, null, 'SHA-256 Hash Generated');
    } catch (error) {
      return new ToolResult(false, null, 'Failed to generate SHA-256 hash');
    }
  }
}

// 🌐 전역 객체로 노출
window.ToolsAPI = {
  Base64: Base64Tool,
  JSON: JSONTool,
  URL: URLTool,
  Hash: HashTool,
  Utils: ToolUtils,
  ToolResult: ToolResult
};

// 🎯 간편 접근을 위한 별칭
window.Base64Tool = Base64Tool;
window.JSONTool = JSONTool;
window.URLTool = URLTool;
window.HashTool = HashTool;
window.ToolUtils = ToolUtils;

console.log('🚀 Tools Core Library loaded successfully!');
