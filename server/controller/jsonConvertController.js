export const convertPromptToJSON = (req, res) => {
  const { prompt } = req.body;

  // Simple conversion logic (upgrade later)
  const result = {
    scene: prompt,
    camera: {},
    lighting: {},
    color_palette: {}
  };

  // Camera logic
  if (prompt.includes("wide")) result.camera.angle = "wide";
  else if (prompt.includes("top")) result.camera.angle = "top";
  else if (prompt.includes("close")) result.camera.angle = "close-up";
  else result.camera.angle = "front";

  // Lighting logic
  if (prompt.includes("warm")) result.lighting.type = "warm";
  else if (prompt.includes("cool")) result.lighting.type = "cool";
  else if (prompt.includes("dramatic")) result.lighting.type = "dramatic";
  else result.lighting.type = "soft";

  // Color palette logic
  if (prompt.includes("vibrant")) result.color_palette.preset = "vibrant";
  else if (prompt.includes("cinematic")) result.color_palette.preset = "cinematic";
  else if (prompt.includes("noir")) result.color_palette.preset = "noir";
  else result.color_palette.preset = "natural";

  return res.json({
    success: true,
    json: result
  });
};
