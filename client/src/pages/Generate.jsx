import { useState } from "react";

export default function Generate({ apiBase, onAddHistory }) {
  const [prompt, setPrompt] = useState("");
  const [size, setSize] = useState("1024x1024");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGenerate() {
    if (!prompt.trim()) return;
    setLoading(true);
    setError("");
    setImage("");

    try {
      const res = await fetch(`${apiBase}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, size }),
      });
      const data = await res.json();
      if (!res.ok || data.success === false) {
        throw new Error(data?.message || "Generation failed");
      }
      setImage(data.image);
      onAddHistory?.({ prompt, imageUrl: data.image });
    } catch (e) {
      setError(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Input Section */}
          <div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-2xl h-full">
              {/* Title */}
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2 flex items-center gap-2">
                <span>✨</span> Create Magic
              </h2>
              <p className="text-purple-200 text-sm mb-6">
                Describe your vision and watch it come to life
              </p>

              {/* Prompt Input */}
              <div className="mb-6">
                <label className="block text-purple-200 font-semibold mb-3 text-sm uppercase tracking-wide">
                  ✍️ Your Prompt
                </label>
                <textarea
                  className="w-full bg-white/5 border border-white/20 text-white placeholder-purple-300/50 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-300 backdrop-blur-sm resize-none min-h-40"
                  placeholder="Describe what you want to create... Be detailed and creative! (e.g., 'A serene Japanese garden at sunset with cherry blossoms, traditional bridge, koi pond, soft golden lighting')"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
                <p className="text-purple-300 text-xs mt-2 flex items-center gap-1">
                  <span>💡</span> Tip: More details = better results
                </p>
              </div>

              {/* Size Selection */}
              <div className="mb-6">
                <label className="block text-purple-200 font-semibold mb-3 text-sm uppercase tracking-wide">
                  📐 Image Size
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: "256x256", label: "🔹 Small", desc: "Fast" },
                    { value: "512x512", label: "⬜ Medium", desc: "Balanced" },
                    {
                      value: "1024x1024",
                      label: "⬛ Large",
                      desc: "High Quality",
                    },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSize(option.value)}
                      className={`p-3 rounded-lg border transition duration-300 transform hover:scale-105 ${
                        size === option.value
                          ? "bg-gradient-to-r from-purple-600 to-pink-600 border-purple-400 text-white"
                          : "bg-white/5 border-white/20 text-purple-200 hover:border-purple-400 hover:bg-white/10"
                      }`}
                    >
                      <div className="font-semibold text-sm">
                        {option.label}
                      </div>
                      <div className="text-xs opacity-75">{option.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm flex items-start gap-2">
                  <span className="text-lg mt-0.5">⚠️</span>
                  <div>{error}</div>
                </div>
              )}

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={loading || !prompt.trim()}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-4 px-6 rounded-xl transition duration-300 transform hover:scale-105 shadow-lg disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
              >
                {loading ? (
                  <>
                    <span className="animate-spin">⏳</span> Generating Magic...
                  </>
                ) : (
                  <>
                    <span>🚀</span> Generate Image
                  </>
                )}
              </button>

              {/* Info Box */}
              <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <p className="text-blue-200 text-xs leading-relaxed">
                  <span className="font-bold">Pro Tips:</span> Use adjectives,
                  art styles, lighting, and mood descriptions for best results.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Result Section */}
          <div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-2xl h-full flex flex-col">
              {/* Title */}
              <h3 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
                <span>🎨</span> Your Creation
              </h3>
              <p className="text-purple-200 text-sm mb-6">
                Your generated image will appear here
              </p>

              {/* Image Container */}
              <div className="flex-1 w-full flex items-center justify-center bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-white/10 rounded-xl overflow-hidden relative group">
                {image ? (
                  <>
                    <img
                      src={image}
                      alt="Generated"
                      className="max-w-full max-h-full object-contain group-hover:scale-[1.02] transition duration-300"
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none"></div>
                  </>
                ) : (
                  <div className="text-center py-16 px-6">
                    <div className="text-6xl mb-4 animate-bounce">✨</div>
                    <p className="text-purple-300 text-lg font-semibold mb-2">
                      {loading
                        ? "Creating your masterpiece..."
                        : "Ready to create?"}
                    </p>
                    <p className="text-purple-400 text-sm">
                      {loading
                        ? "AI is working its magic on your vision..."
                        : "Describe your idea and click Generate to get started!"}
                    </p>
                    {loading && (
                      <div className="mt-6 flex justify-center">
                        <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Download/Copy Info */}
              {image && (
                <div className="mt-6 p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-200 text-xs text-center">
                  ✅ Image generated successfully! Right-click to save or copy.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Features Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {[
            {
              icon: "⚡",
              title: "Lightning Fast",
              desc: "Get results in seconds",
            },
            {
              icon: "🎯",
              title: "High Quality",
              desc: "Sharp, detailed images",
            },
            {
              icon: "🎨",
              title: "Full Control",
              desc: "Choose your size & style",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-purple-400 transition duration-300 transform hover:scale-105"
            >
              <div className="text-4xl mb-3">{feature.icon}</div>
              <h4 className="text-white font-semibold mb-1">{feature.title}</h4>
              <p className="text-purple-300 text-sm">{feature.desc}</p>
            </div>
          ))}
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
