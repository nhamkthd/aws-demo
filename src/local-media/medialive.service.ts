import path from "node:path";
import fs from "node:fs";
import { execa, type ResultPromise } from "execa";
import { config } from "../config.js";
import { ensureMediaStoreDirs, getLiveChannelDir } from "./mediastore.service.js";
import { getLocalPlaybackUrl } from "./mediapackage.service.js";
import { currentLiveSession, setCurrentLiveSession } from "./media-state.js";

let ffmpegProcess: ResultPromise | null = null;

export function getLocalLiveStatus() {
  return currentLiveSession;
}

export async function startLocalMediaLive(channelId = "demo-channel") {
  if (ffmpegProcess) {
    return {
      alreadyRunning: true,
      session: currentLiveSession,
    };
  }

  ensureMediaStoreDirs();

  const outputDir = getLiveChannelDir(channelId);
  fs.mkdirSync(outputDir, { recursive: true });

  // cleanup old files
  for (const file of fs.readdirSync(outputDir)) {
    fs.unlinkSync(path.join(outputDir, file));
  }

  const playlistPath = path.join(outputDir, "index.m3u8");

  ffmpegProcess = execa("ffmpeg", [
    "-re",
    "-stream_loop", "-1",
    "-i", config.sampleVideo,

    "-c:v", "libx264",
    "-preset", "veryfast",
    "-g", "48",
    "-sc_threshold", "0",

    "-c:a", "aac",
    "-ar", "48000",
    "-b:a", "128k",

    "-f", "hls",
    "-hls_time", "4",
    "-hls_list_size", "6",
    "-hls_flags", "delete_segments+append_list",
    "-hls_segment_filename", path.join(outputDir, "segment_%03d.ts"),
    playlistPath,
  ], {
    stdio: "inherit",
  });

  const session = {
    id: channelId,
    status: "RUNNING" as const,
    outputDir,
    playlistPath,
    playbackUrl: getLocalPlaybackUrl(channelId),
    startedAt: new Date().toISOString(),
  };

  setCurrentLiveSession(session);

  ffmpegProcess.catch((err) => {
    console.error("[LocalMediaLive] FFmpeg error:", err);
    setCurrentLiveSession({
      ...session,
      status: "ERROR",
    });
    ffmpegProcess = null;
  });

  return {
    started: true,
    session,
  };
}

export function stopLocalMediaLive() {
 console.log("[LocalMediaLive] Stopping live stream...");
    
  if (!ffmpegProcess) {
    return {
      running: false,
      session: currentLiveSession,
    };
  }
  console.log("[LocalMediaLive] Sending SIGTERM to FFmpeg process...");
  ffmpegProcess.kill("SIGTERM");
  ffmpegProcess = null;

  if (currentLiveSession) {
    setCurrentLiveSession({
      ...currentLiveSession,
      status: "STOPPED",
    });
  }

  return {
    stopped: true,
    session: currentLiveSession,
  };
}