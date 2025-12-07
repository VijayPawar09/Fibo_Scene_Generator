import express from "express";
import { generateImage } from "../controller/fiboController.js";

const router = express.Router();

// POST /api/fibo/generate-image
router.post("/generate-image", generateImage);

export default router;
