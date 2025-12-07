export default function PreviewMock({ data }) {
  const camera = data?.params?.camera || {};
  const lighting = data?.params?.lighting || {};
  const color = data?.params?.color || {};
  const aspect = data?.params?.aspect_ratio || "1:1";

  const angle = String(camera.angle || "eye");
  const fov = Number(camera.fov ?? 35);
  const lightType = String(lighting.type || "soft");
  const palette = String(color.palette || color.preset || "neutral");

  const rotate = angle.includes("top") ? -10 : angle.includes("low") ? 10 : angle.includes("wide") ? 5 : 0;
  const brightness = lightType === "dramatic" ? 0.85 : lightType === "hard" ? 1.1 : lightType === "warm" ? 1.05 : 1.0;
  const hue = palette === "warm" ? 20 : palette === "cool" ? 200 : palette === "vibrant" ? 310 : palette === "noir" ? 0 : 0;
  const saturate = palette === "noir" ? 0 : palette === "vibrant" ? 1.5 : 1.0;
  const scale = fov >= 60 ? 0.95 : fov <= 20 ? 1.05 : 1.0;

  const ratio = aspect === "16:9" ? "56.25%" : aspect === "4:3" ? "75%" : aspect === "9:16" ? "177.78%" : "100%";

  return (
    <div className="p-4 bg-white rounded-xl shadow w-full">
      <div className="text-sm font-semibold mb-2">Live Preview (mock)</div>
      <div
        className="w-full bg-gray-300 rounded relative overflow-hidden"
        style={{ paddingTop: ratio }}
      >
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            filter: `hue-rotate(${hue}deg) brightness(${brightness}) saturate(${saturate})`,
            transform: `rotate(${rotate}deg) scale(${scale})`,
            transition: "all 200ms ease",
          }}
        >
          <div className="w-24 h-24 bg-gray-800/40 rounded-lg border border-white/30" />
        </div>
      </div>
      <div className="mt-2 text-xs text-gray-600">
        Angle: {angle} • FOV: {fov} • Lighting: {lightType} • Palette: {palette} • AR: {aspect}
      </div>
    </div>
  );
}
