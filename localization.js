// localization.js
let translations = {};
let currentLanguage = '';
let supportedLanguages = ['en', 'ko']; // 기본 지원 언어, 초기화 시 재정의 가능
let defaultLanguage = 'en';      // 기본 언어, 초기화 시 재정의 가능

const LOCAL_STORAGE_KEY = 'preferred_language';

/**
 * 지정된 경로에서 번역 파일을 비동기적으로 로드합니다.
 * @param {string} path - 번역 JSON 파일의 경로.
 */
async function loadTranslations(path) {
    try {
        const response = await fetch(path);
        if (!response.ok) {
            throw new Error(`번역 파일 로드 실패 ${path}: ${response.statusText}`);
        }
        translations = await response.json();
        console.log("번역 로드 완료:", translations);
    } catch (error) {
        console.error("번역 로드 중 오류 발생:", error);
        translations = {}; // 로드 실패 시 빈 객체로 대체
    }
}

/**
 * 브라우저의 기본 언어 설정을 가져옵니다. (예: 'en', 'ko')
 * @returns {string | null} 브라우저 언어 코드 또는 null.
 */
function getBrowserLanguage() {
    const lang = navigator.language || navigator.userLanguage;
    if (lang) {
        return lang.split('-')[0].toLowerCase();
    }
    return null;
}

/**
 * localStorage에 저장된 사용자 선호 언어를 가져옵니다.
 * @returns {string | null} 저장된 언어 코드 또는 null.
 */
function getStoredLanguage() {
    return localStorage.getItem(LOCAL_STORAGE_KEY);
}

/**
 * 사용자 선호 언어를 localStorage에 저장합니다.
 * @param {string} lang - 저장할 언어 코드.
 */
function storeLanguage(lang) {
    localStorage.setItem(LOCAL_STORAGE_KEY, lang);
}

/**
 * HTML 문서의 lang 속성을 현재 언어로 업데이트합니다.
 * @param {string} lang - 설정할 언어 코드.
 */
function updatePageLanguageAttribute(lang) {
    document.documentElement.lang = lang;
}

/**
 * 페이지 내의 data-translate-key 속성을 가진 요소들의 텍스트를 현재 언어로 번역하여 적용합니다.
 */
function applyTranslationsToPage() {
    if (!translations[currentLanguage] && Object.keys(translations).length > 0) {
        console.warn(`현재 언어(${currentLanguage})에 대한 번역이 없습니다. 기본 언어나 키 값으로 대체됩니다.`);
    }

    const elements = document.querySelectorAll('[data-translate-key]');
    elements.forEach(element => {
        const key = element.getAttribute('data-translate-key');
        const translation = translate(key);

        if (!translation) {
            if (element.tagName === 'INPUT' || element.tagName === 'BUTTON') {
                translation = element.value || element.textContent;
            } else {
                translation = element.textContent;
            }
        } else {
            const attributeToTranslate = element.getAttribute('data-translate-attr');
            if (attributeToTranslate) {
                element.setAttribute(attributeToTranslate, translation);
            } else if (element.hasAttribute('data-translate-placeholder') && element.placeholder !== undefined) {
                element.placeholder = translation;
            } else if ((element.tagName === 'INPUT' && (element.type === 'submit' || element.type === 'button')) || element.tagName === 'BUTTON') {
                element.value = translation;
            }
            else {
                element.textContent = translation;
            }
        }
    });

    //for buttons
    const buttonsToTranslate = document.querySelectorAll('button[data-translate-key]');
    buttonsToTranslate.forEach(button => {
        const key = button.getAttribute('data-translate-key');
        if (key && typeof translate === 'function') {
            const translatedText = translate(key);
            if (translatedText && typeof translatedText === 'string') {
                button.textContent = translatedText;
            } else {
                console.warn(`Translation failed or returned invalid result for key "${key}"`); // 디버깅용 경고
            }
        } else if (!key) {
            console.warn('Found a button with data-translate-key attribute but the value is empty:', button);
        } else if (typeof translate !== 'function') {
            console.error('The translate function is not available.');
        }
    });

    updatePageLanguageAttribute(currentLanguage);
    // 언어 변경 시 다른 스크립트에서 후속 작업을 할 수 있도록 커스텀 이벤트를 발생시킵니다.
    document.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: currentLanguage } }));
}

/**
 * 언어 선택기를 초기화하고 이벤트 핸들러를 설정합니다.
 */
function initializeLanguageSelector() {
    const langSelector = document.getElementById('language-selector');
    if (!langSelector) {
        console.warn("언어 선택기를 찾을 수 없습니다. 언어 선택 UI가 생성되지 않았습니다.");
        return;
    }

    const langDisplayNames = {
        'en': 'English',
        'ko': '한국어'
    };

    getSupportedLanguages().forEach(lang => {
        const option = document.createElement('option');
        option.value = lang;
        option.textContent = langDisplayNames[lang] || lang.toUpperCase();
        if (lang === getCurrentLanguage()) {
            option.selected = true;
        }
        langSelector.appendChild(option);
    });

    langSelector.addEventListener('change', (event) => {
        setLanguage(event.target.value);
    });
}

/**
 * 언어 선택기를 포함한 언어 전환 UI를 푸터에 동적으로 생성합니다.
 */
function createLanguageSwitcher() {
    // Check if the language switcher already exists
    if (document.querySelector('.language-switcher')) {
        console.warn("언어 선택기가 이미 생성되었습니다.");
        return;
    }

    // Ensure a footer exists
    let footer = document.querySelector('footer');
    if (!footer) {
        footer = document.createElement('footer');
        footer.style.marginTop = '2rem';
        footer.style.padding = '1.5rem';
        footer.style.textAlign = 'center';
        footer.style.color = 'rgba(255,255,255,0.7)';
        footer.style.fontSize = '0.9rem';
        footer.style.width = '100%';
        footer.style.borderTop = '1px solid #333';
        document.body.appendChild(footer);
    }

    // Add dynamic footer content
    const year = new Date().getFullYear();
    const pageTitle = document.querySelector('title')?.textContent || 'My Page';
    footer.innerHTML = `
        <p style="margin: 0;">
            © ${year} ${pageTitle}. 
            <a href="https://cocy.io" 
               style="color: #7fbfff; text-decoration: none;"
               target="_blank">COCY.IO</a> 
            All rights reserved.
        </p>
    `;

    const switcher = document.createElement('div');
    switcher.className = 'language-switcher';
    switcher.style.display = 'flex';
    switcher.style.alignItems = 'center';
    switcher.style.justifyContent = 'center';
    switcher.style.gap = '10px';
    switcher.style.marginTop = '10px';

    const label = document.createElement('label');
    label.setAttribute('data-translate-key', 'change_language_label');
    label.textContent = 'Language:';

    const select = document.createElement('select');
    select.id = 'language-selector';
    select.style.padding = '5px';
    select.style.borderRadius = '5px';
    select.style.border = '1px solid #ccc';
    select.style.background = '#f4f4f9';
    select.style.color = '#333';
    select.style.maxWidth = '150px'; // Limit the width of the select element

    switcher.appendChild(label);
    switcher.appendChild(select);

    footer.appendChild(switcher); // Add the language switcher to the footer

    initializeLanguageSelector(); // Initialize the selector
}

/**
 * 다국어 시스템을 초기화합니다.
 * @param {object} [options={}] - 초기화 옵션.
 * @param {string} [options.translationsPath] - 번역 JSON 파일 경로. 기본값은 스크립트와 동일한 경로의 'locales.json'.
 */
async function initializeLocalization(options = {}) {
    let scriptPath;
    try {
        // Fallback for `document.currentScript` if it's null
        const scripts = document.getElementsByTagName('script');
        scriptPath = scripts[scripts.length - 1].src; // Get the last loaded script
    } catch (error) {
        console.error("스크립트 경로를 가져오는 중 오류 발생:", error);
        return;
    }

    const scriptDir = scriptPath.substring(0, scriptPath.lastIndexOf('/'));
    const translationsPath = options.translationsPath || `${scriptDir}/locales.json`;

    await loadTranslations(translationsPath);

    // Dynamically fetch supported languages from the JSON file
    supportedLanguages = Object.keys(translations);
    defaultLanguage = getBrowserLanguage() || supportedLanguages[0];

    const storedLang = getStoredLanguage();
    const initialLang = storedLang && supportedLanguages.includes(storedLang)
        ? storedLang
        : defaultLanguage;

    await setLanguage(initialLang, false);
    applyTranslationsToPage();

    // Attempt to create the language switcher
    createLanguageSwitcher();

    console.log(`다국어 시스템 초기화 완료. 현재 언어: ${currentLanguage}`);
}

/**
 * 현재 언어를 설정하고, 필요한 경우 페이지 번역을 업데이트합니다.
 * @param {string} lang - 설정할 언어 코드.
 * @param {boolean} [apply=true] - 즉시 페이지 번역을 적용할지 여부.
 */
async function setLanguage(lang, apply = true) {
    if (supportedLanguages.includes(lang)) {
        if (translations[lang]) {
            currentLanguage = lang;
            storeLanguage(lang);
            if (apply) {
                applyTranslationsToPage();
            }
            // Update the language selector value if it exists
            const langSelector = document.getElementById('language-selector');
            if (langSelector) {
                langSelector.value = currentLanguage;
            }
            console.log(`언어가 ${currentLanguage}(으)로 변경되었습니다.`);
        } else {
            console.warn(`언어 '${lang}'에 대한 번역이 없습니다. 언어가 변경되지 않았습니다.`);
        }
    } else {
        console.warn(`언어 '${lang}'는 지원되지 않습니다. 지원 언어: ${supportedLanguages.join(', ')}. 언어가 변경되지 않았습니다.`);
    }
}

/**
 * 주어진 키에 해당하는 번역된 문자열을 반환합니다.
 * @param {string} key - 번역할 문자열의 키.
 * @param {string} [lang=currentLanguage] - 번역을 가져올 언어. 기본값은 현재 언어.
 * @returns {string} 번역된 문자열. 번역이 없으면 기본 언어의 번역 반환.
 */
function translate(key, lang = currentLanguage) {
    if (translations[lang] && translations[lang][key] !== undefined) {
        return translations[lang][key];
    }
    // 현재 언어에 번역이 없으면 기본 언어에서 찾아봅니다.
    if (defaultLanguage !== lang && translations[defaultLanguage] && translations[defaultLanguage][key] !== undefined) {
        console.warn(`키 '${key}'에 대한 번역이 '${lang}' 언어에 없어 기본 언어('${defaultLanguage}')를 사용합니다.`);
        return translations[defaultLanguage][key];
    }
    console.warn(`키 '${key}'에 대한 번역이 '${lang}' 언어 및 기본 언어에 없습니다.`); 
}

function getCurrentLanguage() {
    return currentLanguage;
}

function getSupportedLanguages() {
    return [...supportedLanguages]; // 복사본 반환
}

// Automatically initialize localization when the script is loaded
(async () => {
    try {
        await initializeLocalization();

        // Add fullscreen handling for the language switcher and footer
        document.addEventListener('fullscreenchange', () => {
            const switcher = document.querySelector('.language-switcher');
            const footer = document.querySelector('footer');
            if (switcher && footer) {
                if (document.fullscreenElement) {
                    switcher.style.display = 'none'; // Hide in fullscreen
                    footer.style.display = 'none'; // Hide footer in fullscreen
                } else {
                    switcher.style.display = 'flex'; // Show when exiting fullscreen
                    footer.style.display = 'block'; // Show footer when exiting fullscreen
                }
            }
        });
    } catch (error) {
        console.error("Localization initialization failed:", error);
    }
})();