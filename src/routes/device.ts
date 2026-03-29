import { Router } from "express";
import { createIoTService } from "../core/iot.factory.js";
import type { StreamTransport } from "../core/types.js";

const router = Router();
const iot = createIoTService();

let initialized = false;

async function ensureConnected() {
  if (!initialized) {
    await iot.connect();
    initialized = true;
  }
}

router.get("/", async (_req, res) => {
  try {
    await ensureConnected();
    const devices = await iot.getKnownDevices();
    res.json({ ok: true, devices });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/:deviceId/start-stream", async (req, res) => {
  try {
    await ensureConnected();

    const deviceId = req.params.deviceId;
    const channelId = req.body?.channelId || `${deviceId}-channel`;
    const transport = (req.body?.transport || "local-hls") as StreamTransport;

    await iot.sendStartStream({ deviceId, channelId, transport });

    res.json({
      ok: true,
      command: "start-stream",
      deviceId,
      channelId,
      transport,
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/:deviceId/stop-stream", async (req, res) => {
  try {
    await ensureConnected();

    const deviceId = req.params.deviceId;
    const channelId = req.body?.channelId || `${deviceId}-channel`;
    const transport = (req.body?.transport || "local-hls") as StreamTransport;

    await iot.sendStopStream({ deviceId, channelId, transport });

    res.json({
      ok: true,
      command: "stop-stream",
      deviceId,
      channelId,
      transport,
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;