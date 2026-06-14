// --- LÓGICA DO CANVAS DE FUNDO ---

const PI2 = Math.PI * 2; // Cache do cálculo do círculo para otimização
const PARTICLE_COLORS = ['rgba(57, 197, 187, 0.86)', 'rgba(0, 229, 255, 0.78)', 'rgba(126, 231, 255, 0.72)'];
const MUSIC_NOTES = ['♪', '♫', '♩', '♬'];
let noteParticles = [];
const CONNECT_OPACITY_BUCKETS = 6; // Quantas faixas de opacidade usar nas linhas de conexão

class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, PI2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update() {
        // Colisão com as bordas
        if (this.x > canvas.width || this.x < 0) {
            this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0) {
            this.directionY = -this.directionY;
        }

        // Interação com o mouse (Otimizado sem Math.sqrt)
        if (mouse.x != null && mouse.y != null) {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distanceSq = dx * dx + dy * dy;
            let interactionRadius = mouse.radius + this.size;

            if (distanceSq < interactionRadius * interactionRadius) {
                if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
                    this.x += 5;
                }
                if (mouse.x > this.x && this.x > this.size * 10) {
                    this.x -= 5;
                }
                if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
                    this.y += 5;
                }
                if (mouse.y > this.y && this.y > this.size * 10) {
                    this.y -= 5;
                }
            }
        }

        applyAttractorForce(this);

        // Limite de velocidade (Otimizado usando distâncias ao quadrado)
        const maxSpeed = currentSettings.maxSpeed;
        const speedSq = this.directionX * this.directionX + this.directionY * this.directionY;
        const maxSpeedSq = maxSpeed * maxSpeed;

        if (speedSq > maxSpeedSq && speedSq > 0) {
            const speedMagnitude = Math.sqrt(speedSq); // Só calcula a raiz se precisar ajustar
            const clampRatio = maxSpeed / speedMagnitude;
            this.directionX *= clampRatio;
            this.directionY *= clampRatio;
        }

        this.x += this.directionX * currentSettings.speed;
        this.y += this.directionY * currentSettings.speed;
        this.draw();
    }
}

class NoteParticle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height * (0.2 + Math.random() * 0.7);
        this.char = MUSIC_NOTES[Math.floor(Math.random() * MUSIC_NOTES.length)];
        this.color = PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)];
        this.size = 13 + Math.random() * 9;
        this.speedY = 0.35 + Math.random() * 0.35;
        this.swayOffset = Math.random() * Math.PI * 2;
        this.life = 0;
        this.maxLife = 110 + Math.random() * 90;
        this.opacity = 0;
    }

    update() {
        this.life++;
        this.y -= this.speedY;
        this.x += Math.sin(this.life * 0.05 + this.swayOffset) * 0.5;

        if (this.life < 20) {
            this.opacity = this.life / 20;
        } else if (this.life > this.maxLife - 30) {
            this.opacity = (this.maxLife - this.life) / 30;
        } else {
            this.opacity = 0.65;
        }

        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.font = `${this.size}px VT323, monospace`;
        ctx.fillStyle = this.color;
        ctx.fillText(this.char, this.x, this.y);
        ctx.restore();

        return this.life < this.maxLife;
    }
}

let canvas, ctx, particlesArray, mouse;
let currentSettings, targetSettings;
let activeAttractor = null;
let lastAttractCall = 0;
let resizeTimeoutId = null;

const baseSettings = {
    densityDivisor: 9000,
    speed: 1,
    connectDistance: 170,
    maxSpeed: 0.7
};

const modeSettings = {
    default: { speed: 1, connectDistance: 170, densityDivisor: 9000, maxSpeed: 0.7 },
    profile: { speed: 0.92, connectDistance: 180, densityDivisor: 9400, maxSpeed: 0.66 },
    gallery: { speed: 1.08, connectDistance: 155, densityDivisor: 8600, maxSpeed: 0.78 },
    records: { speed: 0.88, connectDistance: 185, densityDivisor: 9800, maxSpeed: 0.64 }
};

function cloneSettings(settings) {
    return { ...settings };
}

function setMode(sectionName) {
    const mode = modeSettings[sectionName] || modeSettings.default;
    targetSettings = cloneSettings(mode);
}

function attractTo(x, y, strength = 1, duration = 400) {
    const now = performance.now();
    if (now - lastAttractCall < 80) return;
    lastAttractCall = now;

    activeAttractor = {
        x,
        y,
        strength,
        expiresAt: now + Math.max(120, duration)
    };
}

function burst(x, y, intensity = 1) {
    if (!particlesArray || !particlesArray.length) return;
    const radius = 150;
    const radiusSq = radius * radius;
    const maxBoost = 0.9 * Math.max(0.5, intensity);

    for (let i = 0; i < particlesArray.length; i++) {
        const particle = particlesArray[i];
        const dx = particle.x - x;
        const dy = particle.y - y;
        const distanceSq = dx * dx + dy * dy;

        if (distanceSq > radiusSq) continue;

        const distance = Math.sqrt(distanceSq);
        const distanceRatio = 1 - (distance / radius);
        const baseAngle = distance > 0 ? Math.atan2(dy, dx) : Math.random() * PI2;
        const boost = maxBoost * distanceRatio;

        particle.directionX += Math.cos(baseAngle) * boost;
        particle.directionY += Math.sin(baseAngle) * boost;
    }
}

function spawnNote() {
    if (noteParticles.length < 5 && Math.random() < 0.004) {
        noteParticles.push(new NoteParticle());
    }
}

function applyAttractorForce(particle) {
    if (!activeAttractor) return;

    const now = performance.now();
    if (now > activeAttractor.expiresAt) {
        activeAttractor = null;
        return;
    }

    const dx = activeAttractor.x - particle.x;
    const dy = activeAttractor.y - particle.y;
    const distanceSq = dx * dx + dy * dy;
    const range = 180;
    const rangeSq = range * range;

    if (distanceSq === 0 || distanceSq > rangeSq) return;

    const distance = Math.sqrt(distanceSq);
    const force = 0.018 * activeAttractor.strength * (1 - (distance / range));

    particle.directionX += (dx / distance) * force;
    particle.directionY += (dy / distance) * force;
}

function updateSettingsSmoothly() {
    if (!currentSettings || !targetSettings) return;
    const easing = 0.06;
    Object.keys(targetSettings).forEach((key) => {
        currentSettings[key] += (targetSettings[key] - currentSettings[key]) * easing;
    });
}

function getTargetParticleCount() {
    return Math.max(24, Math.floor((canvas.height * canvas.width) / currentSettings.densityDivisor));
}

function reconcileParticleCount() {
    const targetCount = getTargetParticleCount();
    if (particlesArray.length < targetCount) {
        particlesArray.push(createParticle());
    } else if (particlesArray.length > targetCount) {
        particlesArray.pop();
    }
}

function createParticle() {
    let size = (Math.random() * 2) + 1;
    let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
    let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
    let directionX = (Math.random() * 0.4) - 0.2;
    let directionY = (Math.random() * 0.4) - 0.2;
    let color = PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)];
    return new Particle(x, y, directionX, directionY, size, color);
}

function initParticles() {
    canvas = document.getElementById('particle-canvas');
    ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    mouse = {
        x: null,
        y: null,
        radius: (canvas.height / 100) * (canvas.width / 100)
    };

    currentSettings = cloneSettings(baseSettings);
    targetSettings = cloneSettings(baseSettings);

    window.ParticlesAPI = {
        setMode,
        attractTo,
        burst
    };

    window.addEventListener('mousemove', (event) => {
        mouse.x = event.clientX;
        mouse.y = event.clientY;
    });

    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Debounce: evita recriar o array de partículas em cada pixel de redimensionamento
    window.addEventListener('resize', () => {
        if (resizeTimeoutId) clearTimeout(resizeTimeoutId);
        resizeTimeoutId = setTimeout(() => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            mouse.radius = ((canvas.height / 100) * (canvas.width / 100));
            init();
            resizeTimeoutId = null;
        }, 150);
    });

    init();
    animate();
}

function init() {
    particlesArray = [];
    let numberOfParticles = getTargetParticleCount();

    for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(createParticle());
    }
}

// Conecta partículas próximas, agrupando as linhas em "baldes" de opacidade
// para minimizar o número de chamadas a ctx.stroke() por frame.
function connect() {
    const maxConnectDistSq = currentSettings.connectDistance * currentSettings.connectDistance;

    // Cada balde guarda pares de índices [a, b, a, b, ...]
    const buckets = [];
    for (let i = 0; i < CONNECT_OPACITY_BUCKETS; i++) buckets.push([]);

    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a + 1; b < particlesArray.length; b++) {
            const dx = particlesArray[a].x - particlesArray[b].x;
            const dy = particlesArray[a].y - particlesArray[b].y;
            const distanceSq = dx * dx + dy * dy;

            if (distanceSq < maxConnectDistSq) {
                let opacity = 1 - (distanceSq / 20000);
                if (opacity <= 0) continue;
                if (opacity > 1) opacity = 1;

                let bucketIndex = Math.floor(opacity * CONNECT_OPACITY_BUCKETS);
                if (bucketIndex >= CONNECT_OPACITY_BUCKETS) bucketIndex = CONNECT_OPACITY_BUCKETS - 1;

                buckets[bucketIndex].push(a, b);
            }
        }
    }

    ctx.lineWidth = 1;
    for (let i = 0; i < CONNECT_OPACITY_BUCKETS; i++) {
        const segments = buckets[i];
        if (!segments.length) continue;

        const opacity = (i + 1) / CONNECT_OPACITY_BUCKETS;
        ctx.strokeStyle = `rgba(0, 229, 255, ${opacity.toFixed(2)})`;
        ctx.beginPath();

        for (let s = 0; s < segments.length; s += 2) {
            const pa = particlesArray[segments[s]];
            const pb = particlesArray[segments[s + 1]];
            ctx.moveTo(pa.x, pa.y);
            ctx.lineTo(pb.x, pb.y);
        }

        ctx.stroke();
    }
}

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    updateSettingsSmoothly();
    reconcileParticleCount();

    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }

    connect();

    spawnNote();
    noteParticles = noteParticles.filter(note => note.update());
}