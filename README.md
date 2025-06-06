
# Speech-to-Text Backend

A Node.js backend for multilingual audio transcription using [OpenAI Whisper](https://platform.openai.com/docs/guides/speech-to-text) and [AssemblyAI](https://www.assemblyai.com/) APIs. Supports real-time streaming transcription via Socket.IO and file uploads via REST API.

## Features

- **Live audio transcription** via WebSockets (Socket.IO)
- **Audio file upload** and transcription via REST API
- **Multilingual support** (English, Hindi, Spanish, French, Mandarin, etc.)
- **Transcript export** as downloadable text files
- Uses [AssemblyAI](https://www.assemblyai.com/) (default) or OpenAI Whisper (optional, see code comments)

## Project Structure

```
.
├── app.js                  # Main server entry point (Express + Socket.IO)
├── assemblytranscribe.js   # AssemblyAI transcription logic
├── transcribe.js           # OpenAI Whisper transcription logic
├── controllers/
│   ├── export.controller.js
│   └── upload.controller.js
├── routes/
│   └── main.route.js
├── uploads/                # Temporary upload storage
├── export/                 # Temporary export storage
├── .env                    # Environment variables (API keys, port)
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js v18+ (required for native fetch)
- npm

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/const-nishant/speechtotext-backend.git
   cd speechtotext-backend
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the root directory:

   ```
   OPENAI_API_KEY=your_openai_api_key
   ASSEMBLY_KEY=your_assemblyai_api_key
   PORT=3001
   ```

### Running the Server

```sh
npm run dev
```
or
```sh
npm start
```

The server will run on `http://localhost:3001` by default.

## API Endpoints

### 1. File Upload Transcription

- **POST** `/api/v1/upload`
- **Form Data:**
  - `audio`: Audio file (`.wav`, `.mp3`, etc.)
  - `language`: Language code (e.g., `en`, `hi`, `es`, `fr`, `zh`)
- **Response:**
  ```json
  {
    "message": "File processed successfully",
    "transcript": "Transcribed text here"
  }
  ```

### 2. Export Transcript

- **POST** `/api/v1/export`
- **Body:** `{ "text": "Your transcript here" }`
- **Response:** Downloadable `.txt` file

### 3. WebSocket (Socket.IO) Streaming

- **Connect to:** `ws://localhost:3001`
- **Events:**
  - `audio-stream`: Send base64 audio chunks `{ audioChunk, language }`
  - `stop-audio-stream`: Signal end of stream `{ language }`
  - `transcript-result`: Receive transcript string

## Notes

- Temporary files are cleaned up automatically after processing.
- The backend defaults to AssemblyAI for transcription. To use OpenAI Whisper, uncomment the relevant lines in the code.
- Make sure your API keys are valid and have sufficient quota.



