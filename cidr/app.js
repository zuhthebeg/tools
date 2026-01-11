// CIDR 계산기 로직
class CIDRCalculator {
    constructor(cidr) {
        const [ip, prefix] = cidr.split('/');
        this.ip = ip;
        this.prefix = parseInt(prefix);

        if (!this.validateIP(ip) || !this.validatePrefix(this.prefix)) {
            throw new Error('잘못된 CIDR 형식입니다');
        }

        this.ipInt = this.ipToInt(ip);
        this.calculate();
    }

    validateIP(ip) {
        const octets = ip.split('.');
        if (octets.length !== 4) return false;

        return octets.every(octet => {
            const num = parseInt(octet);
            return num >= 0 && num <= 255 && octet === num.toString();
        });
    }

    validatePrefix(prefix) {
        return prefix >= 0 && prefix <= 32;
    }

    ipToInt(ip) {
        return ip.split('.')
            .reduce((int, octet) => (int << 8) + parseInt(octet), 0) >>> 0;
    }

    intToIP(int) {
        return [
            (int >>> 24) & 0xFF,
            (int >>> 16) & 0xFF,
            (int >>> 8) & 0xFF,
            int & 0xFF
        ].join('.');
    }

    ipToBinary(ip) {
        return ip.split('.')
            .map(octet => parseInt(octet).toString(2).padStart(8, '0'))
            .join('.');
    }

    getIPClass(firstOctet) {
        if (firstOctet >= 1 && firstOctet <= 126) return 'A';
        if (firstOctet >= 128 && firstOctet <= 191) return 'B';
        if (firstOctet >= 192 && firstOctet <= 223) return 'C';
        if (firstOctet >= 224 && firstOctet <= 239) return 'D (멀티캐스트)';
        if (firstOctet >= 240 && firstOctet <= 255) return 'E (예약됨)';
        return '알 수 없음';
    }

    calculate() {
        // 서브넷 마스크 계산
        this.subnetMaskInt = (0xFFFFFFFF << (32 - this.prefix)) >>> 0;
        this.subnetMask = this.intToIP(this.subnetMaskInt);

        // 와일드카드 마스크
        this.wildcardMaskInt = ~this.subnetMaskInt >>> 0;
        this.wildcardMask = this.intToIP(this.wildcardMaskInt);

        // 네트워크 주소
        this.networkInt = (this.ipInt & this.subnetMaskInt) >>> 0;
        this.networkAddress = this.intToIP(this.networkInt);

        // 브로드캐스트 주소
        this.broadcastInt = (this.networkInt | this.wildcardMaskInt) >>> 0;
        this.broadcastAddress = this.intToIP(this.broadcastInt);

        // 사용 가능한 첫 IP
        this.firstHostInt = this.networkInt + 1;
        this.firstHost = this.intToIP(this.firstHostInt);

        // 사용 가능한 마지막 IP
        this.lastHostInt = this.broadcastInt - 1;
        this.lastHost = this.intToIP(this.lastHostInt);

        // 호스트 수
        this.totalHosts = Math.pow(2, 32 - this.prefix);
        this.usableHosts = this.totalHosts - 2;

        // IP 클래스
        const firstOctet = parseInt(this.ip.split('.')[0]);
        this.ipClass = this.getIPClass(firstOctet);

        // 이진 표기
        this.ipBinary = this.ipToBinary(this.ip);
        this.maskBinary = this.ipToBinary(this.subnetMask);
    }

    getResults() {
        return {
            ip: this.ip,
            prefix: this.prefix,
            subnetMask: this.subnetMask,
            wildcardMask: this.wildcardMask,
            networkAddress: this.networkAddress,
            broadcastAddress: this.broadcastAddress,
            firstHost: this.firstHost,
            lastHost: this.lastHost,
            totalHosts: this.totalHosts.toLocaleString(),
            usableHosts: this.usableHosts.toLocaleString(),
            ipClass: this.ipClass,
            ipBinary: this.ipBinary,
            maskBinary: this.maskBinary
        };
    }
}

// UI 핸들러
const input = document.getElementById('cidr-input');
const calculateBtn = document.getElementById('calculate-btn');
const result = document.getElementById('result');
const error = document.getElementById('error');

function displayResults(data) {
    document.getElementById('ip-address').textContent = `${data.ip}/${data.prefix}`;
    document.getElementById('subnet-mask').textContent = data.subnetMask;
    document.getElementById('wildcard-mask').textContent = data.wildcardMask;
    document.getElementById('network-address').textContent = data.networkAddress;
    document.getElementById('broadcast-address').textContent = data.broadcastAddress;
    document.getElementById('first-ip').textContent = data.firstHost;
    document.getElementById('last-ip').textContent = data.lastHost;
    document.getElementById('total-hosts').textContent = data.totalHosts;
    document.getElementById('usable-hosts').textContent = data.usableHosts;
    document.getElementById('ip-class').textContent = data.ipClass;
    document.getElementById('ip-binary').textContent = data.ipBinary;
    document.getElementById('mask-binary').textContent = data.maskBinary;

    result.classList.remove('hidden');
    error.classList.add('hidden');
}

function displayError(message) {
    error.textContent = message;
    error.classList.remove('hidden');
    result.classList.add('hidden');
}

function calculate() {
    const cidr = input.value.trim();

    if (!cidr) {
        displayError('CIDR 주소를 입력하세요');
        return;
    }

    try {
        const calculator = new CIDRCalculator(cidr);
        const data = calculator.getResults();
        displayResults(data);
    } catch (err) {
        displayError(err.message);
    }
}

calculateBtn.addEventListener('click', calculate);
input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        calculate();
    }
});

// 초기 예제 자동 계산
input.value = '192.168.1.0/24';
calculate();
