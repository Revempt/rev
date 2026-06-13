// --- LÓGICA DO CANVAS DE FUNDO ---

const PI2 = Math.PI * 2; // Cache do cálculo do círculo para otimização

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

let canvas, ctx, particlesArray, mouse;
let currentSettings, targetSettings;
let activeAttractor = null;
let lastAttractCall = 0;

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
    let color = ['rgba(57, 197, 187, 0.86)', 'rgba(0, 229, 255, 0.78)', 'rgba(126, 231, 255, 0.72)'][Math.floor(Math.random() * 3)];
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

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        mouse.radius = ((canvas.height / 100) * (canvas.width / 100));
        init();
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

function connect() {
    let opacityValue = 1;
    
    // Otimização: Calcular a distância máxima ao quadrado FORA do loop!
    const maxConnectDistSq = currentSettings.connectDistance * currentSettings.connectDistance;
    
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a + 1; b < particlesArray.length; b++) { // Iniciando de a+1 para evitar checar a partícula com ela mesma
            let dx = particlesArray[a].x - particlesArray[b].x;
            let dy = particlesArray[a].y - particlesArray[b].y;
            let distanceSq = dx * dx + dy * dy;
            
            if (distanceSq < maxConnectDistSq) {
                // A fórmula do opacity foi ajustada suavemente para usar a distância ao quadrado
                opacityValue = 1 - (distanceSq / 20000); 
                
                ctx.strokeStyle = `rgba(0, 229, 255, ${opacityValue})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, innerWidth, innerHeight);

    updateSettingsSmoothly();
    reconcileParticleCount();
    
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
    
    connect();
}