import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          {/* Logo */}
          <div className="mb-8 inline-block">
            <div className="text-7xl mb-4 animate-bounce">✨</div>
          </div>

          {/* Main Heading */}
          <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-6 leading-tight">
            AI Scene Generator
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-purple-200 mb-8 leading-relaxed max-w-2xl mx-auto">
            Transform your imagination into stunning AI-generated visual scenes.
            Just describe what you envision, and watch it come to life.
          </p>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-3xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 hover:border-purple-400 transition duration-300 transform hover:scale-105">
              <div className="text-4xl mb-3">🎨</div>
              <h3 className="text-white font-semibold mb-2">
                Creative Control
              </h3>
              <p className="text-purple-200 text-sm">
                Customize lighting, camera angles, and color palettes
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 hover:border-purple-400 transition duration-300 transform hover:scale-105">
              <div className="text-4xl mb-3">⚡</div>
              <h3 className="text-white font-semibold mb-2">Lightning Fast</h3>
              <p className="text-purple-200 text-sm">
                Generate high-quality images in seconds
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 hover:border-purple-400 transition duration-300 transform hover:scale-105">
              <div className="text-4xl mb-3">📚</div>
              <h3 className="text-white font-semibold mb-2">Save History</h3>
              <p className="text-purple-200 text-sm">
                Keep track of all your generated scenes
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/generate"
              className="px-8 py-4 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-lg shadow-lg transform hover:scale-105 transition duration-300 flex items-center gap-2"
            >
              <span>🚀</span> Start Creating
            </Link>
            <Link
              to="/history"
              className="px-8 py-4 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 hover:border-purple-400 text-white font-bold text-lg shadow-lg transform hover:scale-105 transition duration-300 flex items-center gap-2"
            >
              <span>📚</span> View History
            </Link>
          </div>

          {/* Additional Info */}
          <div className="mt-16 text-purple-300 text-sm">
            <p>
              ✅ No account required • 🔒 Your data stays private • ⚙️ Full
              creative control
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
