import { convertPromptToJson } from "../utils/promptConverter.js";

export const convertPromptToJSON = (req, res) => {
  try {
    const { prompt } = req.body;
    const result = convertPromptToJson(prompt);
    return res.json({ success: true, json: result });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Conversion failed", error: err.message });
  }
};
