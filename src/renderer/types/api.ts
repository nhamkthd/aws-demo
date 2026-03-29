export type StreamTransport = "local-hls" | "kvs-webrtc" | "medialive-rtmp";

export interface DeviceStatus {
  deviceId: string;
  online: boolean;
  streaming: boolean;
  lastSeenAt?: string;
}

export interface StartStreamResponse {
  ok: boolean;
  command: "start-stream";
  deviceId: string;
  channelId: string;
  transport: StreamTransport;
}

export interface StopStreamResponse {
  ok: boolean;
  command: "stop-stream";
  deviceId: string;
  channelId: string;
  transport: StreamTransport;
}

export interface ModeResponse {
  ok: boolean;
  mode: "local" | "hybrid" | "aws";
}

export interface ConvertStartResult {
  ok: boolean;
  result: {
    mode: "local" | "hybrid" | "aws";
    jobId: string;
    status: "SUBMITTED" | "PROCESSING" | "COMPLETED" | "FAILED";
    outputUrl?: string;
    thumbnailsUrl?: string;
  };
}