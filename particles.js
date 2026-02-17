// --- LÓGICA DO CANVAS DE FUNDO ---
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
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
        ctx.fill();
    }
    
    update() {
        if (this.x > canvas.width || this.x < 0) {
            this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0) {
            this.directionY = -this.directionY;
        }
        
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx*dx + dy*dy);
        
        if (distance < mouse.radius + this.size) {
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
        
        applyAttractorForce(this);

        const maxSpeed = currentSettings.maxSpeed;
        const speedMagnitude = Math.hypot(this.directionX, this.directionY);
        if (speedMagnitude > maxSpeed && speedMagnitude > 0) {
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
    wishlist: { speed: 1.02, connectDistance: 165, densityDivisor: 9000, maxSpeed: 0.72 },
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
    const maxBoost = 0.9 * Math.max(0.5, intensity);

    for (let i = 0; i < particlesArray.length; i++) {
        const particle = particlesArray[i];
        const dx = particle.x - x;
        const dy = particle.y - y;
        const distance = Math.hypot(dx, dy);

        if (distance > radius) continue;

        const distanceRatio = 1 - (distance / radius);
        const baseAngle = distance > 0 ? Math.atan2(dy, dx) : Math.random() * Math.PI * 2;
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
    const distance = Math.hypot(dx, dy);
    const range = 180;
    if (distance === 0 || distance > range) return;

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
    let directionX = (Math.random() * .4) - .2;
    let directionY = (Math.random() * .4) - .2;
    let color = 'rgba(255, 0, 0, 0.5)';
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
        radius: (canvas.height/100) * (canvas.width/100)
    };

    currentSettings = cloneSettings(baseSettings);
    targetSettings = cloneSettings(baseSettings);

    window.ParticlesAPI = {
        setMode,
        attractTo,
        burst
    };


    window.addEventListener('mousemove', (event) => {
        mouse.x = event.x;
        mouse.y = event.y;
    });

    window.addEventListener('mouseout', () => {
        mouse.x = undefined;
        mouse.y = undefined;
    });

    window.addEventListener('resize', () => {
        canvas.width = innerWidth;
        canvas.height = innerHeight;
        mouse.radius = ((canvas.height/100) * (canvas.width/100));
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
    
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x))
            + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
            
            if (distance < currentSettings.connectDistance * currentSettings.connectDistance) {
                opacityValue = 1 - (distance/20000);
                ctx.strokeStyle = `rgba(255, 0, 0, ${opacityValue})`;
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
