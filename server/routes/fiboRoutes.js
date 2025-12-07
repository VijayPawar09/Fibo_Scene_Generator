import express from "express";
import { generateImage, generateFromPrompt } from "../controller/fiboController.js";

const router = express.Router();

// POST /api/fibo/generate-image
router.post("/generate-image", generateImage);

// POST /api/fibo/generate-from-prompt
router.post("/generate-from-prompt", generateFromPrompt);

export default router;
