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
    <section className="space-y-6">
      <div className="p-4 bg-white rounded-xl shadow">
        <h2 className="text-xl font-bold mb-3">Generate Image</h2>
        <div className="space-y-3">
          <textarea
            className="w-full p-3 border rounded min-h-28"
            placeholder="Enter a prompt (e.g., 'A black German shepherd playing in a garden')"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-600">Size</label>
            <select
              className="p-2 border rounded"
              value={size}
              onChange={(e) => setSize(e.target.value)}
            >
              <option value="1024x1024">1024 x 1024</option>
              <option value="512x512">512 x 512</option>
              <option value="256x256">256 x 256</option>
            </select>
          </div>
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="px-5 py-2.5 rounded-lg bg-black text-white hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Generating..." : "Generate"}
          </button>
          {error && <div className="text-sm text-red-600">{error}</div>}
        </div>
      </div>

      <div className="p-4 bg-white rounded-xl shadow">
        <h3 className="text-lg font-semibold mb-2">Result</h3>
        <div className="w-full min-h-64 flex items-center justify-center bg-gray-100 rounded">
          {image ? (
            <img src={image} alt="Generated" className="max-w-full rounded" />
          ) : (
            <span className="text-gray-500 text-sm">
              {loading ? "Generating..." : "No image yet"}
            </span>
          )}
        </div>
      </div>
    </section>
  );
}
