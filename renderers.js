// --- FUNÇÕES DE RENDERIZAÇÃO ---

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function safeUrl(value) {
    try {
        const url = new URL(value, window.location.origin);
        if (url.protocol === 'http:' || url.protocol === 'https:') {
            return url.toString();
        }
    } catch (error) {
        return '#';
    }
    return '#';
}

// --- MÁQUINA DE ESCREVER (loop único via requestAnimationFrame) ---
const typewriterQueue = [];
let typewriterRaf = null;

function typeOutText(element, text, speed = 30) {
    if (!element) return;
    element.innerHTML = '';
    typewriterQueue.push({ element, text, speed, startTime: null, lastIndex: -1 });
    if (typewriterRaf === null) {
        typewriterRaf = requestAnimationFrame(runTypewriters);
    }
}

function runTypewriters(now) {
    for (let i = typewriterQueue.length - 1; i >= 0; i--) {
        const item = typewriterQueue[i];
        if (item.startTime === null) item.startTime = now;

        const elapsed = now - item.startTime;
        const targetIndex = Math.min(Math.floor(elapsed / item.speed), item.text.length);

        if (targetIndex !== item.lastIndex) {
            item.lastIndex = targetIndex;
            if (targetIndex >= item.text.length) {
                item.element.innerHTML = item.text;
                typewriterQueue.splice(i, 1);
            } else {
                item.element.innerHTML = item.text.substring(0, targetIndex) + '<span class="animate-pulse cursor">_</span>';
            }
        }
    }

    typewriterRaf = typewriterQueue.length > 0 ? requestAnimationFrame(runTypewriters) : null;
}

// Cancela todas as digitações em andamento (chamar ao trocar de seção)
function clearTypewriters() {
    typewriterQueue.length = 0;
    if (typewriterRaf !== null) {
        cancelAnimationFrame(typewriterRaf);
        typewriterRaf = null;
    }
}

function triggerParticlesAtElement(element, action) {
    if (!element || !window.ParticlesAPI) return;
    const rect = element.getBoundingClientRect();
    const x = rect.left + (rect.width / 2);
    const y = rect.top + (rect.height / 2);

    if (action === 'attract') {
        window.ParticlesAPI.attractTo(x, y, 1, 360);
    } else if (action === 'burst') {
        window.ParticlesAPI.burst(x, y, 1);
    }
}

function bindReactiveParticleEvents(selector) {
    document.querySelectorAll(selector).forEach((element) => {
        if (element.dataset.particlesBound === '1') return;
        element.dataset.particlesBound = '1';

        element.addEventListener('mouseenter', () => {
            triggerParticlesAtElement(element, 'attract');
        });

        element.addEventListener('click', () => {
            triggerParticlesAtElement(element, 'burst');
        });
    });
}

// --- LIGHTBOX (modal de imagens, criado uma única vez sob demanda) ---

function ensureImageViewerModal(prefix) {
    const modalId = `${prefix}-modal`;
    if (document.getElementById(modalId)) return;

    const modal = document.createElement('div');
    modal.id = modalId;
    modal.style.display = 'none';
    modal.innerHTML = `
        <div id="${prefix}-backdrop" class="lightbox-backdrop">
            <button id="${prefix}-close" class="lightbox-close" type="button">&times;</button>
            <button id="${prefix}-prev" class="lightbox-nav-btn lightbox-nav-prev" type="button">&#8592;</button>
            <div id="${prefix}-stage" class="lightbox-stage">
                <img id="${prefix}-img" src="" class="lightbox-image" alt="" draggable="false" />
            </div>
            <button id="${prefix}-next" class="lightbox-nav-btn lightbox-nav-next" type="button">&#8594;</button>
        </div>
    `;
    document.body.appendChild(modal);
}

function createLightbox(prefix) {
    ensureImageViewerModal(prefix);
    const modal = document.getElementById(`${prefix}-modal`);
    const img = document.getElementById(`${prefix}-img`);

    let items = [];
    let index = 0;

    const showCurrent = () => {
        const item = items[index];
        if (!item) return;
        img.src = item.image;
        img.alt = item.name || '';
    };

    const close = () => { modal.style.display = 'none'; };

    const nav = (dir) => {
        if (!items.length) return;
        index = (index + dir + items.length) % items.length;
        showCurrent();
    };

    const open = (newItems, startIndex) => {
        items = newItems;
        index = startIndex;
        showCurrent();
        modal.style.display = 'block';
    };

    if (!modal.hasListeners) {
        modal.hasListeners = true;
        document.getElementById(`${prefix}-close`).onclick = close;
        document.getElementById(`${prefix}-backdrop`).onclick = (e) => {
            if (e.target.id === `${prefix}-backdrop`) close();
        };
        document.getElementById(`${prefix}-prev`).onclick = (e) => { e.stopPropagation(); nav(-1); };
        document.getElementById(`${prefix}-next`).onclick = (e) => { e.stopPropagation(); nav(1); };
        document.addEventListener('keydown', (e) => {
            if (modal.style.display !== 'block') return;
            if (e.key === 'Escape') close();
            if (e.key === 'ArrowLeft') nav(-1);
            if (e.key === 'ArrowRight') nav(1);
        });
    }

    return { open, close, nav };
}

// Singletons criados sob demanda (no primeiro clique em uma imagem)
let affinityLightbox = null;
let galleryLightbox = null;

const AFFINITY_BASE_KEYS = ['jogos', 'series', 'filmes'];
const AFFINITY_CATEGORY_KEYS = staticData.affinities.map((_, index) => AFFINITY_BASE_KEYS[index] || `cat-${index}`);

window.openAffinityLightbox = function (categoryKey, idx) {
    const categoryIndex = AFFINITY_CATEGORY_KEYS.indexOf(categoryKey);
    if (categoryIndex < 0) return;
    const items = staticData.affinities[categoryIndex].items.filter(item => item.image);
    if (!affinityLightbox) affinityLightbox = createLightbox('affinity-lightbox');
    affinityLightbox.open(items, idx);
};

window.openLightbox = function (idx) {
    const items = staticData.gallery.map(src => ({ image: src, name: 'Imagem da galeria' }));
    if (!galleryLightbox) galleryLightbox = createLightbox('lightbox');
    galleryLightbox.open(items, idx);
};

// --- ÍCONES DO SETUP (constantes, computadas uma única vez) ---
const PROFILE_SETUP_ICONS = {
    cpu: '<svg viewBox="0 0 24 24" class="setup-item-icon" aria-hidden="true"><rect x="7" y="7" width="10" height="10" rx="1.5" fill="none" stroke="currentColor" stroke-width="2"/><rect x="10" y="10" width="4" height="4" fill="currentColor"/><path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    gpu: '<svg viewBox="0 0 24 24" class="setup-item-icon" aria-hidden="true"><rect x="3" y="7" width="15" height="10" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="8" cy="12" r="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 10h3M12 14h3M18 11h3M18 13h3M18 15h2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    ram: '<svg viewBox="0 0 24 24" class="setup-item-icon" aria-hidden="true"><rect x="3" y="8" width="18" height="8" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M6 10v4M10 10v4M14 10v4M18 10v4M6 16v2M10 16v2M14 16v2M18 16v2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    keyboard: '<svg viewBox="0 0 24 24" class="setup-item-icon" aria-hidden="true"><rect x="2" y="7" width="20" height="10" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M5 10h1M8 10h1M11 10h1M14 10h1M17 10h1M5 13h1M8 13h1M11 13h6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    mouse: '<svg viewBox="0 0 24 24" class="setup-item-icon" aria-hidden="true"><rect x="7" y="4" width="10" height="16" rx="5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 4v5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    headset: '<svg viewBox="0 0 24 24" class="setup-item-icon" aria-hidden="true"><path d="M4 13a8 8 0 0 1 16 0" fill="none" stroke="currentColor" stroke-width="2"/><rect x="3" y="12" width="4" height="6" rx="1" fill="none" stroke="currentColor" stroke-width="2"/><rect x="17" y="12" width="4" height="6" rx="1" fill="none" stroke="currentColor" stroke-width="2"/><path d="M17 18v1a2 2 0 0 1-2 2h-3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    microphone: '<svg viewBox="0 0 24 24" class="setup-item-icon" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><path d="M6 11a6 6 0 0 0 12 0M12 17v4M9 21h6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    monitor: '<svg viewBox="0 0 24 24" class="setup-item-icon" aria-hidden="true"><rect x="3" y="5" width="18" height="12" rx="1" fill="none" stroke="currentColor" stroke-width="2"/><path d="M10 19h4M8 21h8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    mousepad: '<svg viewBox="0 0 24 24" class="setup-item-icon" aria-hidden="true"><path d="M4 19V9a4 4 0 0 1 4-4h8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M16 5l-3 3M16 5l3 3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'
};

function renderProfile(t) {
    const gridFieldsHtml = t.fields.map((field, index) => `
        <div class="bg-gray-900/50 p-3 sm:p-4 border border-red-800/50 flex items-center gap-3 sm:gap-4">
            <i class="fas ${field.icon} text-red-500 text-xl sm:text-2xl w-6 sm:w-8 text-center"></i>
            <div class="min-w-0 flex-1">
                <p class="text-red-500 font-bold text-xs sm:text-sm uppercase tracking-widest">${field.label}</p>
                <p class="text-gray-300 text-sm sm:text-lg" id="profile-field-${index}"></p>
            </div>
        </div>
    `).join('');

    const directiveHtml = `
        <div class="mt-4 lg:col-span-2 bg-gray-900/50 p-3 sm:p-4 border border-red-800/50">
            <p class="text-red-500 font-bold text-xs sm:text-sm uppercase tracking-widest">${t.directive.label}</p>
            <p class="text-gray-300 text-sm sm:text-lg mt-2" id="profile-field-directive"></p>
        </div>
    `;

    const socialsHtml = `
        <div class="mt-4 lg:col-span-2 bg-gray-900/50 p-3 sm:p-4 border border-red-800/50">
            <p class="text-red-500 font-bold text-xs sm:text-sm uppercase tracking-widest mb-3 sm:mb-4">${t.socialsTitle}</p>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                ${staticData.socials.map(social => `
                    <a href="${safeUrl(social.url)}" target="_blank" rel="noopener noreferrer" class="flex items-center gap-2 sm:gap-3 text-gray-400 hover:text-red-500 transition-colors bg-gray-800/70 p-2 sm:p-3 border border-transparent hover:border-red-700">
                        <i class="${social.icon} w-4 sm:w-5 text-center"></i>
                        <div class="min-w-0 flex-1">
                            <p class="font-bold text-white text-xs sm:text-sm truncate">${escapeHtml(social.name)}</p>
                            <p class="text-xs truncate">${escapeHtml(social.user)}</p>
                        </div>
                    </a>
                `).join('')}
            </div>
        </div>`;

    const setupHtml = `
        <div class="mt-4 lg:col-span-2 bg-gray-900/50 p-3 sm:p-4 border border-red-800/50">
            <p class="text-red-500 font-bold text-xs sm:text-sm uppercase tracking-widest mb-3 sm:mb-4">${t.setupTitle}</p>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                ${staticData.setup.map((item, index) => {
                    const translatedLabel = t.setup[index] && t.setup[index].label ? t.setup[index].label : item.label;
                    const iconSvg = PROFILE_SETUP_ICONS[item.icon] || PROFILE_SETUP_ICONS.cpu;
                    return `
                        <div class="flex items-center gap-2 sm:gap-3 text-gray-400 bg-gray-800/70 p-2 sm:p-3 border border-transparent">
                            <span class="inline-flex text-red-500 flex-shrink-0">${iconSvg}</span>
                            <div class="min-w-0 flex-1">
                                <p class="font-bold text-white text-xs sm:text-sm truncate">${escapeHtml(translatedLabel)}</p>
                                <p class="text-xs truncate">${escapeHtml(item.value)}</p>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;

    const featuredHtml = `
        <div class="w-full lg:w-1/3 flex-shrink-0 mt-4 lg:mt-0">
            <div class="bg-gray-900/50 border border-red-800/50 h-full flex flex-col featured-card">
                <h3 class="text-lg sm:text-xl text-red-500 text-glow p-3 sm:p-4">${t.featuredTitle}</h3>
                <div class="relative overflow-hidden flex-grow" style="min-height: 300px;">
                   <img src="${staticData.featuredImage}" class="absolute inset-0 w-full h-full object-cover featured-image" alt="Featured Image"/>
                   <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                   <div class="absolute bottom-0 left-0 p-3 sm:p-4">
                        <h4 class="text-lg sm:text-2xl font-bold text-white">${t.featured.title}</h4>
                        <h5 class="text-sm sm:text-lg text-red-400">${t.featured.subtitle}</h5>
                        <p class="text-xs sm:text-base mt-2 text-gray-300">${t.featured.description}</p>
                   </div>
                </div>
            </div>
        </div>
    `;

    setTimeout(() => {
        t.fields.forEach((field, index) => {
            const el = document.getElementById(`profile-field-${index}`);
            typeOutText(el, field.value, 30);
        });
        const directiveEl = document.getElementById('profile-field-directive');
        typeOutText(directiveEl, t.directive.value, 20);
    }, 10);

    return `<div class="flex flex-col lg:flex-row gap-4">
                <div class="w-full lg:w-2/3 flex flex-col">
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">${gridFieldsHtml}</div>
                    ${directiveHtml}
                    ${socialsHtml}
                    ${setupHtml}
                </div>
                ${featuredHtml}
            </div>`;
}

function renderAffinities(t) {
    const renderCategoryContent = (categoryIndex, categoryKey) => {
        const items = staticData.affinities[categoryIndex].items;
        const gridClass = staticData.affinities[categoryIndex].icon === 'fas fa-headphones'
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4'
            : 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4';

        return `
            <div class="${gridClass}">
                ${items.map((item, idx) => {
                    if (item.isEmbed) {
                        return `
                            <div class="border-2 border-gray-800 hover:border-red-500 transition-colors bg-gray-900/50 p-3 sm:p-4">
                                <h3 class="text-white text-sm sm:text-lg font-bold mb-2 sm:mb-3 text-center">${item.name}</h3>
                                <div class="spotify-embed">
                                    ${item.embed}
                                </div>
                            </div>
                        `;
                    }

                    return `
                        <div class="relative group border-2 border-gray-800 hover:border-red-500 transition-colors cursor-pointer" onclick="openAffinityLightbox('${categoryKey}', ${idx})">
                            <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover" />
                            <div class="absolute bottom-0 left-0 w-full p-2 bg-black/70">
                                <p class="text-white text-xs sm:text-sm font-bold truncate">${item.name}</p>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    };

    const buttonsHtml = t.categories.map((cat, index) => `
        <button data-index="${index}" data-aff="${AFFINITY_CATEGORY_KEYS[index]}" aria-selected="${index === 0 ? 'true' : 'false'}" class="affinity-cat-button flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 text-xs sm:text-sm border-b-2 transition-colors duration-200 ${index === 0 ? 'border-red-500 text-white' : 'border-gray-700 text-gray-400 hover:text-white'}">
            <i class="${staticData.affinities[index].icon}"></i>
            <span>${cat.name}</span>
        </button>
    `).join('');

    const panelsHtml = staticData.affinities.map((_, index) => {
        const key = AFFINITY_CATEGORY_KEYS[index];
        const isActive = index === 0;
        return `
            <section class="aff-panel ${isActive ? 'is-active' : 'hidden-panel'}" data-panel="${key}" ${isActive ? '' : 'aria-hidden="true"'}>
                ${renderCategoryContent(index, key)}
            </section>
        `;
    }).join('');

    const html = `
        <div>
            <div class="flex flex-wrap gap-x-2 sm:gap-x-4 gap-y-2 mb-4 sm:mb-6">${buttonsHtml}</div>
            <div id="affinities-content" class="aff-panels">${panelsHtml}</div>
        </div>`;

    setTimeout(() => {
        const wrapper = document.getElementById('affinities-content');
        if (!wrapper) return;

        const buttons = [...document.querySelectorAll('.affinity-cat-button')];
        const panels = [...wrapper.querySelectorAll('.aff-panel')];
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        const getPanel = (key) => wrapper.querySelector(`.aff-panel[data-panel="${key}"]`);

        const syncWrapperHeight = (panel) => {
            if (!panel) return;
            wrapper.style.height = `${panel.scrollHeight}px`;
        };

        let activeKey = AFFINITY_CATEGORY_KEYS[0];
        let pendingLeaveHandler = null;

        const setButtonsState = (nextKey) => {
            buttons.forEach((btn) => {
                const isActive = btn.dataset.aff === nextKey;
                btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
                btn.classList.toggle('border-red-500', isActive);
                btn.classList.toggle('text-white', isActive);
                btn.classList.toggle('border-gray-700', !isActive);
                btn.classList.toggle('text-gray-400', !isActive);
                btn.classList.toggle('hover:text-white', !isActive);
            });
        };

        const switchAff = (nextKey) => {
            if (nextKey === activeKey) return;
            const currentPanel = getPanel(activeKey);
            const nextPanel = getPanel(nextKey);
            if (!currentPanel || !nextPanel) return;

            if (pendingLeaveHandler) {
                currentPanel.removeEventListener('transitionend', pendingLeaveHandler);
                pendingLeaveHandler = null;
            }

            nextPanel.classList.remove('hidden-panel');
            nextPanel.setAttribute('aria-hidden', 'false');
            nextPanel.classList.remove('is-leaving');
            nextPanel.classList.add('is-active');

            currentPanel.classList.remove('is-active');
            currentPanel.classList.add('is-leaving');
            currentPanel.setAttribute('aria-hidden', 'true');

            activeKey = nextKey;
            setButtonsState(activeKey);
            syncWrapperHeight(nextPanel);

            const hideCurrent = () => {
                currentPanel.classList.add('hidden-panel');
                currentPanel.classList.remove('is-leaving');
            };

            if (prefersReducedMotion) {
                hideCurrent();
            } else {
                pendingLeaveHandler = (event) => {
                    if (event.propertyName !== 'opacity') return;
                    currentPanel.removeEventListener('transitionend', pendingLeaveHandler);
                    pendingLeaveHandler = null;
                    hideCurrent();
                };
                currentPanel.addEventListener('transitionend', pendingLeaveHandler);
            }
        };

        panels.forEach((panel) => {
            if (!panel.classList.contains('is-active')) {
                panel.classList.add('hidden-panel');
                panel.setAttribute('aria-hidden', 'true');
            }
        });
        syncWrapperHeight(getPanel(activeKey));

        buttons.forEach((button) => {
            button.addEventListener('click', () => {
                const nextKey = button.dataset.aff;
                if (!nextKey) return;
                switchAff(nextKey);
            }, { passive: true });
        });

        // Throttle via rAF + remove o listener anterior pra não acumular a cada visita à aba
        if (window.__affinitiesResizeHandler) {
            window.removeEventListener('resize', window.__affinitiesResizeHandler);
        }
        let resizeRaf = null;
        window.__affinitiesResizeHandler = () => {
            if (resizeRaf) return;
            resizeRaf = requestAnimationFrame(() => {
                syncWrapperHeight(getPanel(activeKey));
                resizeRaf = null;
            });
        };
        window.addEventListener('resize', window.__affinitiesResizeHandler, { passive: true });
    }, 0);

    return html;
}

function renderRecords(t) {
    const recordsHtml = t.items.map((item, index) => `
        <p class="mb-2 text-sm sm:text-lg text-gray-300">&gt; <span id="record-item-${index}"></span></p>
    `).join('');

    setTimeout(() => {
        t.items.forEach((item, index) => {
            const el = document.getElementById(`record-item-${index}`);
            typeOutText(el, item, 20);
        });
    }, 10);

    return `<div>${recordsHtml}</div>`;
}

function renderGallery() {
    setTimeout(() => bindReactiveParticleEvents('.gallery-reactive-item'), 0);
    return `<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">${staticData.gallery.map((src, idx) => `<div class="gallery-reactive-item border-2 border-gray-800 hover:border-red-500 transition-colors cursor-pointer" onclick="openLightbox(${idx})"><img src="${src}" class="w-full h-auto object-cover" /></div>`).join('')}</div>`;
}

function renderSystemStatus(t) {
    const container = document.getElementById('system-status-container');
    const languagesHtml = t.languages.map((lang, index) => `
        <div>
            <div class="flex justify-between items-center text-gray-400 text-xs sm:text-sm">
                <span>${lang.name}</span>
                <span>${lang.label}</span>
            </div>
            <div class="w-full bg-gray-800 border border-gray-700 h-1 sm:h-2 mt-1">
                <div class="bg-red-600 h-full" style="width: ${staticData.languageLevels[index]};"></div>
            </div>
        </div>
    `).join('');

    container.innerHTML = `
        <div class="border-t-2 border-red-900/50 pt-3 sm:pt-4 mt-3 sm:mt-4">
            <h3 class="text-base sm:text-lg text-red-500 text-glow mb-2 sm:mb-3">${t.title}</h3>
            <div class="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                <div>
                    <p class="text-gray-400">${t.chaos}:</p>
                    <div class="w-full bg-gray-800 border border-gray-700 h-3 sm:h-4 mt-1">
                        <div id="chaos-bar" class="bg-red-600 h-full" style="width: 60%;"></div>
                    </div>
                </div>
                <div class="flex justify-between items-center">
                    <p class="text-gray-400">${t.connection}:</p>
                    <div class="flex items-center gap-1 sm:gap-2">
                        <span class="text-green-400 text-xs sm:text-sm">STABLE</span>
                        <div class="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-green-400 rounded-full animate-pulse"></div>
                    </div>
                </div>
                <div class="flex justify-between items-center">
                    <p class="text-gray-400">${t.sync}:</p>
                    <p id="sync-time" class="text-gray-300 text-xs sm:text-sm"></p>
                </div>
                <div class="pt-2">
                     <h4 class="text-sm sm:text-md text-red-500 mb-2">${t.languagesTitle}</h4>
                     <div class="space-y-1.5 sm:space-y-2">${languagesHtml}</div>
                </div>
            </div>
        </div>`;

    const chaosBar = document.getElementById('chaos-bar');
    const widths = ['60%', '75%', '65%'];
    let i = 0;

    if (state.chaosIntervalId) {
        clearInterval(state.chaosIntervalId);
    }

    state.chaosIntervalId = setInterval(() => {
        if (chaosBar) {
            chaosBar.style.transition = 'width 2s ease-in-out';
            chaosBar.style.width = widths[i];
            i = (i + 1) % widths.length;
        }
    }, 2000);
}