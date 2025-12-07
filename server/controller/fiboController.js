import axios from "axios";
import db from "../db.js";
import logger from "../logger.js";
import { convertPromptToJson } from "../utils/promptConverter.js";

export const generateImage = async (req, res) => {
  try {
    const {
      description,
      camera_angle,
      lighting,
      color_palette,
      resolution,
      aspect_ratio
    } = req.body;

    // Check if demo mode is enabled
    if (process.env.DEMO_MODE === 'true') {
      // Return a demo image from a public source
      const demoImages = [
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1024&h=1024&fit=crop",
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1024&h=1024&fit=crop",
        "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=1024&h=1024&fit=crop",
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1024&h=1024&fit=crop",
        "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=1024&h=1024&fit=crop",
      ];
      
      const randomImage = demoImages[Math.floor(Math.random() * demoImages.length)];
      
      return res.json({
        success: true,
        data: {
          status: "completed",
          image_url: randomImage,
          output_url: randomImage
        }
      });
    }

    // Build V2 API payload - simpler structure
    const prompt = `${description}${camera_angle ? ` (${camera_angle} angle)` : ''}${lighting ? `, ${lighting} lighting` : ''}${color_palette ? `, ${color_palette} palette` : ''}`;
    
    const payload = {
      prompt: prompt,
      aspect_ratio: aspect_ratio || "1:1"
    };

    const apiKey = process.env.FIBO_API_KEY;
    const url = process.env.FIBO_URL;

    const response = await axios.post(url, payload, {
      headers: {
        "Content-Type": "application/json",
        "api_token": apiKey,
      },
    });

    return res.json({
      success: true,
      data: response.data,
    });

  } catch (err) {
    logger.error(`FIBO error: ${err.response?.data || err.message}`);
    return res.status(500).json({
      success: false,
      message: "FIBO generation failed",
      error: err.response?.data || err.message,
    });
  }
};

// Convert prompt -> JSON -> generate image -> persist history
export const generateFromPrompt = async (req, res) => {
  try {
    const { prompt, size, aspect_ratio } = req.body;

    const json = convertPromptToJson(prompt);

    // Demo mode returns a random demo image and persists history
    if (process.env.DEMO_MODE === 'true') {
      const demoImages = [
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1024&h=1024&fit=crop",
        "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=1024&h=1024&fit=crop",
        "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1024&h=1024&fit=crop",
      ];
      const image = demoImages[Math.floor(Math.random() * demoImages.length)];

      try {
        const entry = {
          id: (db.data.history.length ? db.data.history[db.data.history.length - 1].id : 0) + 1,
          prompt,
          json,
          imageUrl: image,
          createdAt: new Date().toISOString()
        };
        db.data.history.push(entry);
        await db.write();
        logger.info(`Added history entry id=${entry.id} (demo)`);
      } catch (err) {
        logger.error(`Failed to persist history (demo): ${err.message}`);
      }

      return res.json({ success: true, image, json, status: "completed" });
    }

    // Build prompt text from JSON and call OpenAI images API
    const description = json.scene;
    const camera_angle = json.camera?.angle;
    const lighting = json.lighting?.type;
    const color_palette = json.color_palette?.preset;

    const promptText = `${description}${camera_angle ? ` (${camera_angle} angle)` : ''}${lighting ? `, ${lighting} lighting` : ''}${color_palette ? `, ${color_palette} palette` : ''}`;

    const client = new (await import("openai")).default({ apiKey: process.env.OPENAI_API_KEY });
    const gen = await client.images.generate({
      model: "gpt-image-1",
      prompt: promptText,
      size: size || "1024x1024",
      response_format: "b64_json",
    });

    const b64 = gen?.data?.[0]?.b64_json;
    if (!b64) {
      return res.status(500).json({ success: false, message: "Image generation failed" });
    }
    const image = `data:image/png;base64,${b64}`;

    try {
      const entry = {
        id: (db.data.history.length ? db.data.history[db.data.history.length - 1].id : 0) + 1,
        prompt,
        json,
        imageUrl: image,
        createdAt: new Date().toISOString()
      };
      db.data.history.push(entry);
      await db.write();
      logger.info(`Added history entry id=${entry.id}`);
    } catch (err) {
      logger.error(`Failed to persist history: ${err.message}`);
    }

    return res.json({ success: true, image, json, status: "completed" });

  } catch (err) {
    logger.error(`generateFromPrompt error: ${err.response?.data || err.message}`);
    return res.status(500).json({ success: false, message: "Generation failed", details: err.response?.data || err.message });
  }
};
