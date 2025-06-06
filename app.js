import express from "express";
import mainRouter from "./routes/main.route.js";
import dotenv from "dotenv";
import transcribeAudio from "./transcribe.js";
import fs from "fs";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
dotenv.config();
const app = express();

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/api/v1/", mainRouter);
app.get("/", (req, res) => {
  res.send("Welcome to speech-to-text-backend!");
});

io.on("connection", (socket) => {
  console.log("Client connected");
  let audioChunks = [];

  socket.on("audio-stream", (data) => {
    const buffer = Buffer.from(data.audioChunk, "base64");
    audioChunks.push(buffer);
  });

  socket.on("stop-audio-stream", async (data) => {
    const audioBuffer = Buffer.concat(audioChunks);
    fs.writeFileSync("temp_audio.wav", audioBuffer);
    const transcript = await transcribeAudio(
      "temp_audio.wav",
      data.language || "en"
    );
    socket.emit("transcript-result", transcript);
    audioChunks = []; // reset for next recording
    fs.unlinkSync("temp_audio.wav"); // Clean up the temporary file
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

server.listen(process.env.PORT || 3000, () => {
  console.log(
    `Server is running on http://localhost:${process.env.PORT || 3000}`
  );
});
