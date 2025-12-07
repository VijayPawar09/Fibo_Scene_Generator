import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";
import morgan from "morgan";
import fiboRoutes from "./routes/fiboRoutes.js";
import jsonConvertRoutes from "./routes/jsonConvertRoutes.js";
import historyRoutes from "./routes/historyRoutes.js"
import OpenAI from "openai";
import logger from "./logger.js";

dotenv.config();

const app = express();

// request logging
app.use(morgan('combined', { stream: { write: (msg) => logger.info(msg.trim()) } }))

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/fibo", fiboRoutes);
app.use("/api/prompt", jsonConvertRoutes);
app.use("/api/history", historyRoutes);

// Root health-check
app.get("/", (req, res) => {
  res.send("Backend is running successfully 🚀");
});

// POST /api/generate
app.post("/api/generate", async (req, res) => {
  try {
    const { prompt, size } = req.body;

    // Demo mode short-circuit with category-based variety
    if (process.env.DEMO_MODE === 'true') {
      const subject = prompt || '';
      const text = String(subject).toLowerCase();

      const categories = {
        nature: [
          "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1024&h=1024&fit=crop",
          "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200&h=800&fit=crop",
          "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1024&h=1024&fit=crop",
        ],
        city: [
          "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=1024&h=1024&fit=crop",
          "https://images.unsplash.com/photo-1432836431433-925d3cc0a5cd?w=1024&h=1024&fit=crop",
        ],
        people: [
          "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=1024&h=1024&fit=crop",
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=1024&h=1024&fit=crop",
        ],
        product: [
          "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=1024&h=1024&fit=crop",
          "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=1024&h=1024&fit=crop",
        ],
        art: [
          "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1024&h=1024&fit=crop",
          "https://images.unsplash.com/photo-1495567720989-cebdbdd97913?w=1024&h=1024&fit=crop",
        ]
      };

      const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
      let pool = categories.art; // default
      if (/(forest|tree|mountain|nature|landscape|river|ocean)/.test(text)) pool = categories.nature;
      else if (/(city|street|urban|architecture|building|skyscraper)/.test(text)) pool = categories.city;
      else if (/(person|portrait|people|model|face)/.test(text)) pool = categories.people;
      else if (/(product|phone|watch|shoe|bag|object)/.test(text)) pool = categories.product;

      const image = pick(pool);
      return res.json({ success: true, image, status: "completed", raw: { demo: true, category: Object.keys(categories).find(k => categories[k] === pool) } });
    }

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const gen = await client.images.generate({
      model: "gpt-image-1",
      prompt,
      size: size || "1024x1024",
      response_format: "b64_json",
    });
    const b64 = gen?.data?.[0]?.b64_json;
    if (!b64) {
      return res.status(500).json({ success: false, message: "Image generation failed" });
    }
    const image = `data:image/png;base64,${b64}`;
    return res.json({ success: true, image, status: "completed" });

  } catch (err) {
    logger.error(`/api/generate error: ${err.response?.data || err.message}`)
    return res.status(500).json({
      success: false,
      message: "Generation failed",
      details: err.response?.data || err.message
    });
  }
});

// global error handler
app.use((err, req, res, next) => {
  logger.error(`Unhandled error: ${err.stack || err}`)
  res.status(500).json({ success: false, message: 'Internal server error' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`)
});
