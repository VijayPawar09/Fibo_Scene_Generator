import { useState } from "react";
import axios from "axios";

export default function SceneGenerator() {
  const [description, setDescription] = useState("");
  const [cameraAngle, setCameraAngle] = useState("front");
  const [lighting, setLighting] = useState("soft");
  const [colorPalette, setColorPalette] = useState("natural");
  const [resolution, setResolution] = useState("1024x1024");

  const [imageURL, setImageURL] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const handleGenerate = async () => {
    if (!description.trim()) {
      alert("Please enter a scene description");
      return;
    }

    setLoading(true);
    setImageURL("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/fibo/generate-image",
        {
          description,
          camera_angle: cameraAngle,
          lighting,
          color_palette: colorPalette,
          resolution,
        }
      );

      const url =
        response.data.data?.image_url || response.data.data?.output_url;

      setImageURL(url);

      // Save to history
      if (url) {
        await saveToHistory(url);
      }
    } catch (error) {
      console.error(error);
      alert("Image generation failed!");
    }

    setLoading(false);
  };

  // Auto-generate JSON settings from a single prompt
  const handleAutoJSON = async () => {
    if (!description.trim()) {
      alert("Please enter a scene description first.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/prompt/convert", {
        prompt: description,
      });

      const json = res.data.json;

      if (json) {
        // Safely set values if present
        if (json.camera && json.camera.angle) setCameraAngle(json.camera.angle);
        if (json.lighting && json.lighting.type)
          setLighting(json.lighting.type);
        if (json.color_palette && json.color_palette.preset)
          setColorPalette(json.color_palette.preset);

        alert("JSON settings applied automatically!");
      } else {
        alert("No JSON returned from conversion endpoint.");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to convert prompt to JSON");
    }
  };

  // Fetch generation history
  const fetchHistory = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/history");
      setHistory(res.data.history || []);
    } catch (err) {
      console.error("Failed to fetch history:", err);
    }
  };

  // Save current generation to history
  const saveToHistory = async (imageUrl) => {
    try {
      await axios.post("http://localhost:5000/api/history/add", {
        prompt: description,
        json: { cameraAngle, lighting, colorPalette },
        imageUrl,
      });
      fetchHistory();
    } catch (err) {
      console.error("Failed to save to history:", err);
    }
  };
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-3">
            ✨ AI Scene Generator
          </h1>
          <p className="text-purple-200 text-lg">
            Transform your imagination into stunning AI-generated scenes
          </p>
        </div>

        {/* Main Container */}
        <div className="w-full max-w-5xl">
          {/* Input Section */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 mb-8 shadow-2xl">
            {/* Description Input */}
            <div className="mb-6">
              <label className="block text-white font-semibold mb-3 text-lg">
                Scene Description
              </label>
              <textarea
                className="w-full bg-white/5 border border-white/20 text-white placeholder-gray-400 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-300 backdrop-blur-sm resize-none"
                placeholder="Describe your scene in detail... (e.g., 'A futuristic city with neon lights at night')"
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Settings Grid */}
            <div className="mb-6">
              <h3 className="text-white font-semibold mb-4 text-lg flex items-center">
                <span className="mr-2">⚙️</span> Scene Settings
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Camera Angle */}
                <div>
                  <label className="block text-purple-200 text-sm font-medium mb-2">
                    Camera Angle
                  </label>
                  <select
                    className="w-full bg-white/10 border border-white/20 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition backdrop-blur-sm cursor-pointer hover:border-purple-400"
                    value={cameraAngle}
                    onChange={(e) => setCameraAngle(e.target.value)}
                  >
                    <option value="front">📷 Front</option>
                    <option value="wide">🌅 Wide</option>
                    <option value="top">🔝 Top</option>
                    <option value="close-up">🔍 Close Up</option>
                  </select>
                </div>

                {/* Lighting */}
                <div>
                  <label className="block text-purple-200 text-sm font-medium mb-2">
                    Lighting
                  </label>
                  <select
                    className="w-full bg-white/10 border border-white/20 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition backdrop-blur-sm cursor-pointer hover:border-purple-400"
                    value={lighting}
                    onChange={(e) => setLighting(e.target.value)}
                  >
                    <option value="soft">☁️ Soft</option>
                    <option value="warm">🔥 Warm</option>
                    <option value="cool">❄️ Cool</option>
                    <option value="dramatic">⚡ Dramatic</option>
                  </select>
                </div>

                {/* Color Palette */}
                <div>
                  <label className="block text-purple-200 text-sm font-medium mb-2">
                    Color Palette
                  </label>
                  <select
                    className="w-full bg-white/10 border border-white/20 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition backdrop-blur-sm cursor-pointer hover:border-purple-400"
                    value={colorPalette}
                    onChange={(e) => setColorPalette(e.target.value)}
                  >
                    <option value="natural">🌿 Natural</option>
                    <option value="cinematic">🎬 Cinematic</option>
                    <option value="vibrant">🌈 Vibrant</option>
                    <option value="noir">🖤 Noir</option>
                  </select>
                </div>

                {/* Resolution */}
                <div>
                  <label className="block text-purple-200 text-sm font-medium mb-2">
                    Resolution
                  </label>
                  <select
                    className="w-full bg-white/10 border border-white/20 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition backdrop-blur-sm cursor-pointer hover:border-purple-400"
                    value={resolution}
                    onChange={(e) => setResolution(e.target.value)}
                  >
                    <option value="512x512">📦 512x512</option>
                    <option value="768x768">📮 768x768</option>
                    <option value="1024x1024">🖼️ 1024x1024</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col md:flex-row gap-4">
              <button
                onClick={handleAutoJSON}
                className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
              >
                <span>🤖</span> Auto-Generate Settings
              </button>

              <button
                onClick={handleGenerate}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <span className="animate-spin">⏳</span> Generating...
                  </>
                ) : (
                  <>
                    <span>✨</span> Generate Image
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Output Section */}
          {imageURL && (
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 mb-8 shadow-2xl animate-in fade-in duration-500">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <span className="mr-2">🎨</span> Generated Scene
              </h2>
              <div className="relative group">
                <img
                  src={imageURL}
                  alt="Generated"
                  className="w-full rounded-xl shadow-2xl transform group-hover:scale-[1.02] transition duration-300"
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></div>
              </div>
            </div>
          )}

          {/* History Section */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <span className="mr-2">📚</span> Generation History
            </h2>
            {history.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-purple-200 text-lg">
                  ✨ No generations yet. Create one to get started!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:border-purple-400 transition duration-300 transform hover:scale-105 hover:shadow-2xl"
                  >
                    <div className="relative overflow-hidden h-48">
                      <img
                        src={item.imageUrl}
                        alt={item.prompt}
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></div>
                    </div>
                    <div className="p-4">
                      <p className="text-white font-medium line-clamp-2 group-hover:text-purple-300 transition">
                        {item.prompt}
                      </p>
                      <p className="text-purple-300 text-xs mt-2">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
