import { EventEmitter } from "node:events";
import type { IIoTService } from "../../core/iot.interface.js";
import type {
  DeviceStatus,
  StartStreamCommand,
  StopStreamCommand,
} from "../../core/types.js";

const bus = new EventEmitter();

type CommandHandlers = {
  onStartStream?: (cmd: StartStreamCommand) => Promise<void>;
  onStopStream?: (cmd: StopStreamCommand) => Promise<void>;
};

export class LocalIoTAdapter implements IIoTService {
  private knownDevices = new Map<string, DeviceStatus>();

  async connect(): Promise<void> {
    console.log("[Local IoT] Connected");
  }

  async publishDeviceOnline(deviceId: string): Promise<void> {
    this.upsertDevice(deviceId, { online: true });
    bus.emit(`devices/${deviceId}/status/online`, { deviceId });
  }

  async publishDeviceOffline(deviceId: string): Promise<void> {
    this.upsertDevice(deviceId, { online: false, streaming: false });
    bus.emit(`devices/${deviceId}/status/offline`, { deviceId });
  }

  async publishHeartbeat(deviceId: string): Promise<void> {
    this.upsertDevice(deviceId, { online: true });
    bus.emit(`devices/${deviceId}/status/heartbeat`, { deviceId });
  }

  async sendStartStream(cmd: StartStreamCommand): Promise<void> {
    bus.emit(`devices/${cmd.deviceId}/commands/start-stream`, cmd);
  }

  async sendStopStream(cmd: StopStreamCommand): Promise<void> {
    bus.emit(`devices/${cmd.deviceId}/commands/stop-stream`, cmd);
  }

  async subscribeToCommands(deviceId: string, handlers: CommandHandlers): Promise<void> {
    bus.on(`devices/${deviceId}/commands/start-stream`, async (cmd) => {
      await handlers.onStartStream?.(cmd);
    });

    bus.on(`devices/${deviceId}/commands/stop-stream`, async (cmd) => {
      await handlers.onStopStream?.(cmd);
    });
  }

  async getKnownDevices(): Promise<DeviceStatus[]> {
    return [...this.knownDevices.values()];
  }

  private upsertDevice(deviceId: string, patch: Partial<DeviceStatus>) {
    const current = this.knownDevices.get(deviceId) || {
      deviceId,
      online: false,
      streaming: false,
    };

    this.knownDevices.set(deviceId, {
      ...current,
      ...patch,
      lastSeenAt: new Date().toISOString(),
    });
  }
}