import { useEffect, useState } from "react";

export default function RawJsonEditor({ data, onApply }) {
  const [text, setText] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    setText(
      data
        ? JSON.stringify(data, null, 2)
        : `{
  "model": "fibo-v1",
  "prompt": { "subject": "" },
  "params": {
    "camera": { "angle": "eye", "fov": 35 },
    "lighting": { "type": "soft" },
    "color": { "palette": "warm" },
    "aspect_ratio": "1:1"
  }
}`
    );
    setErr("");
  }, [data]);

  function handleApply() {
    try {
      const parsed = JSON.parse(text);
      setErr("");
      onApply?.(parsed);
    } catch (e) {
      setErr(e.message || "Invalid JSON");
    }
  }

  return (
    <div className="p-4 bg-white rounded-xl shadow w-full">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-semibold">RAW JSON</div>
        <button
          onClick={handleApply}
          className="px-3 py-1 text-sm bg-black text-white rounded"
        >
          Apply
        </button>
      </div>
      <textarea
        className="w-full h-48 text-xs font-mono p-2 border rounded"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      {err && <div className="text-xs text-red-600 mt-1">{err}</div>}
    </div>
  );
}
