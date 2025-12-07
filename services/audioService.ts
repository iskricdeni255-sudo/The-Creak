class AudioService {
  private ctx: AudioContext | null = null;
  private volume: number = 0.5;

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  setVolume(vol: number) {
    this.volume = vol;
  }

  playTone(freq: number, type: OscillatorType, duration: number, volMultiplier: number = 1) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    
    gain.gain.setValueAtTime(this.volume * volMultiplier, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  playFootstep() {
    // Low thud
    this.playTone(80 + Math.random() * 20, 'square', 0.1, 0.3);
  }

  playGrannyVoice() {
    // Creepy high pitch
    this.playTone(400 + Math.random() * 100, 'sawtooth', 1.5, 0.2);
  }

  playPickup() {
    // High ding
    this.playTone(800, 'sine', 0.2, 0.4);
  }

  playAmbience() {
    if (!this.ctx) return;
    // Creates a continuous drone
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(50, this.ctx.currentTime);
    gain.gain.setValueAtTime(this.volume * 0.05, this.ctx.currentTime);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    // This is a leak in a real app if not managed, but for this scope it's fine as a simple drone
    // In a full implementation, we'd store the node and stop it on pause.
    return { osc, gain };
  }
}

export const audioService = new AudioService();