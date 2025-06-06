import fs from "fs";

export const assemblyTranscribe = async (filePath, language) => {
  try {
    const fileStream = fs.createReadStream(filePath);
    const uploadResponse = await fetch("https://api.assemblyai.com/v2/upload", {
      method: "POST",
      headers: {
        authorization: process.env.ASSEMBLY_KEY,
      },
      body: fileStream,
      duplex: "half",
    });

    if (!uploadResponse.ok) {
      const errText = await uploadResponse.text();
      throw new Error(`Upload failed: ${uploadResponse.status} ${errText}`);
    }

    const uploadJson = await uploadResponse.json();
    const audioUrl = uploadJson.upload_url;
    const languageCode = language || "en";
    console.log(audioUrl);
    const transcribeResp = await fetch(
      "https://api.assemblyai.com/v2/transcript",
      {
        method: "POST",
        headers: {
          authorization: process.env.ASSEMBLY_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          audio_url: audioUrl,
          language_code: languageCode,
        }),
      }
    );

    const transcriptJson = await transcribeResp.json();
    console.log(transcriptJson);
    const transcriptId = transcriptJson.id;
    console.log("Transcript ID:", transcriptId);

    let completed = false;
    let transcriptText = "";

    while (!completed) {
      const PollingResp = await fetch(
        `https://api.assemblyai.com/v2/transcript/${transcriptId}`,
        {
          headers: {
            authorization: process.env.ASSEMBLY_KEY,
          },
        }
      );

      const pollingJson = await PollingResp.json();

      if (pollingJson.status === "completed") {
        transcriptText = pollingJson.text;
        completed = true;
      } else if (pollingJson.status === "error") {
        console.error("Transcription error:", pollingJson.error);
        break;
      } else {
        console.log("Transcription in progress...");
        await new Promise((r) => setTimeout(r, 3000));
      }
    }
    return transcriptText;
  } catch (error) {
    console.error(error);
    throw new Error(`Transcription failed: ${error.message}`);
  }
};
