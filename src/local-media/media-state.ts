export interface LocalLiveSession {
    id: string;
    status: "IDLE" | "RUNNING" | "STOPPED" | "ERROR";
    outputDir: string;
    playlistPath: string;
    playbackUrl: string;
    startedAt?: string;
  }
  
  export let currentLiveSession: LocalLiveSession | null = null;
  
  export function setCurrentLiveSession(session: LocalLiveSession | null) {
    currentLiveSession = session;
  }