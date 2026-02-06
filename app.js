// --- ESTADO DA APLICAÇÃO ---
let state = {
    language: 'pt',
    activeSection: 'profile',
    isMuted: true,
    hasInitializedAudio: false,
    translations: {}, // Será preenchido com o JSON do idioma
    isMobileMenuOpen: false
};

// --- FUNÇÃO PRINCIPAL DE RENDERIZAÇÃO ---
function renderApp() {
    const t = state.translations;
    if (!t.menu) return; // Aguarda o carregamento das traduções

    const contentWindow = document.getElementById('content-window');
    
    const menuContainer = document.getElementById('main-menu');
    menuContainer.innerHTML = Object.keys(t.menu).map(key => `
        <button data-section="${key}" class="menu-button flex items-center gap-3 p-2.5 text-left text-lg transition-all duration-200 ${state.activeSection === key ? 'bg-red-500/20 text-red-400' : 'text-gray-500 hover:bg-red-500/10 hover:text-red-400'}">
            <i class="${staticData.menuIcons[key]} text-xl"></i> <span>${t.menu[key]}</span>
        </button>
    `).join('');

    let contentHtml = '';
    switch(state.activeSection) {
        case 'profile': contentHtml = renderProfile(t.profile); break;
        case 'affinities': contentHtml = renderAffinities(t.affinities); break;
        case 'records': contentHtml = renderRecords(t.records); break;
        case 'gallery': contentHtml = renderGallery(); break;
    }
    contentWindow.innerHTML = `<h2 class="text-xl sm:text-2xl text-red-500 mb-4 sm:mb-6 tracking-widest text-glow">${t[state.activeSection].title}</h2>${contentHtml}`;
    contentWindow.classList.add('fade-in');
    setTimeout(() => contentWindow.classList.remove('fade-in'), 500);

    renderSystemStatus(t.status);

    const langContainer = document.getElementById('lang-buttons');
    langContainer.innerHTML = ['pt', 'en', 'es', 'ja'].map(lang => `
        <button data-lang="${lang}" class="lang-button px-2 sm:px-3 py-1 text-sm sm:text-base transition-colors ${state.language === lang ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}">${lang.toUpperCase()}</button>
    `).join('');

    addEventListeners();
}

// --- GESTORES DE EVENTOS ---
function addEventListeners() {
    document.querySelectorAll('.menu-button').forEach(button => {
        button.addEventListener('click', () => {
            soundManager.playClick();
            state.activeSection = button.dataset.section;
            soundManager.playLoad();
            renderApp();
            // Fechar menu mobile após clicar
            if (window.innerWidth < 1024) {
                closeMobileMenu();
            }
        });
    });
    
    document.querySelectorAll('.lang-button').forEach(button => {
        button.addEventListener('click', () => {
            soundManager.playClick();
            loadLanguage(button.dataset.lang);
        });
    });
}

// --- FUNÇÕES DO MENU MOBILE ---
function toggleMobileMenu() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('mobile-overlay');
    const toggle = document.getElementById('mobile-menu-toggle');
    
    if (state.isMobileMenuOpen) {
        closeMobileMenu();
    } else {
        openMobileMenu();
    }
}

function openMobileMenu() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('mobile-overlay');
    
    sidebar.classList.remove('-translate-x-full');
    sidebar.classList.add('translate-x-0');
    overlay.classList.remove('hidden');
    state.isMobileMenuOpen = true;
}

function closeMobileMenu() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('mobile-overlay');
    
    sidebar.classList.remove('translate-x-0');
    sidebar.classList.add('-translate-x-full');
    overlay.classList.add('hidden');
    state.isMobileMenuOpen = false;
}

async function loadLanguage(lang) {
    state.language = lang;
    state.translations = languageData[lang];
    renderApp();
}

// --- INICIALIZAÇÃO ---
document.addEventListener('DOMContentLoaded', () => {
    const mainContainer = document.getElementById('main-container');
    const bootScreen = document.getElementById('boot-screen');
    const bootText = document.getElementById('boot-text');
    const muteButton = document.getElementById('mute-button');
    
    // Mobile menu elements
    function getMobileMenuElements() {
        return {
            mobileMenuToggle: document.getElementById('mobile-menu-toggle'),
            mobileMenuClose: document.getElementById('mobile-menu-close'),
            mobileOverlay: document.getElementById('mobile-overlay'),
        };
    }
    
    const bootTextContent = "INITIALIZING... PROJECT REV TERMINAL...";
    let boot_i = 0;
    const bootInterval = setInterval(() => {
        if (boot_i >= bootTextContent.length) {
            clearInterval(bootInterval);
        } else {
            bootText.innerHTML = bootTextContent.substring(0, boot_i + 1) + '<span class="animate-pulse cursor">_</span>';
            boot_i++;
        }
    }, 50);

    setTimeout(() => {
        bootScreen.style.display = 'none';
        mainContainer.style.display = 'flex';
        loadLanguage(state.language); // Carrega o idioma inicial
        // Adiciona listeners do menu mobile após o DOM estar pronto
        const { mobileMenuToggle, mobileMenuClose, mobileOverlay } = getMobileMenuElements();
        if (mobileMenuToggle) mobileMenuToggle.addEventListener('click', toggleMobileMenu);
        if (mobileMenuClose) mobileMenuClose.addEventListener('click', closeMobileMenu);
        if (mobileOverlay) mobileOverlay.addEventListener('click', closeMobileMenu);
    }, 3000);

    setInterval(() => {
        const timeEl = document.getElementById('sync-time');
        if (timeEl) timeEl.textContent = new Date().toLocaleTimeString();
    }, 1000);

    const startAudio = () => {
        if(state.hasInitializedAudio) return;
        Tone.start().then(() => {
            soundManager.initialize();
            state.isMuted = false;
            muteButton.innerHTML = '<i class="fas fa-volume-high fa-lg"></i>';
        });
    };
    document.body.addEventListener('click', startAudio, { once: true });
    
    muteButton.addEventListener('click', () => {
        state.isMuted = !state.isMuted;
        soundManager.toggleMute(state.isMuted);
        muteButton.innerHTML = state.isMuted ? '<i class="fas fa-volume-xmark fa-lg"></i>' : '<i class="fas fa-volume-high fa-lg"></i>';
    });

    // Close mobile menu on window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 1024 && state.isMobileMenuOpen) {
            closeMobileMenu();
        }
    });

    // Inicializar sistema de partículas
    initParticles();
}); 