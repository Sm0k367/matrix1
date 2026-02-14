import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Maximize, Minimize } from 'lucide-react';
import { generateRealmGeometry, hashString, getColorFromSeed } from '../lib/realmGenerator';
import { REALM_TYPES } from '../lib/songs';

interface VisualizerProps {
  currentTrack: string | null;
  audioElement: HTMLAudioElement | null;
  onRealmChange?: (realmData: {
    seed: number;
    realmType: string;
    realmMode: number;
    color: string;
  }) => void;
}

export function Visualizer({ currentTrack, audioElement, onRealmChange }: VisualizerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const animationFrameRef = useRef<number>(0);

  const [currentRealm, setCurrentRealm] = useState('VOID_CLOUD');
  const [dnaSeed, setDnaSeed] = useState('0x000000');
  const [syncVal, setSyncVal] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      width / height,
      0.1,
      4000
    );
    camera.position.z = 1000;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;

    buildUniverse('INITIALIZE');

    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current || !containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    };

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
      setTimeout(handleResize, 100);
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, []);

  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (audioElement && !analyserRef.current) {
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const analyser = audioCtx.createAnalyser();
        const source = audioCtx.createMediaElementSource(audioElement);
        source.connect(analyser);
        analyser.connect(audioCtx.destination);
        analyser.fftSize = 64;
        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        audioContextRef.current = audioCtx;
        analyserRef.current = analyser;
        dataArrayRef.current = dataArray;

        const resumeContext = async () => {
          if (audioCtx.state === 'suspended') {
            await audioCtx.resume();
          }
        };

        audioElement.addEventListener('play', resumeContext);

        animate();

        return () => {
          audioElement.removeEventListener('play', resumeContext);
        };
      } catch (error) {
        console.error('Error setting up audio context:', error);
      }
    }
  }, [audioElement]);

  useEffect(() => {
    if (currentTrack) {
      buildUniverse(currentTrack);
    }
  }, [currentTrack]);

  const buildUniverse = (songTitle: string) => {
    if (!sceneRef.current) return;

    if (particlesRef.current) {
      sceneRef.current.remove(particlesRef.current);
      particlesRef.current.geometry.dispose();
      (particlesRef.current.material as THREE.Material).dispose();
    }

    const seed = hashString(songTitle);
    const color = getColorFromSeed(seed);
    const hexColor = '#' + color.getHexString();

    document.documentElement.style.setProperty('--neon', hexColor);

    const mode = seed % 67;
    const realmType = REALM_TYPES[mode].name;

    setCurrentRealm(realmType);
    setDnaSeed(`0x${seed.toString(16).toUpperCase().slice(0, 6)}`);

    const particleSize = 2 + (seed % 5);
    const particleCount = 12000 + (seed % 6000);

    const geometry = generateRealmGeometry({
      mode,
      count: particleCount,
      seed,
      particleSize,
    });

    const material = new THREE.PointsMaterial({
      size: particleSize,
      color,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(geometry, material);
    sceneRef.current.add(particles);
    particlesRef.current = particles;

    if (onRealmChange) {
      onRealmChange({
        seed,
        realmType,
        realmMode: mode,
        color: hexColor,
      });
    }
  };

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;

    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error('Error toggling fullscreen:', error);
    }
  };

  const animate = () => {
    animationFrameRef.current = requestAnimationFrame(animate);

    if (particlesRef.current) {
      const seed = currentTrack ? hashString(currentTrack) : 0;
      const rotationSpeed = ((seed % 10) + 1) / 1000;

      particlesRef.current.rotation.y += rotationSpeed * 1.5;
      particlesRef.current.rotation.z += rotationSpeed * 0.5;
      particlesRef.current.rotation.x += rotationSpeed * 0.2;

      if (analyserRef.current && dataArrayRef.current) {
        analyserRef.current.getByteFrequencyData(dataArrayRef.current);
        const bass = dataArrayRef.current[2] || 0;
        const mid = dataArrayRef.current[10] || 0;
        const high = dataArrayRef.current[20] || 0;

        const scale = 1 + bass / 500;
        particlesRef.current.scale.set(scale, scale, scale);

        const intensity = (bass + mid + high) / 3;
        const material = particlesRef.current.material as THREE.PointsMaterial;
        material.opacity = 0.6 + (intensity / 512) * 0.4;

        setSyncVal(bass / 10);
      }
    }

    if (rendererRef.current && sceneRef.current && cameraRef.current) {
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full h-screen bg-black">
      <canvas ref={canvasRef} className="absolute inset-0" />

      <div className="absolute top-6 left-6 bg-black/60 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-4 font-mono text-sm">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
          <span className="text-cyan-400 font-bold">NEURAL_LINK</span>
        </div>
        <div className="text-zinc-400">
          <div className="flex gap-2">
            <span className="text-zinc-500">DNA:</span>
            <span className="text-cyan-400">{dnaSeed}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-zinc-500">REALM:</span>
            <span className="text-purple-400">{currentRealm}</span>
          </div>
          <div className="flex gap-2">
            <span className="text-zinc-500">SYNC:</span>
            <span className="text-pink-400">{syncVal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <button
        onClick={toggleFullscreen}
        className="absolute top-6 right-6 bg-black/60 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-3 hover:bg-cyan-500/20 hover:border-cyan-400 transition-all duration-200 group"
        title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
      >
        {isFullscreen ? (
          <Minimize className="w-6 h-6 text-cyan-400 group-hover:text-cyan-300" />
        ) : (
          <Maximize className="w-6 h-6 text-cyan-400 group-hover:text-cyan-300" />
        )}
      </button>
    </div>
  );
}
