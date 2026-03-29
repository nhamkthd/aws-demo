import type {
    DeviceStatus,
    StartStreamCommand,
    StopStreamCommand,
  } from "./types.js";

  /**
    devices/{deviceId}/status/online
    devices/{deviceId}/status/offline
    devices/{deviceId}/status/heartbeat
    devices/{deviceId}/state

    devices/{deviceId}/commands/start-stream
    devices/{deviceId}/commands/stop-stream

    devices/{deviceId}/events/stream-started
    devices/{deviceId}/events/stream-stopped
    devices/{deviceId}/events/error
   */
  
  export interface IIoTService {
    connect(): Promise<void>;
    publishDeviceOnline(deviceId: string): Promise<void>;
    publishDeviceOffline(deviceId: string): Promise<void>;
    publishHeartbeat(deviceId: string): Promise<void>;
  
    sendStartStream(cmd: StartStreamCommand): Promise<void>;
    sendStopStream(cmd: StopStreamCommand): Promise<void>;
  
    subscribeToCommands(
      deviceId: string,
      handlers: {
        onStartStream?: (cmd: StartStreamCommand) => Promise<void>;
        onStopStream?: (cmd: StopStreamCommand) => Promise<void>;
      }
    ): Promise<void>;
  
    getKnownDevices(): Promise<DeviceStatus[]>;
  }