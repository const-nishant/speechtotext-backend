import http from "http";
import express from "express";
import { Server } from "socket.io";
import fs from "fs";
import transcribeAudio from "./transcribe";

const app = express();
app.use(express.json());
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  console.log("Client connected");

  socket.on("audio-stream",async (data) => {
    const buffer= Buffer.from(data.audioChunk, 'base64');
    fs.writeFileSync('temp_audio.wav', buffer);
    const transcript = await transcribeAudio('temp_audio.wav', data.language || 'en');
    socket.emit("transcript-result", transcript);
  },),

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  }); 
});