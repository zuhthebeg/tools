// QrScanner 안전한 초기화
let QrScanner = null;
async function initQrScanner() {
    try {
        if (window.QrScanner) {
            QrScanner = window.QrScanner;
        } else {
            // QrScanner 동적 로드
            const module = await import('https://unpkg.com/qr-scanner@1.4.2/qr-scanner.min.js');
            QrScanner = module.default;
        }
        
        if (QrScanner) {
            console.log('QrScanner 로드 성공');
            setQrScannerWorkerPath(); // 워커 패스 설정
            return true;
        }
    } catch (error) {
        console.error('QrScanner 로드 실패:', error);
    }
    return false;
}

// Global variables
let qrScanner = null;
let scannerActive = false;
let lastResult = '';

// QrScanner 워커 패스 설정 (로드 후에)
function setQrScannerWorkerPath() {
    if (QrScanner && QrScanner.WORKER_PATH !== undefined) {
        QrScanner.WORKER_PATH = 'https://unpkg.com/qr-scanner@1.4.2/qr-scanner-worker.min.js';
        console.log('QrScanner 워커 패스 설정 완료');
    }
}

// Theme management
function toggleTheme() {
    console.log('테마 토글 클릭');
    const body = document.body;
    const themeIcon = document.getElementById('themeIcon');
    
    if (body.classList.contains('dark')) {
        body.classList.remove('dark');
        themeIcon.textContent = '🌙';
        localStorage.setItem('theme', 'light');
        console.log('라이트 모드로 변경');
    } else {
        body.classList.add('dark');
        themeIcon.textContent = '🌞';
        localStorage.setItem('theme', 'dark');
        console.log('다크 모드로 변경');
    }
}

// Load saved theme
function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    const body = document.body;
    const themeIcon = document.getElementById('themeIcon');
    
    console.log('저장된 테마 로드:', savedTheme);
    
    if (savedTheme === 'light') {
        body.classList.remove('dark');
        themeIcon.textContent = '🌙';
    } else {
        body.classList.add('dark');
        themeIcon.textContent = '🌞';
    }
}

// Tab management
function initTabs() {
    console.log('탭 시스템 초기화');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            console.log('탭 클릭:', btn.dataset.tab);
            const targetTab = btn.dataset.tab;
            
            // Remove active from all tabs and contents
            tabBtns.forEach(b => {
                b.classList.remove('active', 'border-primary', 'text-primary');
                b.classList.add('border-transparent');
            });
            tabContents.forEach(content => {
                content.classList.remove('active');
                content.classList.add('hidden');
            });
            
            // Add active to clicked tab
            btn.classList.add('active', 'border-primary', 'text-primary');
            btn.classList.remove('border-transparent');
            
            // Show target content
            const targetContent = document.getElementById(`${targetTab}-tab`);
            if (targetContent) {
                targetContent.classList.remove('hidden');
                targetContent.classList.add('active');
            }
        });
    });
}

// Update status indicator
function updateStatus(status, message) {
    console.log('상태 업데이트:', status, message);
    const indicator = document.getElementById('statusIndicator');
    
    // Reset classes
    indicator.className = 'px-4 py-2 rounded-full text-sm font-medium';
    
    // Add status-specific classes
    switch(status) {
        case 'ready':
            indicator.classList.add('bg-green-100', 'text-green-800', 'dark:bg-green-900', 'dark:text-green-200');
            break;
        case 'scanning':
            indicator.classList.add('bg-yellow-100', 'text-yellow-800', 'dark:bg-yellow-900', 'dark:text-yellow-200');
            break;
        case 'error':
            indicator.classList.add('bg-red-100', 'text-red-800', 'dark:bg-red-900', 'dark:text-red-200');
            break;
    }
    
    indicator.textContent = message;
}

// Initialize cameras
async function initializeCameras() {
    try {
        console.log('카메라 초기화 시작');
        
        // QrScanner 로드 확인
        const qrScannerLoaded = await initQrScanner();
        if (!qrScannerLoaded) {
            console.error('카메라 초기화 실패: QrScanner 로드 실패');
            updateStatus('error', 'QR 스캐너 로드 실패');
            return;
        }
        
        const cameras = await QrScanner.listCameras(true);
        const cameraSelect = document.getElementById('cameraSelect');
        
        cameraSelect.innerHTML = '<option value="">카메라 선택</option>';
        
        if (cameras.length === 0) {
            cameraSelect.innerHTML = '<option value="">카메라를 찾을 수 없습니다</option>';
            updateStatus('error', '카메라 없음');
            return;
        }
        
        cameras.forEach((camera, index) => {
            const option = document.createElement('option');
            option.value = camera.id;
            option.textContent = camera.label || `카메라 ${index + 1}`;
            cameraSelect.appendChild(option);
        });
        
        // 후면 카메라 우선 선택
        const backCamera = cameras.find(camera => 
            camera.label.toLowerCase().includes('back') ||
            camera.label.toLowerCase().includes('rear') ||
            camera.label.toLowerCase().includes('environment')
        );
        
        if (backCamera) {
            cameraSelect.value = backCamera.id;
        } else if (cameras.length > 0) {
            cameraSelect.value = cameras[0].id;
        }
        
        console.log('카메라 초기화 완료:', cameras.length, '개 발견');
        updateStatus('ready', '준비됨');
        
    } catch (error) {
        console.error('카메라 초기화 오류:', error);
        updateStatus('error', '카메라 오류');
    }
}

// Generate QR code
function generateQR() {
    console.log('QR 코드 생성 시작');
    const qrText = document.getElementById("qrText").value.trim();
    if (!qrText) {
        alert('텍스트 또는 URL을 입력해주세요!');
        return;
    }

    const qrcodeElement = document.getElementById("qrcode");
    qrcodeElement.innerHTML = "";

    new QRCode(qrcodeElement, {
        text: qrText,
        width: 200,
        height: 200,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });

    const downloadBtn = document.getElementById('downloadBtn');
    downloadBtn.style.display = 'inline-block';
    downloadBtn.onclick = () => {
        console.log('다운로드 버튼 클릭');
        const canvas = qrcodeElement.querySelector('canvas');
        if (canvas) {
            const link = document.createElement('a');
            link.download = 'qrcode.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
            console.log('QR 코드 다운로드 완료');
        } else {
            console.error('Canvas 요소를 찾을 수 없습니다');
        }
    };
    
    console.log('QR 코드 생성 완료');
}

// Generate WiFi QR code
function generateWifiQR() {
    console.log('WiFi QR 코드 생성 시작');
    const ssid = document.getElementById('ssid').value.trim();
    const password = document.getElementById('password').value.trim();
    const encryption = document.getElementById('encryption').value;
    
    if (!ssid) {
        alert('네트워크 이름을 입력해주세요!');
        return;
    }
    
    if (encryption !== 'nopass' && !password) {
        alert('비밀번호를 입력해주세요!');
        return;
    }
    
    // WiFi QR 코드 형식: WIFI:S:<SSID>;T:<WPA|WEP|>;P:<password>;;
    let wifiString = `WIFI:S:${ssid};T:${encryption};`;
    if (encryption !== 'nopass') {
        wifiString += `P:${password};`;
    }
    wifiString += ';';
    
    console.log('WiFi QR 문자열:', wifiString);
    
    const wifiQrcodeElement = document.getElementById('wifiQrcode');
    wifiQrcodeElement.innerHTML = '';
    
    new QRCode(wifiQrcodeElement, {
        text: wifiString,
        width: 200,
        height: 200,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });
    
    const wifiDownloadBtn = document.getElementById('wifiDownloadBtn');
    wifiDownloadBtn.style.display = 'inline-block';
    wifiDownloadBtn.onclick = () => {
        console.log('WiFi QR 다운로드 버튼 클릭');
        const canvas = wifiQrcodeElement.querySelector('canvas');
        if (canvas) {
            const link = document.createElement('a');
            link.download = 'wifi-qrcode.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
            console.log('WiFi QR 코드 다운로드 완료');
        }
    };
    
    console.log('WiFi QR 코드 생성 완료');
}

// WiFi QR 코드 파싱 함수
function parseWifiQR(qrString) {
    try {
        console.log('WiFi QR 파싱 시작:', qrString);
        // WIFI:S:<SSID>;T:<WPA|WEP|>;P:<password>;;
        const params = {};
        const parts = qrString.substring(5).split(';');
        
        parts.forEach(part => {
            if (part.startsWith('S:')) {
                params.ssid = part.substring(2);
            } else if (part.startsWith('T:')) {
                params.encryption = part.substring(2);
            } else if (part.startsWith('P:')) {
                params.password = part.substring(2);
            }
        });
        
        if (!params.ssid) return null;
        
        const result = {
            ssid: params.ssid,
            encryption: params.encryption || 'WPA',
            password: params.password || ''
        };
        
        console.log('WiFi QR 파싱 결과:', result);
        return result;
    } catch (error) {
        console.error('WiFi QR 파싱 오류:', error);
        return null;
    }
}

// 모바일 WiFi 연결 처리
function handleWifiConnection(wifiParams) {
    console.log('WiFi 연결 처리 시작:', wifiParams);
    
    // 모바일 기기 확인
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        console.log('모바일 기기에서 WiFi 설정으로 이동');
        
        if (/Android/i.test(navigator.userAgent)) {
            // Android - WiFi 설정 화면으로 이동
            try {
                // Android WiFi 설정으로 이동
                window.open('android-app://com.android.settings/.wifi.WifiSettings', '_self');
                console.log('Android WiFi 설정 화면으로 이동 시도');
            } catch (error) {
                try {
                    // 대체 방법: 일반 설정 인텐트
                    window.location.href = 'android.settings.WIFI_SETTINGS';
                    console.log('Android 설정 인텐트 시도');
                } catch (e) {
                    console.log('Android 설정 열기 실패, 수동 안내');
                }
            }
        } else if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
            // iOS - 설정 앱으로 이동
            try {
                window.location.href = 'App-Prefs:root=WIFI';
                console.log('iOS WiFi 설정으로 이동 시도');
            } catch (error) {
                console.log('iOS WiFi 설정 열기 실패');
            }
        }
    }
}

// WiFi QR 코드 전용 처리 함수
function handleWifiQRResult(wifiParams, resultText) {
    console.log('WiFi QR 코드 전용 처리:', wifiParams);
    
    // 모바일 기기 확인
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        // 모바일에서는 카메라 앱 사용 권장 알림
        const shouldOpenCamera = confirm(
            `📶 WiFi QR 코드가 감지되었습니다!\n\n` +
            `네트워크: ${wifiParams.ssid}\n` +
            `암호화: ${wifiParams.encryption}\n` +
            `비밀번호: ${wifiParams.password || '없음'}\n\n` +
            `더 쉬운 연결을 위해 카메라 앱으로 이 QR코드를 다시 스캔하시겠습니까?\n` +
            `(카메라 앱에서 WiFi 자동 연결이 지원됩니다)`
        );
        
        if (shouldOpenCamera) {
            // 카메라 앱 열기 시도
            try {
                if (/Android/i.test(navigator.userAgent)) {
                    // Android 카메라 앱 열기
                    window.location.href = 'android.media.action.IMAGE_CAPTURE';
                } else if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
                    // iOS 카메라 앱 열기 (일반적인 방법은 제한적)
                    alert('📷 iOS에서는 카메라 앱을 수동으로 열어서 QR코드를 스캔해주세요.');
                }
            } catch (error) {
                console.log('카메라 앱 열기 실패:', error);
                alert('📷 카메라 앱을 수동으로 열어서 QR코드를 다시 스캔해주세요.');
            }
            return; // 여기서 종료
        }
    }
    
    // 데스크톱이거나 사용자가 거부한 경우 기존 방식으로 표시
    document.getElementById('resultText').innerHTML = `
        <div class="space-y-2">
            <p><strong>📶 WiFi 네트워크 정보</strong></p>
            <p><strong>네트워크 이름:</strong> ${wifiParams.ssid}</p>
            <p><strong>암호화 방식:</strong> ${wifiParams.encryption}</p>
            <p><strong>비밀번호:</strong> ${wifiParams.password || '없음'}</p>
            ${getMobileWifiInstructions()}
        </div>
    `;
    document.getElementById('scanResult').classList.remove('hidden');
    document.getElementById('openBtn').style.display = 'none';
}
function getMobileWifiInstructions() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (!isMobile) return '';
    
    if (/Android/i.test(navigator.userAgent)) {
        return `
            <div class="mt-3 p-3 bg-blue-50 dark:bg-blue-900 rounded-lg">
                <p class="text-sm text-blue-800 dark:text-blue-200">
                    📱 <strong>Android 연결 방법:</strong><br>
                    1. WiFi 설정으로 자동 이동을 시도합니다<br>
                    2. 또는 카메라 앱으로 QR코드를 스캔하세요<br>
                    3. 수동: 설정 → 네트워크 및 인터넷 → Wi-Fi
                </p>
            </div>
        `;
    } else if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        return `
            <div class="mt-3 p-3 bg-blue-50 dark:bg-blue-900 rounded-lg">
                <p class="text-sm text-blue-800 dark:text-blue-200">
                    📱 <strong>iOS 연결 방법:</strong><br>
                    1. WiFi 설정으로 자동 이동을 시도합니다<br>
                    2. 또는 카메라 앱으로 QR코드를 스캔하세요<br>
                    3. 수동: 설정 → Wi-Fi에서 네트워크를 찾아 연결하세요
                </p>
            </div>
        `;
    }
    
    return '';
}

// Handle QR scan result
function handleScanResult(result) {
    console.log('QR 스캔 결과:', result);
    
    // result가 객체인 경우 data 속성을 사용
    const resultText = typeof result === 'object' ? result.data : result;
    lastResult = resultText;
    
    // 스캔 성공 시 즉시 스캐너 중지 (한 번만 인식)
    stopScanner();
    
    // WiFi QR 코드인지 확인
    if (resultText.startsWith('WIFI:')) {
        const wifiParams = parseWifiQR(resultText);
        if (wifiParams) {
            // 모바일에서 WiFi 연결 처리
            handleWifiConnection(wifiParams);
            
            // 결과 표시
            document.getElementById('resultText').innerHTML = `
                <div class="space-y-2">
                    <p><strong>📶 WiFi 네트워크 정보</strong></p>
                    <p><strong>네트워크 이름:</strong> ${wifiParams.ssid}</p>
                    <p><strong>암호화 방식:</strong> ${wifiParams.encryption}</p>
                    <p><strong>비밀번호:</strong> ${wifiParams.password || '없음'}</p>
                    ${getMobileWifiInstructions()}
                </div>
            `;
            document.getElementById('scanResult').classList.remove('hidden');
            document.getElementById('openBtn').style.display = 'none';
        }
    } else {
        // 일반 QR 코드 처리
        document.getElementById('resultText').textContent = resultText;
        document.getElementById('scanResult').classList.remove('hidden');
        
        // URL인지 확인
        try {
            new URL(resultText);
            document.getElementById('openBtn').style.display = 'inline-block';
        } catch {
            document.getElementById('openBtn').style.display = 'none';
        }
    }
    
    // 진동 피드백 (지원되는 경우)
    if ('vibrate' in navigator) {
        navigator.vibrate(200);
    }
    
    updateStatus('ready', '스캔 완료');
}

// Toggle scanner
async function toggleScanner() {
    console.log('스캐너 토글 시작');
    const videoContainer = document.getElementById('video-container');
    const scanPlaceholder = document.getElementById('scan-placeholder');
    const video = document.getElementById('qr-video');
    const scanBtn = document.getElementById('scanBtn');
    const stopBtn = document.getElementById('stopBtn');
    const cameraSelect = document.getElementById('cameraSelect');
    
    if (scannerActive) {
        console.log('이미 스캐너가 활성화됨');
        return;
    }
    
    const selectedCamera = cameraSelect.value;
    if (!selectedCamera) {
        alert('카메라를 선택해주세요!');
        return;
    }
    
    try {
        updateStatus('scanning', '카메라 시작 중...');
        
        // Hide placeholder, show video
        scanPlaceholder.classList.add('hidden');
        videoContainer.classList.remove('hidden');
        
        // Create QR scanner
        qrScanner = new QrScanner(video, result => {
            console.log('QR 스캐너에서 결과 받음:', result);
            handleScanResult(result);
        }, {
            returnDetailedScanResult: false,
            highlightScanRegion: true,
            highlightCodeOutline: true,
            preferredCamera: selectedCamera,
            maxScansPerSecond: 5
        });
        
        // Start scanner
        await qrScanner.start();
        
        scannerActive = true;
        scanBtn.style.display = 'none';
        stopBtn.style.display = 'block';
        
        updateStatus('scanning', '스캐닝 중...');
        console.log('QR 스캐너 시작됨');
        
    } catch (error) {
        console.error('카메라 시작 오류:', error);
        
        let errorMessage = '카메라를 시작할 수 없습니다.';
        if (error.name === 'NotAllowedError') {
            errorMessage = '카메라 접근 권한이 필요합니다. 브라우저 설정에서 카메라 권한을 허용해주세요.';
        } else if (error.name === 'NotFoundError') {
            errorMessage = '카메라를 찾을 수 없습니다. 카메라가 연결되어 있는지 확인해주세요.';
        } else if (error.name === 'NotReadableError') {
            errorMessage = '카메라에 접근할 수 없습니다. 다른 앱에서 카메라를 사용 중일 수 있습니다.';
        }
        
        alert(errorMessage);
        updateStatus('error', '카메라 오류');
        
        // Reset UI
        videoContainer.classList.add('hidden');
        scanPlaceholder.classList.remove('hidden');
    }
}

// Stop scanner
function stopScanner() {
    console.log('스캐너 중지 시작');
    if (qrScanner) {
        qrScanner.stop();
        qrScanner.destroy();
        qrScanner = null;
        console.log('QR 스캐너 정리됨');
    }
    
    scannerActive = false;
    
    // Reset UI
    document.getElementById('video-container').classList.add('hidden');
    document.getElementById('scan-placeholder').classList.remove('hidden');
    document.getElementById('scanBtn').style.display = 'block';
    document.getElementById('stopBtn').style.display = 'none';
    
    updateStatus('ready', '준비됨');
    console.log('QR 스캐너 중지됨');
}

// Copy result to clipboard
function copyResult() {
    console.log('결과 복사 시작:', lastResult);
    if (!lastResult) return;
    
    navigator.clipboard.writeText(lastResult).then(() => {
        console.log('클립보드 복사 성공');
        // 간단한 토스트 메시지 표시
        const resultDiv = document.getElementById('scanResult');
        const originalBg = resultDiv.className;
        resultDiv.className = resultDiv.className.replace('bg-blue-50', 'bg-green-50');
        resultDiv.className = resultDiv.className.replace('dark:bg-blue-900', 'dark:bg-green-900');
        
        setTimeout(() => {
            resultDiv.className = originalBg;
        }, 1000);
    }).catch(err => {
        console.error('클립보드 복사 오류:', err);
        alert('클립보드 복사에 실패했습니다.');
    });
}

// Open result URL
function openResult() {
    console.log('결과 URL 열기:', lastResult);
    if (!lastResult) return;
    
    try {
        new URL(lastResult);
        window.open(lastResult, '_blank');
        console.log('URL 열기 성공');
    } catch {
        alert('유효한 URL이 아닙니다.');
    }
}

// Scan from uploaded image
async function scanFromImage() {
    const fileInput = document.getElementById('qrImageUpload');
    const file = fileInput.files[0];
    
    if (!file) return;
    
    try {
        updateStatus('scanning', '이미지 분석 중...');
        console.log('이미지에서 QR 코드 스캔 시작:', file.name);
        
        const result = await QrScanner.scanImage(file);
        handleScanResult(result);
        
    } catch (error) {
        console.error('이미지 스캔 오류:', error);
        updateStatus('error', 'QR 코드를 찾을 수 없음');
        alert('이미지에서 QR 코드를 찾을 수 없습니다. 명확하고 선명한 QR 코드 이미지를 사용해주세요.');
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    console.log('QR Tool 초기화 시작');
    
    // Load theme
    loadTheme();
    
    // Initialize tabs
    initTabs();
    
    // Initialize WiFi sub-tabs
    initWiFiTabs();
    
    // Initialize cameras
    await initializeCameras();
    
    // Add event listeners
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    document.getElementById('qrImageUpload').addEventListener('change', scanFromImage);
    
    // Initialize i18n
    try {
        if (window.initializeLocalization) {
            await window.initializeLocalization();
            console.log('다국어 시스템 초기화 성공');
        }
    } catch (error) {
        console.error('다국어 시스템 초기화 오류:', error);
    }
    
    console.log('QR Tool 초기화 완료');
});

// WiFi 탭 관리
function initWiFiTabs() {
    console.log('WiFi 탭 시스템 초기화');
    const wifiTabBtns = document.querySelectorAll('.wifi-tab-btn');
    const wifiTabContents = document.querySelectorAll('.wifi-tab-content');
    
    wifiTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            console.log('WiFi 탭 클릭:', btn.dataset.wifiTab);
            const targetTab = btn.dataset.wifiTab;
            
            // Remove active from all tabs and contents
            wifiTabBtns.forEach(b => {
                b.classList.remove('active', 'border-primary', 'text-primary');
                b.classList.add('border-transparent');
            });
            wifiTabContents.forEach(content => {
                content.classList.remove('active');
            });
            
            // Add active to clicked tab
            btn.classList.add('active', 'border-primary', 'text-primary');
            btn.classList.remove('border-transparent');
            
            // Show target content
            const targetContent = document.getElementById(`${targetTab}-wifi`);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
}

// 이미지에서 WiFi 정보 추출
let extractedWifiData = null;

async function extractWiFiFromImage() {
    console.log('이미지에서 WiFi 정보 추출 시작');
    
    const fileInput = document.getElementById('wifiImageUpload');
    const file = fileInput.files[0];
    
    if (!file) {
        alert('먼저 이미지를 선택해주세요!');
        return;
    }
    
    try {
        // OCR-WiFi 시스템 초기화 및 정보 추출
        const wifiInfo = await window.ocrWiFiGenerator.extractWiFiFromImage(file);
        
        console.log('추출된 WiFi 정보:', wifiInfo);
        extractedWifiData = wifiInfo;
        
        // 추출된 정보 표시
        const infoDiv = document.getElementById('extractedWifiInfo');
        const detailsDiv = document.getElementById('extractedWifiDetails');
        
        detailsDiv.innerHTML = `
            <p><strong>네트워크 이름:</strong> ${wifiInfo.ssid}</p>
            <p><strong>비밀번호:</strong> ${wifiInfo.password || '없음'}</p>
            <p><strong>암호화 방식:</strong> ${wifiInfo.encryption}</p>
        `;
        
        infoDiv.classList.remove('hidden');
        
        // 성공 메시지
        alert('✅ WiFi 정보가 성공적으로 추출되었습니다!');
        
    } catch (error) {
        console.error('WiFi 정보 추출 실패:', error);
        alert('❌ WiFi 정보 추출에 실패했습니다: ' + error.message);
        
        // 오류 시 추출된 정보 숨기기
        document.getElementById('extractedWifiInfo').classList.add('hidden');
    }
}

// 추출된 정보로 QR 생성
function generateFromExtracted() {
    if (!extractedWifiData) {
        alert('추출된 WiFi 정보가 없습니다.');
        return;
    }
    
    console.log('추출된 정보로 QR 생성:', extractedWifiData);
    
    try {
        // OCR-WiFi 시스템으로 QR 생성
        window.ocrWiFiGenerator.generateWiFiQR(extractedWifiData, 'wifiQrcode');
        
        // 다운로드 버튼 활성화
        const wifiDownloadBtn = document.getElementById('wifiDownloadBtn');
        wifiDownloadBtn.style.display = 'inline-block';
        wifiDownloadBtn.onclick = () => {
            console.log('WiFi QR 다운로드 버튼 클릭');
            const canvas = document.querySelector('#wifiQrcode canvas');
            if (canvas) {
                const link = document.createElement('a');
                link.download = `wifi-${extractedWifiData.ssid}-qrcode.png`;
                link.href = canvas.toDataURL('image/png');
                link.click();
                console.log('WiFi QR 코드 다운로드 완료');
            }
        };
        
        console.log('추출된 정보로 QR 생성 완료');
        
    } catch (error) {
        console.error('QR 생성 실패:', error);
        alert('QR 코드 생성에 실패했습니다: ' + error.message);
    }
}

// Make functions globally available
window.generateQR = generateQR;
window.generateWifiQR = generateWifiQR;
window.toggleScanner = toggleScanner;
window.stopScanner = stopScanner;
window.copyResult = copyResult;
window.openResult = openResult;
window.extractWiFiFromImage = extractWiFiFromImage;
window.generateFromExtracted = generateFromExtracted;