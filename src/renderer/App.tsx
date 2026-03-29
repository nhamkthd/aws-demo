import React, { useEffect, useMemo, useState } from "react";
import { fetchDevices } from "./services/device-api.js";
import { fetchMode } from "./services/media-api.js";
import type { DeviceStatus } from "./types/api.js";

import DevicePanel from "./components/DevicePanel.js";
import StreamControlPanel from "./components/StreamControllPanel.js";
import HlsPlayer from "./components/HlsPlayer.js";
import ConvertPanel from "./components/ConvertPanel.js";
import KvsViewerPanel from "./components/KvsViewerPanel.js";
import ElectronInfoPanel from "./components/ElectronInfoPanel.js";

export default function App() {
  const [devices, setDevices] = useState<DeviceStatus[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>("cam-01");
  const [mode, setMode] = useState<"local" | "hybrid" | "aws">("local");
  const [statusMessage, setStatusMessage] = useState("Ready");
  const [playbackUrl, setPlaybackUrl] = useState<string | undefined>();
  const [activeChannelId, setActiveChannelId] =
    useState<string>("cam-01-channel");

  const selectedDevice = useMemo(
    () => devices.find((d) => d.deviceId === selectedDeviceId),
    [devices, selectedDeviceId]
  );

  const load = async () => {
    try {
      const [modeRes, deviceRes] = await Promise.all([
        fetchMode(),
        fetchDevices(),
      ]);

      setMode(modeRes);
      setDevices(deviceRes);

      if (deviceRes.length > 0 && !selectedDeviceId) {
        setSelectedDeviceId(deviceRes[0].deviceId);
      }
    } catch (err: any) {
      console.error(err);
      setStatusMessage(`Load failed: ${err.message}`);
    }
  };

  useEffect(() => {
    load();
    const id = setInterval(load, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold">AWS Video Streaming PoC</h1>
            <p className="text-gray-600 mt-1">
              Device Control + Local Media + AWS Hybrid Verification
            </p>
          </div>

          <div className="rounded-2xl border bg-white px-4 py-3 shadow-sm">
            <div className="text-sm text-gray-500">Current Mode</div>
            <div className="text-lg font-semibold">{mode}</div>
          </div>
        </header>

        <div className="rounded-2xl border bg-white px-4 py-3 shadow-sm">
          <div className="text-sm text-gray-500">Status</div>
          <div className="font-medium">{statusMessage}</div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="space-y-6">
            <ElectronInfoPanel />
            <DevicePanel
              devices={devices}
              selectedDeviceId={selectedDeviceId}
              onSelect={setSelectedDeviceId}
            />
            <ConvertPanel onStatusMessage={setStatusMessage} />
          </div>

          <div className="space-y-6 xl:col-span-2">
            <StreamControlPanel
              selectedDeviceId={selectedDeviceId}
              onPlaybackUrlChange={setPlaybackUrl}
              onStatusMessage={(msg) => {
                setStatusMessage(msg);
                setActiveChannelId("cam-01-channel");
              }}
            />

            <div className="grid grid-cols-1 2xl:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h2 className="text-xl font-semibold">Local HLS Preview</h2>
                <HlsPlayer url={playbackUrl} />
                {playbackUrl && (
                  <div className="text-sm text-gray-600 break-all">
                    {playbackUrl}
                  </div>
                )}
              </div>

              <KvsViewerPanel channelId={activeChannelId} />
            </div>

            {selectedDevice && (
              <div className="rounded-2xl border bg-white p-5 shadow-sm">
                <h2 className="text-lg font-semibold mb-3">Selected Device</h2>
                <div className="text-sm space-y-2">
                  <div>
                    <strong>Device ID:</strong> {selectedDevice.deviceId}
                  </div>
                  <div>
                    <strong>Online:</strong> {String(selectedDevice.online)}
                  </div>
                  <div>
                    <strong>Streaming:</strong>{" "}
                    {String(selectedDevice.streaming)}
                  </div>
                  <div>
                    <strong>Last Seen:</strong>{" "}
                    {selectedDevice.lastSeenAt || "-"}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
