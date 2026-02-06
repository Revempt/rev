// --- GESTOR DE ÁUDIO ---
const soundManager = {
    clickSynth: null, 
    loadSynth: null, 
    bgNoise: null,
    
    initialize: () => {
        if (state.hasInitializedAudio) return;
        soundManager.clickSynth = new Tone.MembraneSynth({ 
            octaves: 4, 
            pitchDecay: 0.1, 
            envelope: { 
                attack: 0.001, 
                decay: 0.2, 
                sustain: 0.01, 
                release: 0.2 
            } 
        }).toDestination();
        
        soundManager.loadSynth = new Tone.Synth({ 
            oscillator: { type: 'sine' }, 
            envelope: { 
                attack: 0.005, 
                decay: 0.2, 
                sustain: 0.1, 
                release: 0.2 
            } 
        }).toDestination();
        
        soundManager.bgNoise = new Tone.Noise({ 
            type: 'brown', 
            volume: -35, 
            fadeIn: 2 
        }).toDestination().start();
        
        state.hasInitializedAudio = true;
    },
    
    playClick: () => { 
        if (!state.hasInitializedAudio || Tone.context.state !== 'running') return; 
        soundManager.clickSynth.triggerAttackRelease("C1", "8n"); 
    },
    
    playLoad: () => { 
        if (!state.hasInitializedAudio || Tone.context.state !== 'running') return; 
        soundManager.loadSynth.triggerAttackRelease("G2", "16n"); 
    },
    
    toggleMute: (isMuted) => { 
        if (!state.hasInitializedAudio) return; 
        Tone.getDestination().mute = isMuted; 
    }
}; 