/**
 * 🌐 API Router for Static Tools
 * URL Parameter를 파싱하여 API 기능 제공
 * Static HTML에서 서버리스 API처럼 동작
 */

class APIRouter {
  constructor() {
    this.routes = new Map();
    this.middleware = [];
    this.setupDefaultRoutes();
  }

  // 🛣️ 기본 라우트 설정
  setupDefaultRoutes() {
    // Base64 API 라우트
    this.addRoute('/base64', (params) => this.handleBase64API(params));
    this.addRoute('base64', (params) => this.handleBase64API(params)); // path without leading slash
    
    // JSON API 라우트
    this.addRoute('/json', (params) => this.handleJSONAPI(params));
    this.addRoute('json', (params) => this.handleJSONAPI(params));
    
    // URL API 라우트
    this.addRoute('/url', (params) => this.handleURLAPI(params));
    this.addRoute('url', (params) => this.handleURLAPI(params));
    
    // Hash API 라우트
    this.addRoute('/hash', (params) => this.handleHashAPI(params));
    this.addRoute('hash', (params) => this.handleHashAPI(params));
  }

  // 📝 라우트 추가
  addRoute(path, handler) {
    this.routes.set(path, handler);
  }

  // 🔧 미들웨어 추가
  addMiddleware(middleware) {
    this.middleware.push(middleware);
  }

  // 🎯 URL 파라미터 파싱
  parseParams() {
    const params = new URLSearchParams(window.location.search);
    const result = {};
    
    for (const [key, value] of params.entries()) {
      result[key] = value;
    }
    
    return result;
  }

  // 🔍 현재 경로 감지
  getCurrentPath() {
    const pathname = window.location.pathname;
    const segments = pathname.split('/').filter(Boolean);
    
    // 마지막 세그먼트 또는 전체 경로 반환
    if (segments.length > 0) {
      const lastSegment = segments[segments.length - 1];
      if (lastSegment.includes('.html')) {
        // HTML 파일인 경우 디렉토리명 사용
        return segments[segments.length - 2] || segments[segments.length - 1].replace('.html', '');
      }
      return lastSegment;
    }
    
    return pathname;
  }

  // 📤 응답 포맷터
  formatResponse(data, format = 'text', status = 200) {
    const timestamp = new Date().toISOString();
    
    if (format === 'json') {
      return JSON.stringify({
        success: status === 200,
        result: data,
        timestamp: timestamp,
        status: status
      }, null, 2);
    }
    
    return data;
  }

  // ❌ 에러 응답 포맷터
  formatErrorResponse(error, format = 'text', status = 400) {
    const timestamp = new Date().toISOString();
    
    if (format === 'json') {
      return JSON.stringify({
        success: false,
        error: error,
        timestamp: timestamp,
        status: status
      }, null, 2);
    }
    
    return `Error: ${error}`;
  }

  // 📦 Base64 API 핸들러
  handleBase64API(params) {
    const { action, text = '', charset = 'utf-8', format = 'text' } = params;
    
    try {
      if (!action) {
        return this.formatErrorResponse('Missing required parameter: action', format);
      }
      
      if (!text && action !== 'help') {
        return this.formatErrorResponse('Missing required parameter: text', format);
      }
      
      const options = { charset };
      let result;
      
      switch (action.toLowerCase()) {
        case 'encode':
          result = Base64Tool.encode(text, options);
          break;
        case 'decode':
          result = Base64Tool.decode(text, options);
          break;
        case 'auto':
          result = Base64Tool.convert(text, { ...options, mode: 'auto' });
          break;
        case 'help':
          return this.formatResponse(this.getBase64Help(), format);
        default:
          return this.formatErrorResponse(`Invalid action: ${action}. Use 'encode', 'decode', 'auto', or 'help'`, format);
      }
      
      if (result.success) {
        return this.formatResponse(result.data, format);
      } else {
        return this.formatErrorResponse(result.error, format);
      }
    } catch (error) {
      return this.formatErrorResponse(error.message, format, 500);
    }
  }

  // 🔧 JSON API 핸들러
  handleJSONAPI(params) {
    const { action, json = '', indent = '2', sort_keys = 'false', format = 'text' } = params;
    
    try {
      if (!action) {
        return this.formatErrorResponse('Missing required parameter: action', format);
      }
      
      if (!json && action !== 'help') {
        return this.formatErrorResponse('Missing required parameter: json', format);
      }
      
      const options = {
        indent: parseInt(indent),
        sortKeys: sort_keys.toLowerCase() === 'true',
        minify: action === 'minify'
      };
      
      let result;
      
      switch (action.toLowerCase()) {
        case 'format':
        case 'pretty':
          result = JSONTool.format(json, options);
          break;
        case 'minify':
          result = JSONTool.minify(json);
          break;
        case 'validate':
          result = JSONTool.validate(json);
          break;
        case 'help':
          return this.formatResponse(this.getJSONHelp(), format);
        default:
          return this.formatErrorResponse(`Invalid action: ${action}. Use 'format', 'minify', 'validate', or 'help'`, format);
      }
      
      if (result.success) {
        return this.formatResponse(result.data, format);
      } else {
        return this.formatErrorResponse(result.error, format);
      }
    } catch (error) {
      return this.formatErrorResponse(error.message, format, 500);
    }
  }

  // 🔗 URL API 핸들러
  handleURLAPI(params) {
    const { action, text = '', component = 'true', format = 'text' } = params;
    
    try {
      if (!action) {
        return this.formatErrorResponse('Missing required parameter: action', format);
      }
      
      if (!text && action !== 'help') {
        return this.formatErrorResponse('Missing required parameter: text', format);
      }
      
      const options = {
        component: component.toLowerCase() === 'true'
      };
      
      let result;
      
      switch (action.toLowerCase()) {
        case 'encode':
          result = URLTool.encode(text, options);
          break;
        case 'decode':
          result = URLTool.decode(text, options);
          break;
        case 'auto':
          result = URLTool.convert(text, { ...options, mode: 'auto' });
          break;
        case 'help':
          return this.formatResponse(this.getURLHelp(), format);
        default:
          return this.formatErrorResponse(`Invalid action: ${action}. Use 'encode', 'decode', 'auto', or 'help'`, format);
      }
      
      if (result.success) {
        return this.formatResponse(result.data, format);
      } else {
        return this.formatErrorResponse(result.error, format);
      }
    } catch (error) {
      return this.formatErrorResponse(error.message, format, 500);
    }
  }

  // 🔐 Hash API 핸들러
  async handleHashAPI(params) {
    const { action, text = '', format = 'text' } = params;
    
    try {
      if (!action) {
        return this.formatErrorResponse('Missing required parameter: action', format);
      }
      
      if (!text && action !== 'help') {
        return this.formatErrorResponse('Missing required parameter: text', format);
      }
      
      let result;
      
      switch (action.toLowerCase()) {
        case 'md5':
          result = await HashTool.md5(text);
          break;
        case 'sha256':
          result = await HashTool.sha256(text);
          break;
        case 'help':
          return this.formatResponse(this.getHashHelp(), format);
        default:
          return this.formatErrorResponse(`Invalid action: ${action}. Use 'md5', 'sha256', or 'help'`, format);
      }
      
      if (result.success) {
        return this.formatResponse(result.data, format);
      } else {
        return this.formatErrorResponse(result.error, format);
      }
    } catch (error) {
      return this.formatErrorResponse(error.message, format, 500);
    }
  }

  // 📚 도움말 메시지들
  getBase64Help() {
    return `Base64 API Usage:
    
?action=encode&text=Hello World
?action=decode&text=SGVsbG8gV29ybGQ=
?action=auto&text=Hello (auto-detects if encode/decode needed)

Optional parameters:
- charset: utf-8, iso-8859-1, windows-1252 (default: utf-8)
- format: text, json (default: text)

Examples:
/base64?action=encode&text=Hello World&format=json
/base64?action=decode&text=SGVsbG8gV29ybGQ=&charset=utf-8`;
  }

  getJSONHelp() {
    return `JSON API Usage:
    
?action=format&json={"name":"John","age":30}
?action=minify&json={"name": "John", "age": 30}
?action=validate&json={"test": true}

Optional parameters:
- indent: 2, 4, 8 (default: 2, for format action)
- sort_keys: true, false (default: false)
- format: text, json (default: text)

Examples:
/json?action=format&json={"name":"John"}&indent=4&sort_keys=true
/json?action=validate&json={"test":true}&format=json`;
  }

  getURLHelp() {
    return `URL API Usage:
    
?action=encode&text=hello world
?action=decode&text=hello%20world
?action=auto&text=hello world (auto-detects if encode/decode needed)

Optional parameters:
- component: true, false (default: true)
  true: uses encodeURIComponent (for query params)
  false: uses encodeURI (for full URLs)
- format: text, json (default: text)

Examples:
/url?action=encode&text=hello world&component=true
/url?action=decode&text=hello%20world&format=json`;
  }

  getHashHelp() {
    return `Hash API Usage:
    
?action=md5&text=Hello World
?action=sha256&text=Hello World

Optional parameters:
- format: text, json (default: text)

Examples:
/hash?action=sha256&text=Hello World&format=json
/hash?action=md5&text=secret password`;
  }

  // 🚀 메인 라우터 실행
  async route() {
    const params = this.parseParams();
    const path = this.getCurrentPath();
    
    // 미들웨어 실행
    for (const middleware of this.middleware) {
      const result = await middleware(params, path);
      if (result === false) {
        return; // 미들웨어에서 중단
      }
    }
    
    // API 요청인지 확인 (action 파라미터가 있는지)
    if (!params.action) {
      return; // 일반 페이지 로드
    }
    
    // 라우트 핸들러 찾기
    const handler = this.routes.get(path) || this.routes.get(`/${path}`);
    
    if (!handler) {
      const errorResponse = this.formatErrorResponse(
        `Unknown API endpoint: ${path}. Available endpoints: base64, json, url, hash`,
        params.format || 'text',
        404
      );
      this.renderAPIResponse(errorResponse);
      return;
    }
    
    try {
      // 핸들러 실행
      const response = await handler(params);
      this.renderAPIResponse(response);
    } catch (error) {
      const errorResponse = this.formatErrorResponse(
        `Internal server error: ${error.message}`,
        params.format || 'text',
        500
      );
      this.renderAPIResponse(errorResponse);
    }
  }

  // 📄 API 응답을 페이지에 렌더링
  renderAPIResponse(response) {
    document.body.innerHTML = `
      <pre style="
        background: #1a1a1a;
        color: #fff;
        padding: 20px;
        font-family: 'Fira Code', 'Monaco', monospace;
        font-size: 14px;
        line-height: 1.6;
        margin: 0;
        white-space: pre-wrap;
        word-wrap: break-word;
        min-height: 100vh;
      ">${response}</pre>
    `;
    
    // Content-Type 헤더 설정 (가능한 경우)
    try {
      const params = this.parseParams();
      if (params.format === 'json') {
        document.querySelector('pre').style.background = '#0f1419';
        document.querySelector('pre').style.color = '#d4d4d4';
      }
    } catch (e) {
      // 무시
    }
  }

  // 🔧 CORS 미들웨어 (필요시)
  static corsMiddleware() {
    return async (params, path) => {
      // CORS 헤더 설정 (브라우저에서는 실제로 적용되지 않지만 문서화 목적)
      console.log('CORS: Access-Control-Allow-Origin: *');
      console.log('CORS: Access-Control-Allow-Methods: GET, POST, OPTIONS');
      console.log('CORS: Access-Control-Allow-Headers: Content-Type');
      return true;
    };
  }

  // 📊 로깅 미들웨어
  static loggingMiddleware() {
    return async (params, path) => {
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] API Request: ${path}`, params);
      return true;
    };
  }
}

// 🌐 전역 API 라우터 인스턴스
window.APIRouter = APIRouter;

// 🚀 자동 초기화 및 라우팅
document.addEventListener('DOMContentLoaded', async () => {
  const router = new APIRouter();
  
  // 미들웨어 추가
  router.addMiddleware(APIRouter.loggingMiddleware());
  router.addMiddleware(APIRouter.corsMiddleware());
  
  // 라우팅 실행
  await router.route();
});

console.log('🌐 API Router loaded successfully!');
