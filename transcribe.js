import fs from 'fs';
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function transcribeAudio(filePath, language) {
const file = fs.createReadStream(filePath);

const response = await openai.audio.transcriptions.create({
  file,
  model: 'whisper-1',
  language: language,
})

return response.text;

}

export default transcribeAudio;