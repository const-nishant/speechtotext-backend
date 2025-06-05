import fs from 'fs';

export const exportFile = (req, res) => {
  const {text} = req.body;
  const filename= `transcript-${Date.now()}.txt`;
  if (!text) {
    return res.status(400).json({
      success: false,
      message: "No text provided for export",
    });
  }
  fs.writeFileSync(`export/${filename}`,text);

  res.download(`export/${filename}`, filename,(err) => {
    if (err) console.error(err);
    fs.unlinkSync(`exports/${filename}`); // Clean up
  });

}