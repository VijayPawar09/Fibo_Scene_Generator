export function convertPromptToJson(prompt = "") {
  const text = String(prompt || "");

  const result = {
    scene: text,
    camera: {},
    lighting: {},
    color_palette: {}
  };

  // Camera logic
  if (text.includes("wide")) result.camera.angle = "wide";
  else if (text.includes("top")) result.camera.angle = "top";
  else if (text.includes("close")) result.camera.angle = "close-up";
  else result.camera.angle = "front";

  // Lighting logic
  if (text.includes("warm")) result.lighting.type = "warm";
  else if (text.includes("cool")) result.lighting.type = "cool";
  else if (text.includes("dramatic")) result.lighting.type = "dramatic";
  else result.lighting.type = "soft";

  // Color palette logic
  if (text.includes("vibrant")) result.color_palette.preset = "vibrant";
  else if (text.includes("cinematic")) result.color_palette.preset = "cinematic";
  else if (text.includes("noir")) result.color_palette.preset = "noir";
  else result.color_palette.preset = "natural";

  return result;
}
