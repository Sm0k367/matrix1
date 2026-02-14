import { useRef, useState } from 'react';
import { Camera, Download, X, Loader } from 'lucide-react';

interface PosterGeneratorProps {
  currentTrack: string | null;
  realmData: {
    seed: number;
    realmType: string;
    realmMode: number;
    color: string;
  } | null;
  canvasElement: HTMLCanvasElement | null;
}

export function PosterGenerator({ currentTrack, realmData, canvasElement }: PosterGeneratorProps) {
  const [showModal, setShowModal] = useState(false);
  const [posterImage, setPosterImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const posterCanvasRef = useRef<HTMLCanvasElement>(null);

  const generatePoster = async () => {
    if (!currentTrack || !realmData || !canvasElement) return;

    setIsGenerating(true);

    requestAnimationFrame(() => {
      setTimeout(() => {
        const pCanvas = posterCanvasRef.current;
        if (!pCanvas) {
          setIsGenerating(false);
          return;
        }

        const ctx = pCanvas.getContext('2d');
        if (!ctx) {
          setIsGenerating(false);
          return;
        }

        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, 1080, 1920);

        const sourceWidth = canvasElement.width;
        const sourceHeight = canvasElement.height;
        const sourceAspect = sourceWidth / sourceHeight;
        const targetWidth = 1080;
        const targetHeight = 1500;
        const targetAspect = targetWidth / targetHeight;

        let drawWidth, drawHeight, drawX, drawY;

        if (sourceAspect > targetAspect) {
          drawHeight = targetHeight;
          drawWidth = sourceAspect * targetHeight;
          drawX = (targetWidth - drawWidth) / 2;
          drawY = 0;
        } else {
          drawWidth = targetWidth;
          drawHeight = targetWidth / sourceAspect;
          drawX = 0;
          drawY = (targetHeight - drawHeight) / 2;
        }

        ctx.drawImage(
          canvasElement,
          drawX,
          drawY,
          drawWidth,
          drawHeight
        );

        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(0, 1500, 1080, 420);

        ctx.fillStyle = '#fff';
        ctx.font = 'bold 50px Arial';
        ctx.textAlign = 'center';
        const trackName = currentTrack.replace('.mp3', '').replace(/_/g, ' ').toUpperCase();
        ctx.fillText(trackName, 1080 / 2, 1650);

        ctx.fillStyle = realmData.color;
        ctx.font = '35px monospace';
        ctx.fillText(`NEURAL_DNA: 0x${realmData.seed.toString(16).toUpperCase().slice(0, 6)}`, 1080 / 2, 1730);
        ctx.fillText(`REALM: ${realmData.realmType}`, 1080 / 2, 1790);

        ctx.font = '25px monospace';
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.fillText('DJ SMOKE STREAM // MATRIX v9.0', 1080 / 2, 1870);

        const dataURL = pCanvas.toDataURL('image/png');
        setPosterImage(dataURL);
        setShowModal(true);
        setIsGenerating(false);
      }, 100);
    });
  };

  const downloadPoster = () => {
    if (!posterImage) return;
    const link = document.createElement('a');
    link.download = `smoke-matrix-${Date.now()}.png`;
    link.href = posterImage;
    link.click();
  };

  return (
    <>
      <button
        onClick={generatePoster}
        disabled={!currentTrack || isGenerating}
        className="fixed bottom-8 right-8 bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-6 py-3 rounded-full font-bold shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 z-50"
      >
        {isGenerating ? (
          <Loader className="w-5 h-5 animate-spin" />
        ) : (
          <Camera className="w-5 h-5" />
        )}
        GENERATE POSTER
      </button>

      <canvas ref={posterCanvasRef} width={1080} height={1920} className="hidden" />

      {showModal && posterImage && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 border border-cyan-500/30 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Your Poster</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-zinc-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <img
                src={posterImage}
                alt="Generated poster"
                className="w-full rounded-lg border border-cyan-500/30 mb-6"
              />

              <button
                onClick={downloadPoster}
                className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-6 py-3 rounded-lg font-bold hover:from-cyan-600 hover:to-purple-600 transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Download Poster
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
