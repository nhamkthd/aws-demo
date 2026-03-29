export {};

declare global {
  interface Window {
    electronAPI: {
      ping: () => Promise<string>;
      getAppInfo: () => Promise<{
        name: string;
        version: string;
        packaged: boolean;
        platform: string;
      }>;
      openExternal: (url: string) => Promise<boolean>;
    };
  }
}