const AudioContext = window.AudioContext || window.webkitAudioContext;
let sfxCtx;

function playSFX(type) {
    if (!sfxCtx) sfxCtx = new AudioContext();
    if (sfxCtx.state === 'suspended') sfxCtx.resume();
    if (state.isMuted) return; // integra com seu estado de mute existente

    const osc = sfxCtx.createOscillator();
    const gain = sfxCtx.createGain();
    osc.connect(gain);
    gain.connect(sfxCtx.destination);

    const vol = 0.08;

    if (type === 'click') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(300, sfxCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, sfxCtx.currentTime + 0.1);
        gain.gain.setValueAtTime(vol, sfxCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, sfxCtx.currentTime + 0.1);
        osc.start();
        osc.stop(sfxCtx.currentTime + 0.1);
    } else if (type === 'load') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, sfxCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, sfxCtx.currentTime + 0.08);
        gain.gain.setValueAtTime(vol * 0.5, sfxCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, sfxCtx.currentTime + 0.08);
        osc.start();
        osc.stop(sfxCtx.currentTime + 0.08);
    }
}

// Mantém a mesma interface que o app.js já usa
const soundManager = {
    playClick: () => playSFX('click'),
    playLoad:  () => playSFX('load'),
    toggleMute: (isMuted) => {
        if (sfxCtx) {
            sfxCtx.state === 'running' && isMuted
                ? sfxCtx.suspend()
                : sfxCtx.resume();
        }
    },
    initialize: () => {},  // não precisa mais, mas mantém pra não quebrar o app.js
    isReady: () => true
};