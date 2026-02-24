/**
 * OCR-WiFi 기능 for QR Tool (수정됨)
 * tools/qr/ocr-wifi.js
 */

class OCRWiFiGenerator {
    constructor() {
        // ModelManager는 선택사항으로 사용
        this.modelManager = window.modelManager || null;
        this.llmInference = null;
        this.isInitialized = false;
    }

    // MediaPipe LLM 초기화 (Gemma 2B 사용)
    async initializeModel() {
        if (this.isInitialized) return;

        try {
            console.log('OCR-WiFi 시스템 초기화 시작 (기본 모드)');
            
            // 현재 버전에서는 모델 다운로드 없이 정규식 기반으로만 동작
            console.log('OCR-WiFi: 정규식 기반 파싱 모드로 작동');
            
            this.isInitialized = true;
            console.log('OCR-WiFi 시스템 초기화 완료');
            
        } catch (error) {
            console.error('OCR-WiFi 초기화 실패:', error);
            // 모델 로드 에러 시에도 기본 기능은 사용 가능
            this.isInitialized = true;
            console.log('모델 없이 기본 모드로 계속 진행');
        }
    }

    // 이미지에서 WiFi 정보 추출 (텍스트 기반 처리)
    async extractWiFiFromImage(imageFile) {
        console.log('이미지에서 WiFi 정보 추출 시작:', imageFile.name);
        
        if (!this.isInitialized) {
            await this.initializeModel();
        }

        try {
            // 1단계: 이미지를 Canvas로 변환하여 텍스트 추출 시뮬레이션
            const extractedText = await this.simulateOCR(imageFile);
            
            // 2단계: LLM으로 WiFi 정보 파싱
            return await this.parseWiFiWithLLM(extractedText);
            
        } catch (error) {
            console.error('WiFi 정보 추출 실패:', error);
            throw error;
        }
    }

    // OCR 시뮬레이션 (실제 환경에서는 Web API나 다른 방법 사용)
    async simulateOCR(imageFile) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                // 실제로는 이미지 처리 라이브러리 필요
                // 현재는 사용자 입력으로 대체
                const userText = prompt(
                    `🖼️ 이미지가 업로드되었습니다.\n\n` +
                    `현재 버전에서는 이미지에서 보이는 WiFi 정보를 직접 입력해주세요:\n\n` +
                    `예시: "WiFi: MyHome_Network, Password: abc123, Security: WPA2"\n\n` +
                    `이미지에서 보이는 WiFi 정보를 입력하세요:`
                );
                
                if (userText) {
                    console.log('사용자 입력 텍스트:', userText);
                    resolve(userText);
                } else {
                    reject(new Error('사용자가 입력을 취소했습니다.'));
                }
            };
            reader.onerror = reject;
            reader.readAsDataURL(imageFile);
        });
    }

    // LLM으로 WiFi 정보 파싱 (단순 버전)
    async parseWiFiWithLLM(extractedText) {
        console.log('단순 WiFi 정보 파싱 시작:', extractedText);
        
        try {
            // 기본적인 정규식 패턴 매칭 사용
            const result = this.parseWiFiWithRegex(extractedText);
            
            console.log('정규식 기반 파싱 결과:', result);
            return result;
            
        } catch (error) {
            console.error('기본 파싱 실패:', error);
            throw new Error(`WiFi 정보 파싱 실패: ${error.message}`);
        }
    }

    // 정규식 기반 WiFi 정보 추출
    parseWiFiWithRegex(text) {
        console.log('정규식 기반 WiFi 파싱:', text);
        
        const result = {
            ssid: '',
            password: '',
            encryption: 'WPA'
        };
        
        // 다양한 SSID 패턴 시도
        const ssidPatterns = [
            /SSID[:\s]+([^\s,;]+)/i,
            /Network[:\s]+([^\s,;]+)/i,
            /WiFi[:\s]+([^\s,;]+)/i,
            /네트워크[:\s]+([^\s,;]+)/i,
            /와이파이[:\s]+([^\s,;]+)/i
        ];
        
        // 비밀번호 패턴
        const passwordPatterns = [
            /Password[:\s]+([^\s,;]+)/i,
            /Pass[:\s]+([^\s,;]+)/i,
            /Key[:\s]+([^\s,;]+)/i,
            /비밀번호[:\s]+([^\s,;]+)/i,
            /패스워드[:\s]+([^\s,;]+)/i
        ];
        
        // 암호화 패턴
        const encryptionPatterns = [
            /Security[:\s]+(WPA|WEP|NONE)/i,
            /Encryption[:\s]+(WPA|WEP|NONE)/i,
            /암호화[:\s]+(WPA|WEP|NONE)/i
        ];
        
        // SSID 추출
        for (const pattern of ssidPatterns) {
            const match = text.match(pattern);
            if (match) {
                result.ssid = match[1].trim();
                break;
            }
        }
        
        // 비밀번호 추출
        for (const pattern of passwordPatterns) {
            const match = text.match(pattern);
            if (match) {
                result.password = match[1].trim();
                break;
            }
        }
        
        // 암호화 추출
        for (const pattern of encryptionPatterns) {
            const match = text.match(pattern);
            if (match) {
                result.encryption = match[1].toUpperCase();
                if (result.encryption === 'NONE') {
                    result.encryption = 'nopass';
                }
                break;
            }
        }
        
        console.log('정규식 파싱 결과:', result);
        
        // 최소한 SSID는 있어야 함
        if (!result.ssid) {
            throw new Error('네트워크 이름(SSID)을 찾을 수 없습니다.');
        }
        
        return result;
    }
    parseWiFiResponse(response) {
        console.log('WiFi 응답 파싱:', response);
        
        if (response.includes('NO_WIFI_INFO')) {
            throw new Error('텍스트에서 WiFi 정보를 찾을 수 없습니다.');
        }

        const result = {
            ssid: '',
            password: '',
            encryption: 'WPA'
        };

        // SSID 추출
        const ssidMatch = response.match(/SSID:\s*(.+)/i);
        if (ssidMatch) {
            result.ssid = ssidMatch[1].trim();
        }

        // PASSWORD 추출
        const passwordMatch = response.match(/PASSWORD:\s*(.+)/i);
        if (passwordMatch) {
            result.password = passwordMatch[1].trim();
        }

        // ENCRYPTION 추출
        const encryptionMatch = response.match(/ENCRYPTION:\s*(WPA|WEP|NONE)/i);
        if (encryptionMatch) {
            result.encryption = encryptionMatch[1].toUpperCase();
            // QR 코드 형식으로 변환
            if (result.encryption === 'NONE') {
                result.encryption = 'nopass';
            }
        }

        console.log('파싱된 WiFi 정보:', result);

        // 최소한 SSID는 있어야 함
        if (!result.ssid) {
            throw new Error('네트워크 이름(SSID)을 찾을 수 없습니다.');
        }

        return result;
    }

    // WiFi QR 코드 생성
    generateWiFiQR(wifiInfo, targetElementId) {
        console.log('WiFi QR 코드 생성:', wifiInfo);
        
        // WiFi QR 코드 형식: WIFI:S:<SSID>;T:<WPA|WEP|>;P:<password>;;
        let wifiString = `WIFI:S:${wifiInfo.ssid};T:${wifiInfo.encryption};`;
        if (wifiInfo.encryption !== 'nopass' && wifiInfo.password) {
            wifiString += `P:${wifiInfo.password};`;
        }
        wifiString += ';';
        
        console.log('WiFi QR 문자열:', wifiString);
        
        const qrcodeElement = document.getElementById(targetElementId);
        if (!qrcodeElement) {
            throw new Error(`QR 코드 컨테이너를 찾을 수 없습니다: ${targetElementId}`);
        }
        
        qrcodeElement.innerHTML = '';
        
        new QRCode(qrcodeElement, {
            text: wifiString,
            width: 200,
            height: 200,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });
        
        return wifiString;
    }

    // WebGPU 지원 확인
    async checkWebGPUSupport() {
        if (!navigator.gpu) {
            throw new Error('이 브라우저는 WebGPU를 지원하지 않습니다. Chrome 등의 최신 브라우저를 사용해주세요.');
        }
        
        try {
            const adapter = await navigator.gpu.requestAdapter();
            if (!adapter) {
                throw new Error('WebGPU 어댑터를 찾을 수 없습니다.');
            }
            
            const device = await adapter.requestDevice();
            console.log('WebGPU 지원 확인됨:', device);
            return true;
        } catch (error) {
            throw new Error(`WebGPU 초기화 실패: ${error.message}`);
        }
    }

    // 정리
    cleanup() {
        if (this.llmInference) {
            // MediaPipe LLM Inference는 자동으로 정리됨
            this.llmInference = null;
        }
        this.isInitialized = false;
        console.log('OCR-WiFi 시스템 정리 완료');
    }
}

// 전역 OCR-WiFi 인스턴스
window.ocrWiFiGenerator = new OCRWiFiGenerator();

// export default OCRWiFiGenerator;