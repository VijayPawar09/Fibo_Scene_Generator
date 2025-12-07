import { useState } from "react";

export default function ControlPanel({ onGenerate }) {
  const [subject, setSubject] = useState("");
  const [prompt, setPrompt] = useState("");
  const [cameraAngle, setCameraAngle] = useState("eye");
  const [fov, setFov] = useState(35);
  const [lighting, setLighting] = useState("soft");
  const [palette, setPalette] = useState("warm");
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [resolution, setResolution] = useState("1024x1024");
  const [seed, setSeed] = useState("");
  const [hdr, setHdr] = useState(false);
  const [busy, setBusy] = useState(false);

  const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

  function handleGenerate() {
    const [width, height] = resolution.split("x").map((n) => parseInt(n, 10));
    const jsonPayload = {
      model: "fibo-v1",
      prompt: { subject, text: prompt || undefined },
      params: {
        camera: { angle: cameraAngle, fov: Number(fov) },
        lighting: { type: lighting },
        color: { palette },
        aspect_ratio: aspectRatio,
        resolution: { width, height },
        seed: seed ? Number(seed) : undefined,
        hdr: hdr || undefined,
      },
    };
    onGenerate(jsonPayload);
  }

  async function autofillFromPrompt() {
    if (!prompt.trim()) return;
    try {
      setBusy(true);
      const res = await fetch(`${API_BASE}/prompt/convert`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (data?.success && data?.json) {
        const j = data.json;
        // Map simple helper JSON into our controls
        if (j.camera?.angle) setCameraAngle(j.camera.angle);
        if (j.lighting?.type) setLighting(j.lighting.type);
        if (j.color_palette?.preset) setPalette(j.color_palette.preset);
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="p-4 space-y-4 bg-gray-100 rounded-xl shadow w-full">
      <h2 className="text-xl font-bold">Controls</h2>

      <input
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        placeholder="Enter subject..."
        className="w-full p-2 border rounded"
      />

      <div className="space-y-2">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Optional: natural language prompt to auto-fill controls (e.g., 'wide angle, dramatic lighting, vibrant colors')"
          className="w-full p-2 border rounded h-20"
        />
        <button
          onClick={autofillFromPrompt}
          disabled={busy}
          className="w-full py-2 bg-white border rounded hover:bg-gray-50 disabled:opacity-50"
        >
          {busy ? "Analyzing..." : "Auto-fill from Prompt"}
        </button>
      </div>

      <div>
        <label>Camera Angle</label>
        <select
          value={cameraAngle}
          onChange={(e) => setCameraAngle(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="low">Low</option>
          <option value="eye">Eye Level</option>
          <option value="top">Top Down</option>
          <option value="wide">Wide</option>
          <option value="close">Close-up</option>
        </select>
      </div>

      <div>
        <label>Field of View: {fov}</label>
        <input
          type="range"
          min="10"
          max="80"
          value={fov}
          onChange={(e) => setFov(e.target.value)}
          className="w-full"
        />
      </div>

      <div>
        <label>Lighting</label>
        <select
          value={lighting}
          onChange={(e) => setLighting(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="soft">Soft</option>
          <option value="hard">Hard</option>
          <option value="dramatic">Dramatic</option>
          <option value="warm">Warm</option>
          <option value="cool">Cool</option>
        </select>
      </div>

      <div>
        <label>Color Palette</label>
        <select
          value={palette}
          onChange={(e) => setPalette(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="warm">Warm</option>
          <option value="cool">Cool</option>
          <option value="neutral">Neutral</option>
          <option value="vibrant">Vibrant</option>
          <option value="cinematic">Cinematic</option>
          <option value="noir">Noir</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label>Aspect Ratio</label>
          <select
            value={aspectRatio}
            onChange={(e) => setAspectRatio(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="1:1">1:1</option>
            <option value="16:9">16:9</option>
            <option value="4:3">4:3</option>
            <option value="9:16">9:16</option>
          </select>
        </div>
        <div>
          <label>Resolution</label>
          <select
            value={resolution}
            onChange={(e) => setResolution(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="1024x1024">1024 x 1024</option>
            <option value="1280x720">1280 x 720</option>
            <option value="1920x1080">1920 x 1080</option>
            <option value="1080x1920">1080 x 1920</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label>Seed (optional)</label>
          <input
            value={seed}
            onChange={(e) => setSeed(e.target.value)}
            placeholder="e.g., 12345"
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="flex items-center gap-2 mt-6">
          <input
            id="hdr"
            type="checkbox"
            checked={hdr}
            onChange={(e) => setHdr(e.target.checked)}
          />
          <label htmlFor="hdr">HDR</label>
        </div>
      </div>

      <button
        onClick={handleGenerate}
        className="w-full py-2 bg-black text-white rounded-lg"
      >
        Generate Image
      </button>
    </div>
  );
}
