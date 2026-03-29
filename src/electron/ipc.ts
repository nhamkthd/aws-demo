import { ipcMain, shell, app } from "electron";

export function registerIpcHandlers() {
  ipcMain.handle("app:ping", async () => {
    return "pong";
  });

  ipcMain.handle("app:get-info", async () => {
    return {
      name: app.getName(),
      version: app.getVersion(),
      packaged: app.isPackaged,
      platform: process.platform,
    };
  });

  ipcMain.handle("app:open-external", async (_event, url: string) => {
    await shell.openExternal(url);
    return true;
  });
}