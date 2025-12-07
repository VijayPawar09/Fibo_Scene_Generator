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
    <div className="min-h-screen w-full flex flex-col items-center p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">AI Scene Generator</h1>

      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-3xl space-y-4">
        {/* Description */}
        <textarea
          className="w-full border p-3 rounded-lg"
          placeholder="Describe your scene..."
          rows="3"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* Settings */}
        <div className="grid grid-cols-2 gap-4">
          <select
            className="border p-2 rounded"
            value={cameraAngle}
            onChange={(e) => setCameraAngle(e.target.value)}
          >
            <option value="front">Front</option>
            <option value="wide">Wide</option>
            <option value="top">Top</option>
            <option value="close-up">Close Up</option>
          </select>

          <select
            className="border p-2 rounded"
            value={lighting}
            onChange={(e) => setLighting(e.target.value)}
          >
            <option value="soft">Soft</option>
            <option value="warm">Warm</option>
            <option value="cool">Cool</option>
            <option value="dramatic">Dramatic</option>
          </select>

          <select
            className="border p-2 rounded"
            value={colorPalette}
            onChange={(e) => setColorPalette(e.target.value)}
          >
            <option value="natural">Natural</option>
            <option value="cinematic">Cinematic</option>
            <option value="vibrant">Vibrant</option>
            <option value="noir">Noir</option>
          </select>

          <select
            className="border p-2 rounded"
            value={resolution}
            onChange={(e) => setResolution(e.target.value)}
          >
            <option value="512x512">512x512</option>
            <option value="768x768">768x768</option>
            <option value="1024x1024">1024x1024</option>
          </select>
        </div>

        {/* Auto JSON + Generate Buttons */}
        <button
          onClick={handleAutoJSON}
          className="w-full bg-purple-600 text-white py-3 rounded-lg text-lg hover:bg-purple-700"
        >
          Auto-Generate JSON Settings
        </button>

        <button
          onClick={handleGenerate}
          className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg hover:bg-blue-700 mt-2"
        >
          Generate Image
        </button>
      </div>

      {/* Loader */}
      {loading && (
        <p className="mt-6 text-xl font-semibold">⏳ Generating...</p>
      )}

      {/* Output */}
      {imageURL && (
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-2">Generated Scene</h2>
          <img
            src={imageURL}
            alt="Generated"
            className="rounded-xl shadow-lg max-w-xl"
          />
        </div>
      )}

      {/* History */}
      <div className="w-full max-w-3xl mt-8">
        <h2 className="text-2xl font-bold mb-4">Generation History</h2>
        {history.length === 0 ? (
          <p className="text-gray-500">
            No generations yet. Create one to get started!
          </p>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {history.map((item) => (
              <div
                key={item.id}
                className="border rounded-lg p-2 bg-white shadow hover:shadow-lg transition"
              >
                <img
                  src={item.imageUrl}
                  alt={item.prompt}
                  className="w-full h-40 object-cover rounded"
                />
                <p className="mt-2 text-sm font-medium truncate">
                  {item.prompt}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
