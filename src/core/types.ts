export type AppMode = "local" | "hybrid" | "aws";
export type MediaMode = "local" | "hybrid" | "aws";

export type StreamTransport = "local-hls" | "kvs-webrtc" | "medialive-rtmp";

/* =========================================================
 * MEDIA / LIVE / CONVERT
 * ========================================================= */

export interface StartLiveInput {
  channelId: string;
}

export interface StartLiveResult {
  mode: MediaMode;
  channelId: string;
  status: "RUNNING" | "STOPPED" | "ERROR";
  playbackUrl?: string;
  ingestUrl?: string;
}

export interface StopLiveResult {
  mode: MediaMode;
  channelId?: string;
  stopped: boolean;
}

export interface ConvertInput {
  jobId?: string;
  inputKey?: string;
}

export interface ConvertResult {
  mode: MediaMode;
  jobId: string;
  status: "SUBMITTED" | "PROCESSING" | "COMPLETED" | "FAILED";
  outputUrl?: string;
  thumbnailsUrl?: string;
}

export interface PlaybackResult {
  mode: MediaMode;
  channelId: string;
  playbackUrl?: string;
}

/* =========================================================
 * DEVICE / IOT
 * ========================================================= */
export interface DeviceStatus {
  deviceId: string;
  online: boolean;
  streaming: boolean;
  lastSeenAt?: string;

  kvsChannelId?: string;
  kvsSignalingConnected?: boolean;

  localHlsUrl?: string;
  awsPlaybackUrl?: string;

  streamSessionId?: string;
}
export interface DeviceStreamState {
  deviceId: string;
  channelId?: string;
  transport?: StreamTransport;
  streaming: boolean;
  playbackUrl?: string;
  ingestUrl?: string;
}

export interface StartStreamCommand {
  deviceId: string;
  channelId: string;
  transport?: StreamTransport;
}

export interface StopStreamCommand {
  deviceId: string;
  channelId: string;
  transport?: StreamTransport;
}

/* =========================================================
 * WEBRTC / KVS
 * ========================================================= */

export interface WebRtcSessionInfo {
  channelName: string;
  role: "MASTER" | "VIEWER";
  clientId: string;
}