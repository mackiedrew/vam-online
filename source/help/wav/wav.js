/* eslint-env node */

// Libraries
import PromiseWorker from "promise-worker";
import ObjectPromiseWorker from "promise-worker-transferable";
import GrainAmplitudeWorker from "../../workers/grainAmplitudes.worker.js";
import ReadWavWorker from "../../workers/readWav.worker.js";

// Helpers
import { createSampleCases, createEquallySpacedGrains } from "../grain/grain";

/**
 * Reads and returns a promise containing the file buffer.
 * @param {File} file
 */
export const readFile = (url, filename) => {
  return fetch(url).then(response => response.blob()).then(blob => {
    const file = new File([blob], filename);
    const worker = new ReadWavWorker();
    const promiseWorker = new ObjectPromiseWorker(worker);
    return promiseWorker.postMessage(file);
  });
};

/**
 * Ugly function, but currently gathers information that is much more processed than the simple 
 * readWav() function.
 * @param {String} filePath Absolute full path to the wav file, including filename.ext
 */
export const richReadWav = (url, filename, grainSize, quietCutoff) => {
  const richDataPromise = readFile(url)
    .then(({ sampleRate, channelData }) => ({
      data: channelData[0],
      length: channelData[0].length,
      sampleRate
    }))
    .then(({ data, length, sampleRate }) => {
      const protoGrains = createEquallySpacedGrains(data, grainSize);
      const cases = createSampleCases(protoGrains, data, 2000);
      const worker = new GrainAmplitudeWorker();
      const promiseWorker = new PromiseWorker(worker);
      return promiseWorker
        .postMessage({ quietCutoff, cases, protoGrains })
        .then(({ grains, maxAmplitude }) => {
          const result = { sampleRate, length, grains, maxAmplitude };
          return result;
        });
    });
  return richDataPromise;
};
