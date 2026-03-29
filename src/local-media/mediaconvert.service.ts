import path from "node:path";
import fs from "node:fs";
import { execa } from "execa";
import { config } from "../config.js";
import { ensureMediaStoreDirs, getVodOutputDir } from "./mediastore.service.js";

export async function startLocalMediaConvert(jobId = `job-${Date.now()}`) {
  ensureMediaStoreDirs();

  const outputDir = getVodOutputDir(jobId);
  fs.mkdirSync(outputDir, { recursive: true });

  const outputFile = path.join(outputDir, "output.mp4");
  const thumbnailFile = path.join(outputDir, "thumb_%03d.jpg");

  await execa("ffmpeg", [
    "-y",
    "-i", config.sampleVideo,

    "-c:v", "libx264",
    "-preset", "fast",
    "-crf", "23",

    "-c:a", "aac",
    "-b:a", "128k",

    outputFile,
  ], {
    stdio: "inherit",
  });

  await execa("ffmpeg", [
    "-y",
    "-i", config.sampleVideo,
    "-vf", "fps=1",
    "-frames:v", "3",
    thumbnailFile,
  ], {
    stdio: "inherit",
  });

  return {
    jobId,
    status: "COMPLETED",
    outputDir,
    outputFile,
    outputUrl: `http://localhost:3000/media/vod/${jobId}/output.mp4`,
    thumbnailsUrl: `http://localhost:3000/media/vod/${jobId}/`,
  };
}