import express from "express";
import mainRouter from "./routes/main.route";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1/",mainRouter);

app.get("/", (req, res) => {
  res.send("Welcome to speech-to-text-backend!");
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
