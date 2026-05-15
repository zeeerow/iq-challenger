import { useState, useEffect } from 'react';
import { Download, Share } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if it's iOS
    const ua = window.navigator.userAgent;
    const isIOSDevice = /iPad|iPhone|iPod/.test(ua);
    setIsIOS(isIOSDevice);

    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // If it's iOS and not already standalone, show instructions
    if (isIOSDevice && !(window.navigator as any).standalone) {
      // We could show it automatically or wait for interaction
      // For now, let's keep it available via button or automatically show after a delay
      const timer = setTimeout(() => setShowPrompt(true), 5000);
      return () => clearTimeout(timer);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt && !isIOS) return;

    if (isIOS) {
       // Just keep the instructions visible
       return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  if (!showPrompt) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-6 left-4 right-4 z-50"
      >
        <div className="bg-white border border-slate-200 p-4 shadow-2xl rounded-2xl flex items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="font-bold text-sm text-slate-800">செயலியை நிறுவுக</h3>
            <p className="text-[10px] text-slate-500 font-medium leading-tight">
              {isIOS 
                ? "சிறந்த அனுபவத்திற்கு 'Share' அழுத்தி 'Add to Home Screen' என்பதைத் தேர்ந்தெடுக்கவும்." 
                : "விரைவான அணுகலுக்கு இதை உங்கள் முகப்புத் திரையில் நிறுவவும்."}
            </p>
          </div>
          
          {isIOS ? (
            <div className="flex gap-2 items-center text-indigo-600 animate-pulse">
               <Share size={20} />
            </div>
          ) : (
            <button
              onClick={handleInstallClick}
              className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 active:scale-95 transition-transform"
            >
              <Download size={14} />
              நிறுவுக
            </button>
          )}

          <button 
            onClick={() => setShowPrompt(false)}
            className="text-slate-300 hover:text-slate-600 p-1"
          >
            <span className="text-xl">&times;</span>
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
