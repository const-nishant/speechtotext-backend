import express from "express";
import mainRouter from "./routes/main.route.js";
import dotenv from "dotenv";
import transcribeAudio from "./transcribe.js";
import fs from "fs";
import http from "http";
import { Server } from "socket.io";
dotenv.config();
const app = express();

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1/", mainRouter);

app.get("/", (req, res) => {
  res.send("Welcome to speech-to-text-backend!");
});

io.on("connection", (socket) => {
  console.log("Client connected");

  socket.on("audio-stream", async (data) => {
    const buffer = Buffer.from(data.audioChunk, "base64");
    fs.writeFileSync("temp_audio.wav", buffer);
    const transcript = await transcribeAudio(
      "temp_audio.wav",
      data.language || "en"
    );
    socket.emit("transcript-result", transcript);
  }),
    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
});

server.listen(process.env.PORT || 3000, () => {
  console.log(
    `Server is running on http://localhost:${process.env.PORT || 3000}`
  );
});
