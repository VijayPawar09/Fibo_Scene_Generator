import axios from "axios";

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
    console.error("FIBO error:", err.response?.data || err.message);
    return res.status(500).json({
      success: false,
      message: "FIBO generation failed",
      error: err.response?.data || err.message,
    });
  }
};
