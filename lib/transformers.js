// lib/transformers.js - Local HF Transformers.js with QA
const { pipeline, env } = require("@xenova/transformers");

// Configure cache
env.cacheDir = "models_cache";
env.allowRemoteModels = true;
env.maxModelSize = 1e9; // 1GB

let qaPipeline;
let whisperPipeline;

async function getQAPipeline() {
  if (!qaPipeline) {
    qaPipeline = await pipeline(
      "question-answering",
      "Xenova/distilbert-base-cased-distilled-squad",
    );
  }
  return qaPipeline;
}

async function getWhisper() {
  if (!whisperPipeline) {
    whisperPipeline = await pipeline(
      "automatic-speech-recognition",
      "Xenova/whisper-small",
      {
        language: "bn", // Bangla
      },
    );
  }
  return whisperPipeline;
}

async function processQuery(question, context = "") {
  const qa = await getQAPipeline();
  if (context) {
    const result = await qa(question, context);
    return result.answer;
  } else {
    // Fallback
    return `No context found for "${question}". Visit admin to add services.`;
  }
}

async function transcribeAudio(audioBuffer) {
  const whisper = await getWhisper();
  return await whisper(audioBuffer);
}

module.exports = {
  getQAPipeline,
  getWhisper,
  processQuery,
  transcribeAudio,
};
