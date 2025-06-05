import fs from "fs";
import transcribeAudio from "../transcribe";


export const uploadFile = async (req, res) => {
  const filepath = req.file.path;
  const language = req.body.language || "en";
  if (!filepath) {
    return res.status(400).json({
      success: false,
      message: "No file uploaded",
    });
  }
  try {
    //TODO: Implement the transcription logic here
    const transcript = await transcribeAudio(filepath, language);
    fs.unlinkSync(filepath); // Delete the file after processing
    res.status(200).json({
      message: "File processed successfully",
      transcript,
    });
  } catch (error) {
    console.error("Error processing file:", error);
    return res.status(500).send("Error processing file");
  }
};
