import fs from "fs";
// import transcribeAudio from "../transcribe.js";
import { assemblyTranscribe } from "../assemblytranscribe.js";

export const uploadFile = async (req, res) => {
  if (!req.file || !req.file.path) {
    return res.status(400).json({
      success: false,
      message: "No file uploaded",
    });
  }
  const filepath = req.file.path;
  const language = req.body.language || "en";
  try {
    // Use AssemblyAI for transcription
    const transcript = await assemblyTranscribe(filepath, language);
    //use OpenAI for transcription
    // const transcript = await transcribeAudio(filepath, language);
    fs.unlinkSync(filepath); // Delete the file after processing
    res.status(200).json({
      message: "File processed successfully",
      transcript,
    });
  } catch (error) {
    console.error("Error processing file:", error);
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath); // Clean up file if error occurs
    }
    return res.status(500).send("Error processing file");
  }
};
