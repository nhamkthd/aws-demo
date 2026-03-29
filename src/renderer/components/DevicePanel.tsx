import React from "react";
import type { DeviceStatus } from "../types/api";

type Props = {
  devices: DeviceStatus[];
  selectedDeviceId?: string;
  onSelect: (deviceId: string) => void;
};

export default function DevicePanel({
  devices,
  selectedDeviceId,
  onSelect,
}: Props) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Devices</h2>

      <div className="space-y-3">
        {devices.length === 0 && (
          <div className="text-sm text-gray-500">No devices found yet.</div>
        )}

        {devices.map((device) => {
          const active = selectedDeviceId === device.deviceId;

          return (
            <button
              key={device.deviceId}
              onClick={() => onSelect(device.deviceId)}
              className={`w-full rounded-xl border p-3 text-left transition ${
                active ? "border-black bg-gray-50" : "hover:bg-gray-50"
              }`}
            >
              <div className="font-medium">{device.deviceId}</div>
              <div className="text-sm text-gray-600 mt-1">
                {device.online ? "Online" : "Offline"} ·{" "}
                {device.streaming ? "Streaming" : "Idle"}
              </div>
              {device.lastSeenAt && (
                <div className="text-xs text-gray-500 mt-1">
                  Last seen: {device.lastSeenAt}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}