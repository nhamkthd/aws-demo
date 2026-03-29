export type AppMode = "local" | "hybrid" | "aws";

export interface BaseIoTEvent {
  deviceId: string;
  timestamp: string;
  mode: AppMode;
}

export interface DeviceHeartbeatEvent extends BaseIoTEvent {
  type: "heartbeat";
  online: true;
}

export interface DeviceStatusEvent extends BaseIoTEvent {
  type: "status";
  online: boolean;
  streaming: boolean;
  kvsChannelId?: string;
  localHlsUrl?: string;
  awsPlaybackUrl?: string;
}

export interface StreamStartedEvent extends BaseIoTEvent {
  type: "stream_started";
  streaming: true;
  kvsChannelId?: string;
  localHlsUrl?: string;
  awsPlaybackUrl?: string;
}

export interface StreamStoppedEvent extends BaseIoTEvent {
  type: "stream_stopped";
  streaming: false;
}

export interface DeviceCommandEvent extends BaseIoTEvent {
  type: "command";
  command: "start_stream" | "stop_stream" | "ping";
}

export type IoTEvent =
  | DeviceHeartbeatEvent
  | DeviceStatusEvent
  | StreamStartedEvent
  | StreamStoppedEvent
  | DeviceCommandEvent;