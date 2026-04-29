import { useState, useEffect } from 'react';
import { FileText } from 'lucide-react';

export function SplashScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3000);

    // Animação de progresso
    const progressTimer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          return 100;
        }
        return prev + 33.33;
      });
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(progressTimer);
    };
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-700 via-emerald-800 to-emerald-900 flex items-center justify-center relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-teal-600/20"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="text-center relative z-10">
        {/* Logo */}
        <div className="mb-8">
          <div className="w-32 h-32 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl border border-emerald-200/50 backdrop-blur-sm">
            <FileText className="w-16 h-16 text-emerald-600" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-3 tracking-tight">Editor de Contratos</h1>
          <p className="text-emerald-100 text-xl font-light">Crie e personalize contratos de forma simples</p>
        </div>

        {/* Progress Bar */}
        <div className="w-80 mx-auto">
          <div className="bg-emerald-800/50 rounded-full h-3 overflow-hidden backdrop-blur-sm border border-emerald-600/30">
            <div 
              className="bg-gradient-to-r from-emerald-400 to-emerald-300 h-full transition-all duration-500 ease-out rounded-full shadow-lg"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-emerald-200 text-sm mt-4 font-medium">
            Carregando sistema... {Math.round(progress)}%
          </p>
        </div>

        {/* Loading Dots */}
        <div className="flex justify-center mt-8 space-x-2">
          <div className="w-2 h-2 bg-emerald-300 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-emerald-300 rounded-full animate-pulse delay-75"></div>
          <div className="w-2 h-2 bg-emerald-300 rounded-full animate-pulse delay-150"></div>
        </div>
      </div>
    </div>
  );
}
