import path from "node:path";
import fs from "node:fs";

const LIVE_ROOT = path.resolve("storage/live");
const VOD_ROOT = path.resolve("storage/vod");

export function ensureMediaStoreDirs() {
  fs.mkdirSync(LIVE_ROOT, { recursive: true });
  fs.mkdirSync(VOD_ROOT, { recursive: true });
}

export function getLiveChannelDir(channelId: string) {
  return path.join(LIVE_ROOT, channelId);
}

export function getVodOutputDir(jobId: string) {
  return path.join(VOD_ROOT, jobId);
}