/**
 * Generate educational waveform tone samples
 * Creates short audio clips demonstrating each waveform type
 *
 * Usage: npx tsx scripts/generate-waveform-tones.ts
 */

import * as fs from "fs";
import * as path from "path";

const SAMPLE_RATE = 44100;
const DURATION = 2; // 2 seconds per tone
const FREQUENCY = 440; // A4 note
const VOLUME = 0.5;

// Generate samples for each waveform type
function generateSineWave(t: number): number {
  return Math.sin(2 * Math.PI * FREQUENCY * t);
}

function generateSquareWave(t: number): number {
  const period = 1 / FREQUENCY;
  const phase = (t % period) / period;
  return phase < 0.5 ? 1 : -1;
}

function generateSawtoothWave(t: number): number {
  const period = 1 / FREQUENCY;
  const phase = (t % period) / period;
  return 2 * phase - 1;
}

function generateTriangleWave(t: number): number {
  const period = 1 / FREQUENCY;
  const phase = (t % period) / period;
  return phase < 0.5 ? 4 * phase - 1 : 3 - 4 * phase;
}

// Apply fade in/out envelope to avoid clicks
function applyEnvelope(samples: Float32Array): Float32Array {
  const fadeLength = Math.floor(SAMPLE_RATE * 0.1); // 100ms fade

  for (let i = 0; i < fadeLength; i++) {
    const factor = i / fadeLength;
    samples[i] *= factor;
    samples[samples.length - 1 - i] *= factor;
  }

  return samples;
}

// Generate WAV file buffer
function createWavBuffer(samples: Float32Array): Buffer {
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = SAMPLE_RATE * numChannels * (bitsPerSample / 8);
  const blockAlign = numChannels * (bitsPerSample / 8);
  const dataSize = samples.length * (bitsPerSample / 8);
  const fileSize = 36 + dataSize;

  const buffer = Buffer.alloc(44 + dataSize);
  let offset = 0;

  // RIFF header
  buffer.write("RIFF", offset);
  offset += 4;
  buffer.writeUInt32LE(fileSize, offset);
  offset += 4;
  buffer.write("WAVE", offset);
  offset += 4;

  // fmt chunk
  buffer.write("fmt ", offset);
  offset += 4;
  buffer.writeUInt32LE(16, offset); // chunk size
  offset += 4;
  buffer.writeUInt16LE(1, offset); // PCM format
  offset += 2;
  buffer.writeUInt16LE(numChannels, offset);
  offset += 2;
  buffer.writeUInt32LE(SAMPLE_RATE, offset);
  offset += 4;
  buffer.writeUInt32LE(byteRate, offset);
  offset += 4;
  buffer.writeUInt16LE(blockAlign, offset);
  offset += 2;
  buffer.writeUInt16LE(bitsPerSample, offset);
  offset += 2;

  // data chunk
  buffer.write("data", offset);
  offset += 4;
  buffer.writeUInt32LE(dataSize, offset);
  offset += 4;

  // Write samples
  for (let i = 0; i < samples.length; i++) {
    const sample = Math.max(-1, Math.min(1, samples[i] * VOLUME));
    const intSample = Math.round(sample * 32767);
    buffer.writeInt16LE(intSample, offset);
    offset += 2;
  }

  return buffer;
}

function generateTone(
  name: string,
  generator: (t: number) => number,
  outputDir: string
) {
  console.log(`Generating: ${name} wave (${FREQUENCY}Hz, ${DURATION}s)`);

  const numSamples = SAMPLE_RATE * DURATION;
  const samples = new Float32Array(numSamples);

  for (let i = 0; i < numSamples; i++) {
    const t = i / SAMPLE_RATE;
    samples[i] = generator(t);
  }

  applyEnvelope(samples);

  const wavBuffer = createWavBuffer(samples);
  const outputPath = path.join(outputDir, `tone_${name}.wav`);
  fs.writeFileSync(outputPath, wavBuffer);

  console.log(`  ✓ Saved: tone_${name}.wav`);
}

async function main() {
  const outputDir = path.join(
    __dirname,
    "../public/audio/sound-fundamentals"
  );

  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log("Generating educational waveform tones...\n");
  console.log(`Frequency: ${FREQUENCY}Hz (A4)`);
  console.log(`Duration: ${DURATION}s each`);
  console.log(`Sample rate: ${SAMPLE_RATE}Hz\n`);

  generateTone("sine", generateSineWave, outputDir);
  generateTone("square", generateSquareWave, outputDir);
  generateTone("sawtooth", generateSawtoothWave, outputDir);
  generateTone("triangle", generateTriangleWave, outputDir);

  console.log("\n✓ Done! Educational tones saved to /public/audio/sound-fundamentals/");
  console.log("\nThese can be played during the Waveform Shapes section to");
  console.log("demonstrate what each waveform actually sounds like.");
}

main().catch(console.error);
