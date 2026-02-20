// --- ESTADO DA APLICAÇÃO ---
let state = {
    language: 'pt',
    activeSection: 'profile',
    isMuted: true,
    hasInitializedAudio: false,
    translations: {}, // Será preenchido com o JSON do idioma
    isMobileMenuOpen: false,
    chaosIntervalId: null,
    isDiagnosticsMenuOpen: false,
    isDiagnosticsModalOpen: false
};


function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// --- FUNÇÃO PRINCIPAL DE RENDERIZAÇÃO ---
function renderApp() {
    const t = state.translations;
    if (!t.menu) return; // Aguarda o carregamento das traduções

    const contentWindow = document.getElementById('content-window');

    const menuContainer = document.getElementById('main-menu');
    menuContainer.innerHTML = Object.keys(t.menu).filter(key => key !== 'diagnostics').map(key => `
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

        // ✅ NOVA SEÇÃO: WISHLIST
        case 'wishlist': contentHtml = renderWishlist(t.wishlist); break;
    }

    const sectionTitle = escapeHtml(t[state.activeSection]?.title || '');
    contentWindow.innerHTML = `<h2 class="text-xl sm:text-2xl text-red-500 mb-4 sm:mb-6 tracking-widest text-glow">${sectionTitle}</h2>${contentHtml}`;
    contentWindow.classList.add('fade-in');
    setTimeout(() => contentWindow.classList.remove('fade-in'), 500);

    renderSystemStatus(t.status);

    const langContainer = document.getElementById('lang-buttons');
    langContainer.innerHTML = ['pt', 'en', 'es', 'ja'].map(lang => `
        <button data-lang="${lang}" class="lang-button px-2 sm:px-3 py-1 text-sm sm:text-base transition-colors ${state.language === lang ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}">${lang.toUpperCase()}</button>
    `).join('');

    addEventListeners();
    window.ParticlesAPI?.setMode(state.activeSection);
}


function formatBytes(value) {
    if (!Number.isFinite(value)) return 'N/A';
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = value;
    let unit = 0;
    while (size >= 1024 && unit < units.length - 1) {
        size /= 1024;
        unit += 1;
    }
    return `${size.toFixed(size >= 10 || unit === 0 ? 0 : 1)} ${units[unit]}`;
}

async function updateDiagnosticsPanel() {
    if (!state.isDiagnosticsModalOpen) return;
    const container = document.getElementById('diagnostics-container');
    if (!container) return;

    const rows = [];
    const swSupported = 'serviceWorker' in navigator;
    let swRegistered = 'N/A';
    if (swSupported) {
        try {
            const reg = await navigator.serviceWorker.getRegistration();
            swRegistered = reg ? 'Registrado' : 'Não registrado';
        } catch {
            swRegistered = 'Erro ao consultar';
        }
    }
    rows.push({ label: 'Service Worker - suporte', value: swSupported ? 'Suportado' : 'Não suportado' });
    rows.push({ label: 'Service Worker - registro', value: swRegistered });
    rows.push({ label: 'Service Worker - controle da página', value: navigator.serviceWorker && navigator.serviceWorker.controller ? 'Controlando' : 'Sem controle' });
    rows.push({ label: 'Conectividade', value: navigator.onLine ? 'Online' : 'Offline' });

    if (navigator.storage && navigator.storage.estimate) {
        try {
            const estimate = await navigator.storage.estimate();
            rows.push({ label: 'Storage usado', value: formatBytes(estimate.usage) });
            rows.push({ label: 'Storage quota', value: formatBytes(estimate.quota) });
        } catch {
            rows.push({ label: 'Storage estimate', value: 'Erro ao consultar' });
        }
    } else {
        rows.push({ label: 'Storage estimate', value: 'API indisponível neste navegador' });
    }

    if ('caches' in window) {
        try {
            const keys = await caches.keys();
            const details = await Promise.all(keys.map(async key => {
                try {
                    const cache = await caches.open(key);
                    const entries = await cache.keys();
                    return `${key} (${entries.length} itens)`;
                } catch {
                    return `${key} (itens: N/A)`;
                }
            }));
            rows.push({ label: 'Caches', value: details.length ? details.join(', ') : 'Nenhum cache encontrado' });
        } catch {
            rows.push({ label: 'Caches', value: 'Erro ao consultar caches' });
        }
    } else {
        rows.push({ label: 'Caches', value: 'Cache API não suportada' });
    }

    try {
        const response = await fetch('./build-info.json', { cache: 'no-store' });
        if (response.ok) {
            const info = await response.json();
            rows.push({ label: 'Build/versão', value: info.version || info.build || JSON.stringify(info) });
        } else {
            rows.push({ label: 'Build/versão', value: 'N/A' });
        }
    } catch {
        rows.push({ label: 'Build/versão', value: 'N/A' });
    }

    container.innerHTML = rows.map(row => `
        <div class="border border-red-900/40 bg-black/30 px-3 py-2">
            <p class="text-red-400 text-xs uppercase tracking-wider">${escapeHtml(row.label)}</p>
            <p class="text-gray-200 text-sm break-words">${escapeHtml(row.value)}</p>
        </div>
    `).join('');
}

async function clearAllCaches() {
    if (!('caches' in window)) return 0;
    const keys = await caches.keys();
    await Promise.all(keys.map(key => caches.delete(key)));
    return keys.length;
}

function setDiagnosticsStatus(message, level = 'info') {
    const statusEl = document.getElementById('diagnostics-status');
    if (!statusEl) return;

    const palette = {
        info: 'text-gray-400',
        success: 'text-green-400',
        warning: 'text-yellow-300',
        error: 'text-red-400'
    };

    statusEl.classList.remove('text-gray-400', 'text-green-400', 'text-yellow-300', 'text-red-400');
    statusEl.classList.add(palette[level] || palette.info);
    statusEl.textContent = message;
}

async function clearSiteData() {
    const feedback = [];

    try {
        const cacheCount = await clearAllCaches();
        feedback.push(`Cache Storage: ${cacheCount} cache(s) removido(s).`);
    } catch (error) {
        feedback.push(`Cache Storage: erro (${error.message}).`);
    }

    if ('serviceWorker' in navigator) {
        try {
            const registrations = await navigator.serviceWorker.getRegistrations();
            const results = await Promise.all(registrations.map(reg => reg.unregister()));
            const removed = results.filter(Boolean).length;
            feedback.push(`Service Workers: ${removed}/${registrations.length} desregistrado(s).`);
        } catch (error) {
            feedback.push(`Service Workers: erro (${error.message}).`);
        }
    } else {
        feedback.push('Service Workers: não suportado.');
    }

    try {
        localStorage.clear();
        sessionStorage.clear();
        feedback.push('Storage local/session: limpo.');
    } catch (error) {
        feedback.push(`Storage local/session: erro (${error.message}).`);
    }

    if ('indexedDB' in window) {
        try {
            let names = [];
            if (typeof indexedDB.databases === 'function') {
                const databases = await indexedDB.databases();
                names = databases.map(db => db && db.name).filter(Boolean);
            }

            if (!names.length) {
                feedback.push('IndexedDB: suporte detectado, nenhum banco listado para remoção automática.');
            } else {
                const results = await Promise.all(names.map(name => new Promise(resolve => {
                    const request = indexedDB.deleteDatabase(name);
                    request.onsuccess = () => resolve({ ok: true });
                    request.onerror = () => resolve({ ok: false });
                    request.onblocked = () => resolve({ ok: false, blocked: true });
                })));
                const removed = results.filter(result => result.ok).length;
                feedback.push(`IndexedDB: ${removed}/${results.length} banco(s) removido(s).`);
            }
        } catch (error) {
            feedback.push(`IndexedDB: erro (${error.message}).`);
        }
    } else {
        feedback.push('IndexedDB: não suportado.');
    }

    return feedback;
}

function closeDiagnosticsMenu() {
    const dropdown = document.getElementById('diagnostics-dropdown');
    const toggle = document.getElementById('diagnostics-menu-toggle');
    if (!dropdown || !toggle) return;
    dropdown.classList.add('hidden');
    toggle.setAttribute('aria-expanded', 'false');
    state.isDiagnosticsMenuOpen = false;
}

function openDiagnosticsMenu() {
    const dropdown = document.getElementById('diagnostics-dropdown');
    const toggle = document.getElementById('diagnostics-menu-toggle');
    if (!dropdown || !toggle) return;
    dropdown.classList.remove('hidden');
    toggle.setAttribute('aria-expanded', 'true');
    state.isDiagnosticsMenuOpen = true;
}

function closeDiagnosticsModal() {
    const modal = document.getElementById('diagnostics-modal');
    if (!modal) return;
    modal.classList.add('hidden');
    state.isDiagnosticsModalOpen = false;
}

function openDiagnosticsModal() {
    const modal = document.getElementById('diagnostics-modal');
    if (!modal) return;
    modal.classList.remove('hidden');
    state.isDiagnosticsModalOpen = true;
    setDiagnosticsStatus('Carregando diagnóstico...', 'info');
    updateDiagnosticsPanel().then(() => {
        setDiagnosticsStatus('Diagnóstico atualizado.', 'info');
    });
}

// --- GESTORES DE EVENTOS ---
function addEventListeners() {
    document.querySelectorAll('.menu-button').forEach(button => {
        button.addEventListener('click', () => {
            soundManager.playClick();
            state.activeSection = button.dataset.section;
            window.ParticlesAPI?.setMode(state.activeSection);
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

function bindDiagnosticsListeners() {
    const clearCacheBtn = document.getElementById('diag-clear-cache');
    if (clearCacheBtn) {
        clearCacheBtn.addEventListener('click', async () => {
            setDiagnosticsStatus('Limpando dados do site...', 'warning');
            const feedback = await clearSiteData();
            const hasError = feedback.some(item => item.toLowerCase().includes('erro'));
            setDiagnosticsStatus(hasError ? 'Limpeza concluída com avisos.' : 'Cache limpo com sucesso.', hasError ? 'warning' : 'success');

            const container = document.getElementById('diagnostics-container');
            if (container) {
                const feedbackHtml = feedback.map(item => `<p class="text-xs text-gray-300">• ${item}</p>`).join('');
                container.insertAdjacentHTML('afterbegin', `<div class="border border-red-900/40 bg-black/50 px-3 py-2"><p class="text-red-400 text-xs uppercase tracking-wider mb-1">Resultado da limpeza</p>${feedbackHtml}</div>`);
            }

            updateDiagnosticsPanel();
        });
    }

    const reloadBtn = document.getElementById('diag-reload');
    if (reloadBtn) {
        reloadBtn.addEventListener('click', () => {
            location.reload();
        });
    }

    const diagnosticsMenuToggle = document.getElementById('diagnostics-menu-toggle');
    if (diagnosticsMenuToggle) {
        diagnosticsMenuToggle.addEventListener('click', (event) => {
            event.stopPropagation();
            soundManager.playClick();
            if (state.isDiagnosticsMenuOpen) {
                closeDiagnosticsMenu();
            } else {
                openDiagnosticsMenu();
            }
        });
    }

    const diagnosticsOpen = document.getElementById('diagnostics-open');
    if (diagnosticsOpen) {
        diagnosticsOpen.addEventListener('click', () => {
            soundManager.playClick();
            closeDiagnosticsMenu();
            openDiagnosticsModal();
        });
    }

    const diagnosticsClose = document.getElementById('diagnostics-close');
    if (diagnosticsClose) {
        diagnosticsClose.addEventListener('click', () => {
            soundManager.playClick();
            closeDiagnosticsModal();
        });
    }

    const diagnosticsBackdrop = document.getElementById('diagnostics-modal-backdrop');
    if (diagnosticsBackdrop) {
        diagnosticsBackdrop.addEventListener('click', closeDiagnosticsModal);
    }
}

// --- FUNÇÕES DO MENU MOBILE ---
function toggleMobileMenu() {
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
    bindDiagnosticsListeners();

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

    window.addEventListener('online', updateDiagnosticsPanel);
    window.addEventListener('offline', updateDiagnosticsPanel);

    document.addEventListener('click', (event) => {
        const menu = document.getElementById('diagnostics-menu');
        if (state.isDiagnosticsMenuOpen && menu && !menu.contains(event.target)) {
            closeDiagnosticsMenu();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            if (state.isDiagnosticsMenuOpen) closeDiagnosticsMenu();
            if (state.isDiagnosticsModalOpen) closeDiagnosticsModal();
        }
    });

    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./service-worker.js').catch((error) => {
                console.error('Falha ao registrar o service worker:', error);
            });
        });
    }
});
