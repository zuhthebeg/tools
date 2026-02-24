/**
 * 모델 관리 시스템 for Gemma 3n
 * tools/models/model-manager.js
 */

class ModelManager {
    constructor() {
        this.models = {
            'gemma2b-gpu': {
                name: 'Gemma 2B GPU Int4',
                size: '1.3GB',
                capabilities: ['text'],
                url: 'https://www.kaggle.com/models/google/gemma/frameworks/mediapippe/variations/2b-it-gpu-int4/versions/1?lite-format=tflite',
                localPath: '/tools/models/gemma-2b-it-gpu-int4.bin',
                description: 'GPU 최적화된 4bit 양자화 Gemma 2B 모델'
            },
            'gemma2b-cpu': {
                name: 'Gemma 2B CPU Int8',
                size: '2.0GB',
                capabilities: ['text'],
                url: 'https://www.kaggle.com/models/google/gemma/frameworks/mediapippe/variations/2b-it-cpu-int8/versions/1?lite-format=tflite',
                localPath: '/tools/models/gemma-2b-it-cpu-int8.bin',
                description: 'CPU 호환 8bit 양자화 Gemma 2B 모델'
            },
            'gemma3-1b': {
                name: 'Gemma 3 1B IT',
                size: '529MB',
                capabilities: ['text'],
                url: 'https://huggingface.co/litert-community/Gemma3-1B-IT/resolve/main/gemma3-1b-it-int4.task',
                localPath: '/tools/models/gemma3-1b-it-int4.task',
                description: '최신 Gemma 3 1B 경량 모델'
            }
        };
        
        this.cache = null;
        this.initCache();
    }

    // Cache API 초기화
    async initCache() {
        try {
            this.cache = await caches.open('ai-models-v1');
            console.log('모델 캐시 초기화 완료');
        } catch (error) {
            console.error('캐시 초기화 실패:', error);
        }
    }

    // 모델 다운로드 상태 확인
    async isModelCached(modelId) {
        if (!this.cache) return false;
        
        try {
            const response = await this.cache.match(this.models[modelId].localPath);
            return !!response;
        } catch (error) {
            console.error('캐시 확인 오류:', error);
            return false;
        }
    }

    // 사용자에게 모델 다운로드 요청
    async requestModelDownload(modelId, requiredCapabilities = []) {
        console.log('모델 다운로드 요청:', modelId, requiredCapabilities);
        
        const model = this.models[modelId];
        if (!model) {
            throw new Error(`알 수 없는 모델: ${modelId}`);
        }

        // 이미 캐시된 모델인지 확인
        const isCached = await this.isModelCached(modelId);
        if (isCached) {
            console.log('모델이 이미 캐시됨:', modelId);
            return true;
        }

        // 사용자에게 다운로드 확인 요청
        const userConfirmed = confirm(
            `🤖 AI 기능 사용을 위해 모델을 다운로드해야 합니다.\n\n` +
            `모델: ${model.name}\n` +
            `크기: ${model.size}\n` +
            `기능: ${model.capabilities.join(', ')}\n` +
            `설명: ${model.description}\n\n` +
            `다운로드하시겠습니까?\n` +
            `(한 번 다운로드하면 캐시되어 다음에는 빠르게 로드됩니다)`
        );

        if (!userConfirmed) {
            throw new Error('사용자가 모델 다운로드를 취소했습니다.');
        }

        // 모델 다운로드 시작
        return await this.downloadModel(modelId);
    }

    // 진행률과 함께 모델 다운로드
    async downloadModel(modelId, progressCallback = null) {
        const model = this.models[modelId];
        console.log('모델 다운로드 시작:', model.name);

        try {
            // 다운로드 진행률을 위한 UI 생성
            const progressDiv = this.createProgressUI(model.name);
            
            // 청크 단위 병렬 다운로드
            const response = await this.downloadInChunks(
                model.url, 
                (downloaded, total) => {
                    const percent = Math.round((downloaded / total) * 100);
                    this.updateProgress(progressDiv, percent);
                    if (progressCallback) progressCallback(percent);
                }
            );

            // 캐시에 저장
            await this.cache.put(model.localPath, response.clone());
            
            this.hideProgress(progressDiv);
            console.log('모델 다운로드 및 캐시 완료:', modelId);
            
            return true;
        } catch (error) {
            console.error('모델 다운로드 실패:', error);
            this.hideProgress();
            throw error;
        }
    }

    // 청크 단위 병렬 다운로드 (Chrome AI 가이드 기반)
    async downloadInChunks(url, progressCallback, chunkSize = 5 * 1024 * 1024) {
        // HEAD 요청으로 파일 크기 확인
        const headResponse = await fetch(url, { method: 'HEAD' });
        const totalSize = parseInt(headResponse.headers.get('content-length'), 10);
        
        if (!totalSize) {
            // 크기를 알 수 없으면 일반 다운로드
            return fetch(url);
        }

        const chunks = [];
        const numChunks = Math.ceil(totalSize / chunkSize);
        let downloadedBytes = 0;

        // 병렬 다운로드를 위한 Promise 배열
        const chunkPromises = [];
        
        for (let i = 0; i < numChunks; i++) {
            const start = i * chunkSize;
            const end = Math.min(start + chunkSize - 1, totalSize - 1);
            
            const chunkPromise = fetch(url, {
                headers: {
                    'Range': `bytes=${start}-${end}`
                }
            }).then(async response => {
                if (response.status === 206 || response.status === 200) {
                    const chunk = await response.arrayBuffer();
                    downloadedBytes += chunk.byteLength;
                    
                    if (progressCallback) {
                        progressCallback(downloadedBytes, totalSize);
                    }
                    
                    return { index: i, data: chunk };
                } else {
                    throw new Error(`청크 다운로드 실패: ${response.status}`);
                }
            });
            
            chunkPromises.push(chunkPromise);
        }

        // 모든 청크 다운로드 완료 대기
        const chunkResults = await Promise.all(chunkPromises);
        
        // 청크를 순서대로 정렬하고 결합
        chunkResults.sort((a, b) => a.index - b.index);
        const combinedBuffer = new Uint8Array(totalSize);
        let offset = 0;
        
        for (const chunk of chunkResults) {
            combinedBuffer.set(new Uint8Array(chunk.data), offset);
            offset += chunk.data.byteLength;
        }

        // Response 객체로 반환
        return new Response(combinedBuffer, {
            status: 200,
            statusText: 'OK',
            headers: {
                'Content-Type': 'application/octet-stream',
                'Content-Length': totalSize.toString()
            }
        });
    }

    // 진행률 UI 생성
    createProgressUI(modelName) {
        const existingProgress = document.getElementById('model-download-progress');
        if (existingProgress) {
            existingProgress.remove();
        }

        const progressDiv = document.createElement('div');
        progressDiv.id = 'model-download-progress';
        progressDiv.className = 'fixed top-4 right-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-4 shadow-lg z-50 min-w-80';
        
        progressDiv.innerHTML = `
            <div class="flex items-center mb-2">
                <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                <span class="font-medium text-gray-900 dark:text-white">모델 다운로드 중...</span>
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-400 mb-2">${modelName}</div>
            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div id="progress-bar" class="bg-blue-600 h-2 rounded-full transition-all duration-300" style="width: 0%"></div>
            </div>
            <div id="progress-text" class="text-xs text-gray-500 dark:text-gray-400 mt-1">0%</div>
        `;
        
        document.body.appendChild(progressDiv);
        return progressDiv;
    }

    // 진행률 업데이트
    updateProgress(progressDiv, percent) {
        if (!progressDiv) return;
        
        const progressBar = progressDiv.querySelector('#progress-bar');
        const progressText = progressDiv.querySelector('#progress-text');
        
        if (progressBar) progressBar.style.width = `${percent}%`;
        if (progressText) progressText.textContent = `${percent}%`;
    }

    // 진행률 UI 숨기기
    hideProgress(progressDiv) {
        if (progressDiv) {
            setTimeout(() => {
                progressDiv.style.opacity = '0';
                setTimeout(() => progressDiv.remove(), 300);
            }, 1000);
        }
    }

    // 캐시된 모델 로드
    async loadModel(modelId) {
        console.log('모델 로드 시작:', modelId);
        
        const isCached = await this.isModelCached(modelId);
        if (!isCached) {
            throw new Error(`모델이 캐시되지 않음: ${modelId}`);
        }

        try {
            const response = await this.cache.match(this.models[modelId].localPath);
            const arrayBuffer = await response.arrayBuffer();
            
            console.log('모델 로드 완료:', modelId, 'Size:', arrayBuffer.byteLength);
            return arrayBuffer;
        } catch (error) {
            console.error('모델 로드 실패:', error);
            throw error;
        }
    }

    // 특정 기능에 필요한 모델 추천
    getRecommendedModel(capabilities) {
        console.log('필요한 기능:', capabilities);
        
        // WebGPU 지원 확인
        const hasWebGPU = !!navigator.gpu;
        
        // 텍스트 처리용 모델 선택
        if (capabilities.includes('text')) {
            if (hasWebGPU) {
                return 'gemma2b-gpu';  // WebGPU 지원시 GPU 모델
            } else {
                return 'gemma2b-cpu';  // CPU 모델
            }
        }
        
        // 기본값: 경량 모델
        return 'gemma3-1b';
    }

    // 모델 캐시 정리
    async clearCache() {
        try {
            await caches.delete('ai-models-v1');
            console.log('모델 캐시 정리 완료');
            return true;
        } catch (error) {
            console.error('캐시 정리 실패:', error);
            return false;
        }
    }

    // 캐시 사용량 확인
    async getCacheSize() {
        if (!this.cache) return 0;
        
        try {
            const requests = await this.cache.keys();
            let totalSize = 0;
            
            for (const request of requests) {
                const response = await this.cache.match(request);
                if (response) {
                    const clone = response.clone();
                    const buffer = await clone.arrayBuffer();
                    totalSize += buffer.byteLength;
                }
            }
            
            return totalSize;
        } catch (error) {
            console.error('캐시 크기 확인 실패:', error);
            return 0;
        }
    }

    // 사용자 친화적인 크기 표시
    formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    // WebGPU 지원 확인
    async checkWebGPUSupport() {
        if (!navigator.gpu) {
            console.warn('WebGPU 미지원: CPU 모델을 사용합니다.');
            return false;
        }
        
        try {
            const adapter = await navigator.gpu.requestAdapter();
            if (!adapter) return false;
            
            const device = await adapter.requestDevice();
            console.log('WebGPU 지원 확인됨');
            return true;
        } catch (error) {
            console.warn('WebGPU 초기화 실패:', error);
            return false;
        }
    }
}

// 전역 모델 매니저 인스턴스 
if (typeof window !== 'undefined') {
    window.modelManager = new ModelManager();
}

export default ModelManager;