import type { StreamTransport } from "./types.js";

export interface StartStreamInput {
  deviceId: string;
  channelId: string;
  transport: StreamTransport;
}

export interface StartStreamResult {
  mode: "local" | "hybrid" | "aws";
  transport: StreamTransport;
  deviceId: string;
  channelId: string;
  status: "RUNNING" | "STOPPED" | "ERROR" | "IDLE" | undefined;
  playbackUrl?: string;
  ingestUrl?: string;
  signaling?: {
    channelName?: string;
    role?: "MASTER" | "VIEWER";
  };
}

export interface StopStreamResult {
  mode: "local" | "hybrid" | "aws";
  transport: StreamTransport;
  deviceId: string;
  channelId: string;
  stopped: boolean;
}

export interface IStreamService {
  startStream(input: StartStreamInput): Promise<StartStreamResult>;
  stopStream(input: StartStreamInput): Promise<StopStreamResult>;
}