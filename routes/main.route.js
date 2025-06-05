import express from "express";
import { uploadFile } from "../controllers/upload.controller.js";
import { exportFile } from "../controllers/export.controller.js";
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${Date.now()}${ext}`);
  },
});
const upload = multer({ storage });

const mainRouter = express.Router();

mainRouter.post("/upload", upload.single("audio"), uploadFile);

mainRouter.post("/export", exportFile);

export default mainRouter;
