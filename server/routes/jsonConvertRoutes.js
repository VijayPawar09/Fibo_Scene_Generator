import express from "express";
import { convertPromptToJSON } from "../controller/jsonconvertController.js";

const router = express.Router();

router.post("/convert", convertPromptToJSON);

export default router;
