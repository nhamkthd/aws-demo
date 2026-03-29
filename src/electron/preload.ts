import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  ping: () => ipcRenderer.invoke("app:ping"),

  getAppInfo: () =>
    ipcRenderer.invoke("app:get-info"),

  openExternal: (url: string) =>
    ipcRenderer.invoke("app:open-external", url),
});