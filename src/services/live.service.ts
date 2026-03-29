import { execa, type ResultPromise } from "execa";
import { config } from "../config.js";

let ffmpegProcess: ResultPromise | null = null;

export function startLiveStream(rtmpUrl: string) {
  if (ffmpegProcess) {
    return { alreadyRunning: true };
  }

  ffmpegProcess = execa("ffmpeg", [
    "-re",
    "-stream_loop", "-1",
    "-i", config.sampleVideo,
    "-c:v", "libx264",
    "-preset", "veryfast",
    "-c:a", "aac",
    "-f", "flv",
    rtmpUrl
  ], {
    stdio: "inherit",
  });

  ffmpegProcess.catch((err) => {
    console.error("[FFmpeg] exited with error:", err);
    ffmpegProcess = null;
  });

  return { started: true };
}

export function stopLiveStream() {
  if (!ffmpegProcess) {
    return { running: false };
  }

  ffmpegProcess.kill("SIGTERM");
  ffmpegProcess = null;

  return { stopped: true };
}