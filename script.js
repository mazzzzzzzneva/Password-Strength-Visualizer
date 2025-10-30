class PasswordAnalyzer {
    constructor() {
        this.passwordInput = document.getElementById('passwordInput');
        this.hackingAnimation = document.getElementById('hackingAnimation');
        this.matrixCode = document.getElementById('matrixCode');
        this.results = document.getElementById('results');
        this.strengthFill = document.getElementById('strengthFill');
        this.strengthText = document.getElementById('strengthText');
        this.timeDisplay = document.getElementById('timeDisplay');
        this.crackMethod = document.getElementById('crackMethod');
        this.vulnerabilitiesList = document.getElementById('vulnerabilitiesList');
        this.statusMessage = document.getElementById('statusMessage');
        this.hackingProgress = document.getElementById('hackingProgress');
        this.hackingProgressBar = document.getElementById('hackingProgressBar');

        this.commonPasswords = new Set([
            '123456', 'password', '12345678', 'qwerty', '123456789',
            '12345', '1234', '111111', '1234567', 'dragon',
            '123123', 'baseball', 'abc123', 'football', 'monkey',
            'letmein', 'shadow', 'master', '666666', 'qwertyuiop'
        ]);

        this.init();
    }

    init() {
        this.passwordInput.addEventListener('input', (e) => {
            this.analyzePassword(e.target.value);
        });

        this.startMatrixAnimation();
    }

    analyzePassword(password) {
        if (password.length === 0) {
            this.hideResults();
            return;
        }

        this.showHackingAnimation();
        this.simulateHackingProcess(password);
    }

    showHackingAnimation() {
        this.hackingAnimation.style.display = 'block';
        this.hackingProgress.style.display = 'block';
        this.statusMessage.textContent = 'СКАНИРОВАНИЕ УЯЗВИМОСТЕЙ...';
        this.statusMessage.classList.add('glitch');
    }

    simulateHackingProcess(password) {
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 10;
            this.hackingProgressBar.style.width = Math.min(progress, 100) + '%';
            
            if (progress >= 100) {
                clearInterval(interval);
                this.completeAnalysis(password);
            }
        }, 100);
    }

    completeAnalysis(password) {
        this.hackingAnimation.style.display = 'none';
        this.hackingProgress.style.display = 'none';
        this.results.style.display = 'block';
        this.statusMessage.classList.remove('glitch');
        this.statusMessage.textContent = 'АНАЛИЗ ЗАВЕРШЕН';

        const strength = this.calculateStrength(password);
        this.displayStrength(strength);
        this.displayTimeToCrack(password, strength);
        this.displayVulnerabilities(password);
    }

    hideResults() {
        this.results.style.display = 'none';
        this.hackingAnimation.style.display = 'none';
        this.hackingProgress.style.display = 'none';
        this.statusMessage.classList.remove('glitch');
        this.statusMessage.textContent = 'СИСТЕМА ГОТОВА К АНАЛИЗУ';
        this.hackingProgressBar.style.width = '0%';
    }

    calculateStrength(password) {
        let score = 0;
        
        // Длина пароля
        if (password.length >= 8) score += 25;
        if (password.length >= 12) score += 15;
        
        // Разнообразие символов
        if (/[a-z]/.test(password)) score += 10;
        if (/[A-Z]/.test(password)) score += 15;
        if (/[0-9]/.test(password)) score += 15;
        if (/[^a-zA-Z0-9]/.test(password)) score += 20;
        
        // Штрафы за паттерны
        if (/(.)\1{2,}/.test(password)) score -= 10; // повторяющиеся символы
        if (/123|abc|qwerty/i.test(password)) score -= 15; // последовательности
        
        return Math.max(0, Math.min(100, score));
    }

    displayStrength(strength) {
        this.strengthFill.style.width = strength + '%';
        
        let strengthLevel, color;
        if (strength >= 80) {
            strengthLevel = 'ОТЛИЧНО';
            color = '#00ff00';
        } else if (strength >= 60) {
            strengthLevel = 'ХОРОШО';
            color = '#00ff88';
        } else if (strength >= 40) {
            strengthLevel = 'СРЕДНЕ';
            color = '#ff9900';
        } else {
            strengthLevel = 'СЛАБО';
            color = '#ff0000';
        }
        
        this.strengthText.textContent = `ОЦЕНКА: ${strengthLevel} (${strength}%)`;
        this.strengthText.style.color = color;
    }

    displayTimeToCrack(password, strength) {
        // Упрощенный расчет времени взлома
        const entropy = this.calculateEntropy(password);
        let timeSeconds = Math.pow(2, entropy) / 1000000000; // 1 млрд попыток в секунду
        
        const times = [
            { value: timeSeconds / 31536000, unit: 'лет' },
            { value: timeSeconds / 2592000, unit: 'месяцев' },
            { value: timeSeconds / 86400, unit: 'дней' },
            { value: timeSeconds / 3600, unit: 'часов' },
            { value: timeSeconds / 60, unit: 'минут' },
            { value: timeSeconds, unit: 'секунд' }
        ];
        
        const time = times.find(t => t.value >= 1) || times[times.length - 1];
        
        this.timeDisplay.textContent = `~${Math.ceil(time.value)} ${time.unit}`;
        this.timeDisplay.style.color = strength >= 60 ? '#00ff88' : '#ff0000';
        
        // Определение метода взлома
        if (password.length <= 6) {
            this.crackMethod.textContent = 'МЕТОД: ПРОСТОЙ ПЕРЕБОР';
        } else if (this.commonPasswords.has(password.toLowerCase())) {
            this.crackMethod.textContent = 'МЕТОД: СЛОВАРНАЯ АТАКА';
        } else {
            this.crackMethod.textContent = 'МЕТОД: ГИБРИДНАЯ АТАКА';
        }
    }

    calculateEntropy(password) {
        let charset = 0;
        if (/[a-z]/.test(password)) charset += 26;
        if (/[A-Z]/.test(password)) charset += 26;
        if (/[0-9]/.test(password)) charset += 10;
        if (/[^a-zA-Z0-9]/.test(password)) charset += 32;
        
        return Math.log2(Math.pow(charset, password.length));
    }

    displayVulnerabilities(password) {
        this.vulnerabilitiesList.innerHTML = '';
        const vulnerabilities = [];
        
        if (password.length < 8) {
            vulnerabilities.push('СЛИШКОМ КОРОТКИЙ ПАРОЛЬ (< 8 СИМВОЛОВ)');
        }
        
        if (this.commonPasswords.has(password.toLowerCase())) {
            vulnerabilities.push('ПАРОЛЬ В ОБЩЕМ СЛОВАРЕ');
        }
        
        if (!/[a-z]/.test(password) || !/[A-Z]/.test(password)) {
            vulnerabilities.push('ОТСУТСТВУЮТ ЗАГЛАВНЫЕ/СТРОЧНЫЕ БУКВЫ');
        }
        
        if (!/[0-9]/.test(password)) {
            vulnerabilities.push('ОТСУТСТВУЮТ ЦИФРЫ');
        }
        
        if (!/[^a-zA-Z0-9]/.test(password)) {
            vulnerabilities.push('ОТСУТСТВУЮТ СПЕЦИАЛЬНЫЕ СИМВОЛЫ');
        }
        
        if (/(.)\1{2,}/.test(password)) {
            vulnerabilities.push('ПОВТОРЯЮЩИЕСЯ СИМВОЛЫ');
        }
        
        if (vulnerabilities.length === 0) {
            const safeItem = document.createElement('div');
            safeItem.className = 'vulnerability-item safe';
            safeItem.textContent = '✓ КРИТИЧЕСКИХ УЯЗВИМОСТЕЙ НЕ ОБНАРУЖЕНО';
            this.vulnerabilitiesList.appendChild(safeItem);
        } else {
            vulnerabilities.forEach(vuln => {
                const item = document.createElement('div');
                item.className = 'vulnerability-item';
                item.textContent = `✗ ${vuln}`;
                this.vulnerabilitiesList.appendChild(item);
            });
        }
    }

    startMatrixAnimation() {
        const chars = '01アイウエオカキクケコサシスセソタチツテト';
        const width = Math.floor(this.matrixCode.offsetWidth / 14);
        const height = Math.floor(this.matrixCode.offsetHeight / 14);
        
        setInterval(() => {
            let code = '';
            for (let i = 0; i < height; i++) {
                let line = '';
                for (let j = 0; j < width; j++) {
                    line += chars[Math.floor(Math.random() * chars.length)];
                }
                code += line + '<br>';
            }
            this.matrixCode.innerHTML = code;
        }, 100);
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    new PasswordAnalyzer();
});