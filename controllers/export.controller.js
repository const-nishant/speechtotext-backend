import fs from "fs";
import path from "path";

export const exportFile = (req, res) => {
  const { text } = req.body;
  const filename = `transcript-${Date.now()}.txt`;
  const exportDir = path.join(process.cwd(), "export");
  const filePath = path.join(exportDir, filename);

  if (!text) {
    return res.status(400).json({
      success: false,
      message: "No text provided for export",
    });
  }

  // Ensure the export directory exists
  if (!fs.existsSync(exportDir)) {
    fs.mkdirSync(exportDir, { recursive: true });
  }

  fs.writeFileSync(filePath, text);

  res.download(filePath, filename, (err) => {
    if (err) {
      console.error(err);
    }
    fs.unlinkSync(filePath); // Clean up
  });
};
