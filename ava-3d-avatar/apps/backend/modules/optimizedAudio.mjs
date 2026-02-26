import ffmpeg from "fluent-ffmpeg";
import { Readable } from "stream";

/**
 * Optimized audio conversion - streaming approach
 * File I/O avoid karta hai for faster processing
 */
export const convertWebMToMP3Stream = async (webmBuffer) => {
  return new Promise((resolve, reject) => {
    const chunks = [];
    const inputStream = Readable.from(webmBuffer);

    ffmpeg(inputStream)
      .inputFormat("webm")
      .audioCodec("libmp3lame")
      .audioBitrate("128k")
      .audioChannels(1)
      .audioFrequency(44100)
      .format("mp3")
      .on("error", (err) => {
        console.error("FFmpeg conversion error:", err);
        reject(err);
      })
      .on("end", () => {
        resolve(Buffer.concat(chunks));
      })
      .pipe()
      .on("data", (chunk) => {
        chunks.push(chunk);
      })
      .on("end", () => {
        resolve(Buffer.concat(chunks));
      });
  });
};

/**
 * Fast audio validation
 */
export const validateAudioBuffer = (buffer) => {
  if (!buffer || buffer.length === 0) {
    throw new Error("Empty audio buffer");
  }
  
  // Basic WebM signature check
  const signature = buffer.slice(0, 4).toString("hex");
  if (!signature.startsWith("1a45dfa3")) {
    console.warn("Warning: Audio may not be valid WebM format");
  }
  
  return true;
};

/**
 * Audio quality optimization
 */
export const optimizeAudioQuality = (buffer, options = {}) => {
  const {
    bitrate = "128k",
    sampleRate = 44100,
    channels = 1,
  } = options;

  return new Promise((resolve, reject) => {
    const chunks = [];
    const inputStream = Readable.from(buffer);

    ffmpeg(inputStream)
      .audioCodec("libmp3lame")
      .audioBitrate(bitrate)
      .audioChannels(channels)
      .audioFrequency(sampleRate)
      .format("mp3")
      .on("error", reject)
      .pipe()
      .on("data", (chunk) => chunks.push(chunk))
      .on("end", () => resolve(Buffer.concat(chunks)));
  });
};
