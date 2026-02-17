// --- FUNÇÕES DE RENDERIZAÇÃO ---
function typeOutText(element, text, speed = 30) {
    if (!element) return;
    let i = 0;
    element.innerHTML = '';
    const intervalId = setInterval(() => {
        if (i >= text.length) {
            clearInterval(intervalId);
            const cursor = element.querySelector('.cursor');
            if (cursor) cursor.remove();
        } else {
            element.innerHTML = text.substring(0, i + 1) + '<span class="animate-pulse cursor">_</span>';
            i++;
        }
    }, speed);
}

const imageViewerStates = {};


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


function ensureImageViewerModal(prefix) {
    const modalId = `${prefix}-modal`;
    if (document.getElementById(modalId)) return;

    const modal = document.createElement('div');
    modal.id = modalId;
    modal.style.display = 'none';
    modal.innerHTML = `
        <div id="${prefix}-backdrop" class="lightbox-backdrop">
            <div class="lightbox-toolbar">
                <button id="${prefix}-reset" class="lightbox-tool-btn" type="button">Reset</button>
                <button id="${prefix}-fit" class="lightbox-tool-btn" type="button">Ajustar</button>
                <button id="${prefix}-full" class="lightbox-tool-btn" type="button">100%</button>
            </div>
            <button id="${prefix}-close" class="lightbox-close" type="button">&times;</button>
            <button id="${prefix}-prev" class="lightbox-nav-btn lightbox-nav-prev" type="button">&#8592;</button>
            <div id="${prefix}-viewport" class="lightbox-viewport">
                <img id="${prefix}-img" src="" class="lightbox-image" alt="" draggable="false" />
            </div>
            <button id="${prefix}-next" class="lightbox-nav-btn lightbox-nav-next" type="button">&#8594;</button>
        </div>
    `;
    document.body.appendChild(modal);
}

function setupImageViewerControls(prefix) {
    const modal = document.getElementById(`${prefix}-modal`);
    if (!modal || modal.viewerReady) return;
    modal.viewerReady = true;

    const img = document.getElementById(`${prefix}-img`);
    const viewport = document.getElementById(`${prefix}-viewport`);
    const resetBtn = document.getElementById(`${prefix}-reset`);
    const fitBtn = document.getElementById(`${prefix}-fit`);
    const fullBtn = document.getElementById(`${prefix}-full`);

    const state = imageViewerStates[prefix] = {
        scale: 1,
        tx: 0,
        ty: 0,
        dragging: false,
        pointerId: null,
        startX: 0,
        startY: 0,
        startTx: 0,
        startTy: 0
    };

    const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

    const applyTransform = () => {
        img.style.transform = `translate(${state.tx}px, ${state.ty}px) scale(${state.scale})`;
        viewport.classList.toggle('is-dragging', state.dragging);
        viewport.classList.toggle('is-zoomed', state.scale > 1.001);
    };

    const centerImage = () => {
        state.tx = 0;
        state.ty = 0;
        applyTransform();
    };

    const fitImage = () => {
        if (!img.naturalWidth || !img.naturalHeight) return;
        const pad = 24;
        const maxW = Math.max(1, viewport.clientWidth - pad);
        const maxH = Math.max(1, viewport.clientHeight - pad);
        const fitScale = Math.min(maxW / img.naturalWidth, maxH / img.naturalHeight);
        state.scale = clamp(fitScale || 1, 1, 4);
        centerImage();
    };

    const resetImage = () => {
        state.scale = 1;
        centerImage();
    };

    img.addEventListener('load', fitImage);
    resetBtn.addEventListener('click', resetImage);
    fitBtn.addEventListener('click', fitImage);
    fullBtn.addEventListener('click', () => {
        state.scale = 1;
        centerImage();
    });

    viewport.addEventListener('wheel', (e) => {
        e.preventDefault();
        const step = e.deltaY > 0 ? -0.12 : 0.12;
        state.scale = clamp(state.scale + step, 1, 4);
        applyTransform();
    }, { passive: false });

    viewport.addEventListener('pointerdown', (e) => {
        if (e.button !== 0 && e.pointerType === 'mouse') return;
        state.dragging = true;
        state.pointerId = e.pointerId;
        state.startX = e.clientX;
        state.startY = e.clientY;
        state.startTx = state.tx;
        state.startTy = state.ty;
        viewport.setPointerCapture(e.pointerId);
        applyTransform();
    });

    viewport.addEventListener('pointermove', (e) => {
        if (!state.dragging || e.pointerId !== state.pointerId) return;
        state.tx = state.startTx + (e.clientX - state.startX);
        state.ty = state.startTy + (e.clientY - state.startY);
        applyTransform();
    });

    const endDrag = (e) => {
        if (!state.dragging || e.pointerId !== state.pointerId) return;
        state.dragging = false;
        if (viewport.hasPointerCapture(e.pointerId)) {
            viewport.releasePointerCapture(e.pointerId);
        }
        applyTransform();
    };

    viewport.addEventListener('pointerup', endDrag);
    viewport.addEventListener('pointercancel', endDrag);
    window.addEventListener('resize', () => {
        if (modal.style.display === 'block') fitImage();
    });

    modal.fitViewerImage = fitImage;
    modal.resetViewerImage = resetImage;
}

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
                    <a href="${social.url}" target="_blank" rel="noopener noreferrer" class="flex items-center gap-2 sm:gap-3 text-gray-400 hover:text-red-500 transition-colors bg-gray-800/70 p-2 sm:p-3 border border-transparent hover:border-red-700">
                        <i class="${social.icon} w-4 sm:w-5 text-center"></i>
                        <div class="min-w-0 flex-1">
                            <p class="font-bold text-white text-xs sm:text-sm truncate">${social.name}</p>
                            <p class="text-xs truncate">${social.user}</p>
                        </div>
                    </a>
                `).join('')}
            </div>
        </div>`;

    const setupListHtml = `
        <div class="setup-list-view grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            ${staticData.setup.map((item, index) => `
                <div class="flex items-center gap-2 sm:gap-3 bg-gray-800/70 p-2 sm:p-3 border border-transparent">
                    <i class="fas ${item.icon} text-red-500 w-4 sm:w-5 text-center"></i>
                    <div class="min-w-0 flex-1">
                        <p class="font-bold text-white text-xs truncate">${t.setup[index].label}</p>
                        <p class="text-xs text-gray-400 truncate">${item.value}</p>
                    </div>
                </div>
            `).join('')}
        </div>
    `;

    const blueprintSections = (staticData.setupBlueprint && staticData.setupBlueprint.sections) || [];
    const setupBlueprintHtml = `
        <div class="setup-blueprint-view" aria-label="Setup blueprint">
            ${blueprintSections.map(section => `
                <div class="setup-blueprint-section">
                    <p class="setup-blueprint-title">${section.name}</p>
                    <div class="setup-blueprint-slots">
                        ${(section.slots || []).map(slot => `
                            <div class="setup-blueprint-slot">
                                <span class="setup-blueprint-label">${slot.label}</span>
                                <span class="setup-blueprint-value">${slot.value}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `).join('')}
        </div>
    `;

    const setupHtml = `
        <div class="mt-4 lg:col-span-2 bg-gray-900/50 p-3 sm:p-4 border border-red-800/50">
            <p class="text-red-500 font-bold text-xs sm:text-sm uppercase tracking-widest mb-3 sm:mb-4">${t.setupTitle}</p>
            <div class="setup-blueprint">
                ${setupBlueprintHtml}
            </div>
            <div class="setup-list">
                ${setupListHtml}
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
    let activeCategoryIndex = 0;
    // Lightbox para afinidades (compartilhado com galeria)
    ensureImageViewerModal('affinity-lightbox');
    setupImageViewerControls('affinity-lightbox');
    // Função para abrir o lightbox de afinidades
    window.openAffinityLightbox = function(idx) {
        const modal = document.getElementById('affinity-lightbox-modal');
        const img = document.getElementById('affinity-lightbox-img');
        const items = staticData.affinities[activeCategoryIndex].items.filter(item => item.image);
        img.src = items[idx].image;
        img.alt = items[idx].name || 'Imagem de afinidade';
        modal.style.display = 'block';
        modal.setAttribute('data-idx', idx);
        modal.setAttribute('data-cat', activeCategoryIndex);
        modal.fitViewerImage();
    };
    // Função para fechar
    window.closeAffinityLightbox = function() {
        document.getElementById('affinity-lightbox-modal').style.display = 'none';
    };
    // Função para navegar
    window.affinityLightboxNav = function(dir) {
        const modal = document.getElementById('affinity-lightbox-modal');
        let idx = parseInt(modal.getAttribute('data-idx'));
        const cat = parseInt(modal.getAttribute('data-cat'));
        const items = staticData.affinities[cat].items.filter(item => item.image);
        idx = (idx + dir + items.length) % items.length;
        const img = document.getElementById('affinity-lightbox-img');
        img.src = items[idx].image;
        img.alt = items[idx].name || 'Imagem de afinidade';
        modal.setAttribute('data-idx', idx);
        modal.fitViewerImage();
    };
    // Adicionar listeners (uma vez só)
    setTimeout(() => {
        const modal = document.getElementById('affinity-lightbox-modal');
        if (modal && !modal.hasListeners) {
            modal.hasListeners = true;
            document.getElementById('affinity-lightbox-close').onclick = window.closeAffinityLightbox;
            document.getElementById('affinity-lightbox-backdrop').onclick = (e) => { if (e.target.id === 'affinity-lightbox-backdrop') window.closeAffinityLightbox(); };
            document.getElementById('affinity-lightbox-prev').onclick = (e) => { e.stopPropagation(); window.affinityLightboxNav(-1); };
            document.getElementById('affinity-lightbox-next').onclick = (e) => { e.stopPropagation(); window.affinityLightboxNav(1); };
            document.addEventListener('keydown', (e) => {
                if (modal.style.display === 'block') {
                    if (e.key === 'Escape') window.closeAffinityLightbox();
                    if (e.key === 'ArrowLeft') window.affinityLightboxNav(-1);
                    if (e.key === 'ArrowRight') window.affinityLightboxNav(1);
                }
            });
        }
    }, 0);

    const renderContent = () => {
        const items = staticData.affinities[activeCategoryIndex].items;
        return items.map((item, idx) => {
            if (item.isEmbed) {
                return `
                    <div class="border-2 border-gray-800 hover:border-red-500 transition-colors bg-gray-900/50 p-3 sm:p-4">
                        <h3 class="text-white text-sm sm:text-lg font-bold mb-2 sm:mb-3 text-center">${item.name}</h3>
                        <div class="spotify-embed">
                            ${item.embed}
                        </div>
                    </div>
                `;
            } else {
                return `
                    <div class="relative group border-2 border-gray-800 hover:border-red-500 transition-colors cursor-pointer" onclick="openAffinityLightbox(${idx})">
                        <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover" />
                        <div class="absolute bottom-0 left-0 w-full p-2 bg-black/70">
                            <p class="text-white text-xs sm:text-sm font-bold truncate">${item.name}</p>
                        </div>
                    </div>
                `;
            }
        }).join('');
    };

    const buttonsHtml = t.categories.map((cat, index) => `
        <button data-index="${index}" class="affinity-cat-button flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 text-xs sm:text-sm border-b-2 transition-colors duration-200 ${index === 0 ? 'border-red-500 text-white' : 'border-gray-700 text-gray-400 hover:text-white'}">
            <i class="${staticData.affinities[index].icon}"></i>
            <span>${cat.name}</span>
        </button>
    `).join('');

    const html = `
        <div>
            <div class="flex flex-wrap gap-x-2 sm:gap-x-4 gap-y-2 mb-4 sm:mb-6">${buttonsHtml}</div>
            <div id="affinities-content" class="${staticData.affinities[activeCategoryIndex].icon === 'fas fa-headphones' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'} gap-3 sm:gap-4">${renderContent()}</div>
        </div>`;

    setTimeout(() => {
        document.querySelectorAll('.affinity-cat-button').forEach(button => {
            button.addEventListener('click', () => {
                document.querySelectorAll('.affinity-cat-button').forEach(btn => {
                    btn.classList.remove('border-red-500', 'text-white');
                    btn.classList.add('border-gray-700', 'text-gray-400', 'hover:text-white');
                });
                button.classList.add('border-red-500', 'text-white');
                button.classList.remove('border-gray-700', 'text-gray-400', 'hover:text-white');

                activeCategoryIndex = parseInt(button.dataset.index);
                document.getElementById('affinities-content').innerHTML = renderContent();
            });
        });
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
    // Lightbox container (inserido apenas uma vez)
    ensureImageViewerModal('lightbox');
    setupImageViewerControls('lightbox');

    // Função para abrir o lightbox
    window.openLightbox = function(idx) {
        const modal = document.getElementById('lightbox-modal');
        const img = document.getElementById('lightbox-img');
        img.src = staticData.gallery[idx];
        img.alt = 'Imagem da galeria';
        modal.style.display = 'block';
        modal.setAttribute('data-idx', idx);
        modal.fitViewerImage();
    };
    // Função para fechar
    window.closeLightbox = function() {
        document.getElementById('lightbox-modal').style.display = 'none';
    };
    // Função para navegar
    window.lightboxNav = function(dir) {
        const modal = document.getElementById('lightbox-modal');
        let idx = parseInt(modal.getAttribute('data-idx'));
        idx = (idx + dir + staticData.gallery.length) % staticData.gallery.length;
        document.getElementById('lightbox-img').src = staticData.gallery[idx];
        modal.setAttribute('data-idx', idx);
        modal.fitViewerImage();
    };
    // Adicionar listeners (uma vez só)
    setTimeout(() => {
        const modal = document.getElementById('lightbox-modal');
        if (modal && !modal.hasListeners) {
            modal.hasListeners = true;
            document.getElementById('lightbox-close').onclick = window.closeLightbox;
            document.getElementById('lightbox-backdrop').onclick = (e) => { if (e.target.id === 'lightbox-backdrop') window.closeLightbox(); };
            document.getElementById('lightbox-prev').onclick = (e) => { e.stopPropagation(); window.lightboxNav(-1); };
            document.getElementById('lightbox-next').onclick = (e) => { e.stopPropagation(); window.lightboxNav(1); };
            document.addEventListener('keydown', (e) => {
                if (modal.style.display === 'block') {
                    if (e.key === 'Escape') window.closeLightbox();
                    if (e.key === 'ArrowLeft') window.lightboxNav(-1);
                    if (e.key === 'ArrowRight') window.lightboxNav(1);
                }
            });
        }
    }, 0);

    // Renderizar galeria normalmente, mas com onclick para abrir o lightbox
    setTimeout(() => bindReactiveParticleEvents('.gallery-reactive-item'), 0);
    return `<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">${staticData.gallery.map((src,idx) => `<div class="gallery-reactive-item border-2 border-gray-800 hover:border-red-500 transition-colors cursor-pointer" onclick="openLightbox(${idx})"><img src="${src}" class="w-full h-auto object-cover" /></div>`).join('')}</div>`;
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

/* ===========================
   ✅ NOVA SEÇÃO: WISHLIST
   - ESTÁTICA (sem botão, sem localStorage)
   - status definido só no code (data.js)
   =========================== */
function renderWishlist(t) {
    const items = staticData.wishlistItems || [];
    const sortedItems = [...items].sort((a, b) => {
        const aPending = a.status === 'pendente' ? 0 : 1;
        const bPending = b.status === 'pendente' ? 0 : 1;
        if (aPending !== bPending) return aPending - bPending;
        const aPriority = Number(a.priority) || 5;
        const bPriority = Number(b.priority) || 5;
        if (aPriority !== bPriority) return aPriority - bPriority;
        return (a.name || '').localeCompare(b.name || '');
    });

    const nextTarget = sortedItems.find(it => it.status === 'pendente');

    const total = items.reduce((acc, it) => acc + (Number(it.price) || 0), 0);
    const achievedTotal = items
        .filter(it => it.status === 'conquistado')
        .reduce((acc, it) => acc + (Number(it.price) || 0), 0);

    const achievedCount = items.filter(it => it.status === 'conquistado').length;
    const progressPct = items.length ? Math.round((achievedCount / items.length) * 100) : 0;

    ensureImageViewerModal('wishlist-lightbox');
    setupImageViewerControls('wishlist-lightbox');

    window.openWishlistLightbox = function(idx) {
        const modal = document.getElementById('wishlist-lightbox-modal');
        const img = document.getElementById('wishlist-lightbox-img');
        img.src = sortedItems[idx].image;
        img.alt = sortedItems[idx].name || 'Imagem da wishlist';
        modal.style.display = 'block';
        modal.setAttribute('data-idx', idx);
        modal.fitViewerImage();
    };

    window.closeWishlistLightbox = function() {
        document.getElementById('wishlist-lightbox-modal').style.display = 'none';
    };

    window.wishlistLightboxNav = function(dir) {
        const modal = document.getElementById('wishlist-lightbox-modal');
        let idx = parseInt(modal.getAttribute('data-idx'));
        idx = (idx + dir + sortedItems.length) % sortedItems.length;
        const img = document.getElementById('wishlist-lightbox-img');
        img.src = sortedItems[idx].image;
        img.alt = sortedItems[idx].name || 'Imagem da wishlist';
        modal.setAttribute('data-idx', idx);
        modal.fitViewerImage();
    };

    setTimeout(() => {
        const modal = document.getElementById('wishlist-lightbox-modal');
        if (modal && !modal.hasListeners) {
            modal.hasListeners = true;
            document.getElementById('wishlist-lightbox-close').onclick = window.closeWishlistLightbox;
            document.getElementById('wishlist-lightbox-backdrop').onclick = (e) => { if (e.target.id === 'wishlist-lightbox-backdrop') window.closeWishlistLightbox(); };
            document.getElementById('wishlist-lightbox-prev').onclick = (e) => { e.stopPropagation(); window.wishlistLightboxNav(-1); };
            document.getElementById('wishlist-lightbox-next').onclick = (e) => { e.stopPropagation(); window.wishlistLightboxNav(1); };
            document.addEventListener('keydown', (e) => {
                if (modal.style.display === 'block') {
                    if (e.key === 'Escape') window.closeWishlistLightbox();
                    if (e.key === 'ArrowLeft') window.wishlistLightboxNav(-1);
                    if (e.key === 'ArrowRight') window.wishlistLightboxNav(1);
                }
            });
        }
    }, 0);

    const summaryHtml = `
        <div class="bg-gray-900/50 p-3 sm:p-4 border border-red-800/50 mb-4">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <p class="text-gray-300 text-sm sm:text-base">
                    <span class="text-red-400 font-bold">${t.progress}:</span>
                    ${achievedCount}/${items.length} (${progressPct}%)
                </p>
                <p class="text-gray-300 text-sm sm:text-base">
                    <span class="text-red-400 font-bold">${t.total}:</span>
                    R$ ${achievedTotal} / R$ ${total}
                </p>
            </div>
            <div class="w-full bg-gray-800 border border-gray-700 h-3 sm:h-4 mt-3">
                <div class="bg-red-600 h-full wishlist-bar" style="width:${progressPct}%;"></div>
            </div>
            <div class="mt-3 border border-red-900/50 bg-black/30 p-2.5">
                <p class="text-red-400 text-xs sm:text-sm uppercase tracking-wider">${t.nextTarget}</p>
                <p class="text-gray-200 text-sm sm:text-base mt-1">${nextTarget ? `${nextTarget.name} (P${nextTarget.priority || 5})` : 'N/A'}</p>
            </div>
        </div>
    `;

    const cardsHtml = sortedItems.map((it, idx) => {
        const isAchieved = it.status === "conquistado";

        const badgeClass = isAchieved
            ? "text-green-400 border-green-500/50"
            : "text-yellow-400 border-yellow-500/50";

        const cardClass = isAchieved ? "wishlist-achieved" : "wishlist-pending";

        const badgeLabel = isAchieved ? t.achieved : t.pending;

        return `
            <div class="wishlist-reactive-card bg-gray-900/50 border border-red-800/50 p-3 sm:p-4 flex flex-col sm:flex-row gap-3 sm:gap-4 ${cardClass}">
                <div class="wishlist-thumb flex-shrink-0 border border-gray-800 overflow-hidden bg-black/40">
                    <img src="${it.image}" alt="${it.name}" class="w-full h-full object-cover cursor-pointer" onclick="openWishlistLightbox(${idx})" />
                </div>

                <div class="min-w-0 flex-1">
                    <div class="flex items-start justify-between gap-3">
                        <div class="min-w-0">
                            <p class="text-white font-bold text-sm sm:text-base truncate">${it.name}</p>
                            <p class="text-gray-400 text-xs sm:text-sm truncate">${it.category}</p>
                            <p class="text-gray-500 text-xs sm:text-sm truncate">${it.model || ''}</p>
                        </div>

                        <span class="text-xs sm:text-sm px-2 py-1 border ${badgeClass}">
                            ${badgeLabel}
                        </span>
                    </div>

                    <div class="mt-2 flex items-center justify-between gap-2">
                        <p class="text-gray-300 text-xs sm:text-sm">
                            <span class="text-red-400 font-bold">R$ ${it.price}</span>
                        </p>
                        <span class="text-[11px] sm:text-xs px-2 py-1 border border-red-800/60 text-red-300">${t.priority}: ${it.priority || 5}</span>
                    </div>
                    ${it.note ? `<p class="text-gray-500 text-xs mt-1">${it.note}</p>` : ''}
                </div>
            </div>
        `;
    }).join('');

    setTimeout(() => bindReactiveParticleEvents('.wishlist-reactive-card, .gallery-reactive-item'), 0);

    return `
        <div>
            ${summaryHtml}
            <div class="grid grid-cols-1 gap-3 sm:gap-4">
                ${cardsHtml}
            </div>
        </div>
    `;
}


function renderDiagnostics() {
    return `
        <div class="bg-gray-900/50 p-3 sm:p-4 border border-red-800/50">
            <p class="text-gray-400 text-sm">Carregando diagnóstico...</p>
            <div id="diagnostics-container" class="mt-3 space-y-3"></div>
            <div class="mt-4 flex flex-wrap gap-2">
                <button id="diag-clear-cache" class="px-3 py-2 border border-red-800/70 text-red-300 hover:bg-red-500/10">Limpar cache</button>
                <button id="diag-reload" class="px-3 py-2 border border-red-800/70 text-red-300 hover:bg-red-500/10">Recarregar/Atualizar</button>
            </div>
            <p class="text-xs text-gray-500 mt-2">Se atualização não aplicar, tente hard reload (Ctrl/Cmd + Shift + R).</p>
        </div>
    `;
}
