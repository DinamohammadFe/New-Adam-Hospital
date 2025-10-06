/**
 * Internationalization (i18n) Module
 * Handles language switching and text translation for the website
 */

class I18n {
    constructor() {
        this.currentLanguage = 'en'; // Default to English
        this.translations = {};
        this.isRTL = false;
        this.init();
    }

    async init() {
        await this.loadTranslations();
        this.setLanguage(this.currentLanguage);
        this.initLanguageToggle();
    }

    async loadTranslations() {
        try {
            // Load English translations
            const enResponse = await fetch('./locales/en.json');
            this.translations.en = await enResponse.json();

            // Load Arabic translations
            const arResponse = await fetch('./locales/ar.json');
            this.translations.ar = await arResponse.json();
        } catch (error) {
            // Fallback to English if loading fails
            this.currentLanguage = 'en';
        }
    }

    setLanguage(lang) {
        this.currentLanguage = lang;
        this.isRTL = lang === 'ar';
        
        // Save to localStorage
        localStorage.setItem('language', lang);
        
        // Set document attributes
        document.documentElement.lang = lang;
        document.documentElement.dir = this.isRTL ? 'rtl' : 'ltr';
        document.body.classList.toggle('rtl', this.isRTL);
        
        // Update all translatable elements
        this.updatePageContent();
        
        // Update language toggle button
        this.updateToggleButton();
    }

    translate(key) {
        const keys = key.split('.');
        let value = this.translations[this.currentLanguage];
        
        for (const k of keys) {
            if (value && typeof value === 'object') {
                value = value[k];
            } else {
                break;
            }
        }
        
        // Fallback to English if translation not found
        if (!value && this.currentLanguage !== 'en') {
            value = this.translations.en;
            for (const k of keys) {
                if (value && typeof value === 'object') {
                    value = value[k];
                } else {
                    break;
                }
            }
        }
        
        return value || key;
    }

    updatePageContent() {
        // Update elements with data-i18n attribute
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.translate(key);
            
            if (element.tagName === 'INPUT' && element.type === 'text') {
                element.placeholder = translation;
            } else {
                element.textContent = translation;
            }
        });

        // Update elements with data-i18n-placeholder attribute
        const placeholderElements = document.querySelectorAll('[data-i18n-placeholder]');
        placeholderElements.forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            element.placeholder = this.translate(key);
        });

        // Update elements with data-i18n-title attribute
        const titleElements = document.querySelectorAll('[data-i18n-title]');
        titleElements.forEach(element => {
            const key = element.getAttribute('data-i18n-title');
            element.title = this.translate(key);
        });

        // Update elements with data-i18n-aria-label attribute
        const ariaElements = document.querySelectorAll('[data-i18n-aria-label]');
        ariaElements.forEach(element => {
            const key = element.getAttribute('data-i18n-aria-label');
            element.setAttribute('aria-label', this.translate(key));
        });
    }

    initLanguageToggle() {
        const toggleBtn = document.getElementById('languageToggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                const newLang = this.currentLanguage === 'en' ? 'ar' : 'en';
                this.setLanguage(newLang);
            });
            
            // Update toggle button text based on current language
            this.updateToggleButton();
        }
    }
    
    // Update language toggle button text
    updateToggleButton() {
        const toggleBtn = document.getElementById('languageToggle');
        const langText = toggleBtn?.querySelector('.lang-text');
        if (langText) {
            langText.textContent = this.currentLanguage === 'en' ? 'العربية' : 'English';
        }
    }

    // Helper method to get current language
    getCurrentLanguage() {
        return this.currentLanguage;
    }

    // Helper method to check if current language is RTL
    isRightToLeft() {
        return this.isRTL;
    }
}

// Initialize i18n when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    const i18n = new I18n();
    await i18n.init();
    
    // Make i18n globally available
    window.i18n = i18n;
});