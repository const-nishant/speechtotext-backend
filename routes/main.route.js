import express from "express";
import { uploadFile } from "../controllers/upload.controller.js";
import { exportFile } from "../controllers/export.controller.js";
import multer from "multer";

const upload = multer({ dest: "uploads/" });
const mainRouter = express.Router();

mainRouter.post("/upload", upload.single("audio"), uploadFile);

mainRouter.post("/export", exportFile);

export default mainRouter;
