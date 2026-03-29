import { createIoTService } from "../core/iot.factory.js";
import { createStreamService } from "../core/stream.factory.js";
import type { StreamTransport } from "../core/types.js";

const DEVICE_ID = process.env.DEVICE_ID || "cam-01";
const DEFAULT_CHANNEL_ID = process.env.KVS_CHANNEL_NAME || "cam-01-channel";
const DEFAULT_TRANSPORT = (process.env.DEFAULT_TRANSPORT || "local-hls") as StreamTransport;

async function main() {
  const iot = createIoTService();
  const stream = createStreamService();

  await iot.connect();
  await iot.publishDeviceOnline(DEVICE_ID);

  setInterval(async () => {
    await iot.publishHeartbeat(DEVICE_ID);
  }, 15000);

  await iot.subscribeToCommands(DEVICE_ID, {
    onStartStream: async (cmd) => {
      const channelId = cmd.channelId || DEFAULT_CHANNEL_ID;
      const transport = cmd.transport || DEFAULT_TRANSPORT;

      console.log("[Camera] Start stream command:", {
        deviceId: DEVICE_ID,
        channelId,
        transport,
      });

      const result = await stream.startStream({
        deviceId: DEVICE_ID,
        channelId,
        transport,
      });

      console.log("[Camera] Stream started:", result);
    },

    onStopStream: async (cmd) => {
      const channelId = cmd.channelId || DEFAULT_CHANNEL_ID;
      const transport = cmd.transport || DEFAULT_TRANSPORT;

      console.log("[Camera] Stop stream command:", {
        deviceId: DEVICE_ID,
        channelId,
        transport,
      });

      const result = await stream.stopStream({
        deviceId: DEVICE_ID,
        channelId,
        transport,
      });

      console.log("[Camera] Stream stopped:", result);
    },
  });

  console.log(`[Camera] ${DEVICE_ID} is ready`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});