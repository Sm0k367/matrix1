export class AudioGenerator {
  private audioContext: AudioContext;
  private oscillator: OscillatorNode | null = null;
  private gainNode: GainNode;
  private analyser: AnalyserNode;
  private isPlaying = false;

  constructor() {
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.gainNode = this.audioContext.createGain();
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 64;

    this.gainNode.connect(this.analyser);
    this.analyser.connect(this.audioContext.destination);
  }

  play(frequency: number = 220) {
    if (this.isPlaying) return;

    this.oscillator = this.audioContext.createOscillator();
    this.oscillator.type = 'sine';
    this.oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);

    this.gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);

    this.oscillator.connect(this.gainNode);
    this.oscillator.start();
    this.isPlaying = true;

    this.modulateFrequency();
  }

  private modulateFrequency() {
    if (!this.oscillator || !this.isPlaying) return;

    const frequencies = [220, 246.94, 261.63, 293.66, 329.63, 349.23, 392, 440];
    let index = 0;

    const interval = setInterval(() => {
      if (!this.oscillator || !this.isPlaying) {
        clearInterval(interval);
        return;
      }

      const freq = frequencies[index % frequencies.length];
      this.oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime);
      index++;
    }, 500);
  }

  stop() {
    if (this.oscillator) {
      this.oscillator.stop();
      this.oscillator.disconnect();
      this.oscillator = null;
    }
    this.isPlaying = false;
  }

  getAnalyser(): AnalyserNode {
    return this.analyser;
  }

  setVolume(volume: number) {
    this.gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
  }
}
