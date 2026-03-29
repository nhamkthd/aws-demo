import React, { useState } from "react";
import type { StreamTransport } from "../types/api.js";
import { startDeviceStream, stopDeviceStream } from "../services/device-api.js";

type Props = {
  selectedDeviceId: string;
  onPlaybackUrlChange: (url?: string) => void;
  onStatusMessage: (msg: string) => void;
};

export default function StreamControlPanel({
  selectedDeviceId,
  onPlaybackUrlChange,
  onStatusMessage,
}: Props) {
  const [channelId, setChannelId] = useState("cam-01-channel");
  const [transport, setTransport] = useState<StreamTransport>("local-hls");
  const [loading, setLoading] = useState(false);

  const localPlaybackUrl =
    transport === "local-hls"
      ? `http://localhost:3000/media/live/${channelId}/index.m3u8`
      : undefined;

  const handleStart = async () => {
    try {
      setLoading(true);

      await startDeviceStream({
        deviceId: selectedDeviceId,
        channelId,
        transport,
      });

      if (transport === "local-hls") {
        onPlaybackUrlChange(localPlaybackUrl);
      } else {
        onPlaybackUrlChange(undefined);
      }

      onStatusMessage(`Started ${transport} for ${selectedDeviceId}`);
    } catch (err: any) {
      console.error(err);
      onStatusMessage(`Start failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleStop = async () => {
    try {
      setLoading(true);

      await stopDeviceStream({
        deviceId: selectedDeviceId,
        channelId,
        transport,
      });

      onPlaybackUrlChange(undefined);
      onStatusMessage(`Stopped ${transport} for ${selectedDeviceId}`);
    } catch (err: any) {
      console.error(err);
      onStatusMessage(`Stop failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm space-y-4">
      <h2 className="text-lg font-semibold">Stream Control</h2>

      <div className="space-y-2">
        <label className="text-sm font-medium">Channel ID</label>
        <input
          value={channelId}
          onChange={(e) => setChannelId(e.target.value)}
          className="w-full rounded-xl border px-3 py-2"
          placeholder="cam-01-channel"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Transport</label>
        <select
          value={transport}
          onChange={(e) => setTransport(e.target.value as StreamTransport)}
          className="w-full rounded-xl border px-3 py-2"
        >
          <option value="local-hls">Local HLS</option>
          <option value="kvs-webrtc">KVS WebRTC</option>
          <option value="medialive-rtmp">MediaLive RTMP</option>
        </select>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleStart}
          disabled={loading || !selectedDeviceId}
          className="rounded-xl bg-black text-white px-4 py-2 disabled:opacity-50"
        >
          Start
        </button>

        <button
          onClick={handleStop}
          disabled={loading || !selectedDeviceId}
          className="rounded-xl border px-4 py-2 disabled:opacity-50"
        >
          Stop
        </button>
      </div>

      {transport === "local-hls" && (
        <div className="text-sm text-gray-600">
          Playback URL:{" "}
          <span className="font-mono break-all">{localPlaybackUrl}</span>
        </div>
      )}

      {transport === "kvs-webrtc" && (
        <div className="text-sm text-gray-600">
          KVS viewer should connect to signaling channel:
          <div className="font-mono mt-1">{channelId}</div>
        </div>
      )}

      {transport === "medialive-rtmp" && (
        <div className="text-sm text-gray-600">
          AWS MediaLive/MediaPackage transport selected.
        </div>
      )}
    </div>
  );
}