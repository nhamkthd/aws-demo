import React, { useEffect, useState } from "react";

type AppInfo = {
  name: string;
  version: string;
  packaged: boolean;
  platform: string;
};

export default function ElectronInfoPanel() {
  const [info, setInfo] = useState<AppInfo | null>(null);
  const [ping, setPing] = useState<string>("...");

  useEffect(() => {
    const load = async () => {
      if (!window.electronAPI) return;

      const pong = await window.electronAPI.ping();
      const appInfo = await window.electronAPI.getAppInfo();

      setPing(pong);
      setInfo(appInfo);
    };

    load();
  }, []);

  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Electron Runtime</h2>

      {!info ? (
        <div className="text-sm text-gray-500">Electron bridge not ready.</div>
      ) : (
        <div className="space-y-2 text-sm">
          <div><strong>Ping:</strong> {ping}</div>
          <div><strong>App:</strong> {info.name}</div>
          <div><strong>Version:</strong> {info.version}</div>
          <div><strong>Platform:</strong> {info.platform}</div>
          <div><strong>Packaged:</strong> {String(info.packaged)}</div>
        </div>
      )}
    </div>
  );
}