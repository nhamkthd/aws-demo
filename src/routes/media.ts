/**
MediaLive responsibility

ingest + segment live stream
→ FFmpeg HLS generator

MediaPackage responsibility

serve playback manifest
→ Express static HTTP HLS server

MediaStore responsibility

store live media chunks
→ local folder

MediaConvert responsibility

transcode VOD assets
→ FFmpeg file jobs
 */


import { Router } from "express";
import {
  startLocalMediaLive,
  stopLocalMediaLive,
  getLocalLiveStatus,
} from "../local-media/medialive.service.js";
import { startLocalMediaConvert } from "../local-media/mediaconvert.service.js";

const router: Router = Router();

router.get("/status", (_req, res) => {
  res.json({
    ok: true,
    live: getLocalLiveStatus(),
  });
});

router.post("/live/start", async (req, res) => {
  try {
    const channelId = req.body?.channelId || "demo-channel";
    const result = await startLocalMediaLive(channelId);
    res.json({ ok: true, result });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/live/stop", (_req, res) => {
  try {
    const result = stopLocalMediaLive();
    res.json({ ok: true, result });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/convert/start", async (req, res) => {
  try {
    const jobId = req.body?.jobId;
    const result = await startLocalMediaConvert(jobId);
    res.json({ ok: true, result });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;