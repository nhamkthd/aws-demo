import {
    mqtt,
    iot,
    auth,
    io,
  } from "aws-iot-device-sdk-v2";
  
  import type { IIoTService } from "../../core/iot.interface.js";
  import type {
    DeviceStatus,
    StartStreamCommand,
    StopStreamCommand,
  } from "../../core/types.js";
  
  type CommandHandlers = {
    onStartStream?: (cmd: StartStreamCommand) => Promise<void>;
    onStopStream?: (cmd: StopStreamCommand) => Promise<void>;
  };
  
  export class AwsIoTAdapter implements IIoTService {
    private connection?: mqtt.MqttClientConnection;
    private knownDevices = new Map<string, DeviceStatus>();
  
    async connect(): Promise<void> {
      if (this.connection) return;
  
      const clientBootstrap = new io.ClientBootstrap();
      const credentialsProvider = auth.AwsCredentialsProvider.newDefault();
  
      const config = iot.AwsIotMqttConnectionConfigBuilder
        .new_with_websockets({
          region: process.env.AWS_REGION!,
          credentials_provider: credentialsProvider,
        })
        .with_clean_session(false)
        .with_client_id(`poc-controller-${Date.now()}`)
        .with_endpoint(process.env.AWS_IOT_ENDPOINT!)
        .build();
  
      const client = new mqtt.MqttClient(clientBootstrap);
      this.connection = client.new_connection(config);
  
      await this.connection.connect();
      console.log("[AWS IoT] Connected");
    }
  
    async publishDeviceOnline(deviceId: string): Promise<void> {
      await this.publishJson(`devices/${deviceId}/status/online`, {
        deviceId,
        ts: new Date().toISOString(),
      });
  
      this.upsertDevice(deviceId, { online: true });
    }
  
    async publishDeviceOffline(deviceId: string): Promise<void> {
      await this.publishJson(`devices/${deviceId}/status/offline`, {
        deviceId,
        ts: new Date().toISOString(),
      });
  
      this.upsertDevice(deviceId, { online: false, streaming: false });
    }
  
    async publishHeartbeat(deviceId: string): Promise<void> {
      await this.publishJson(`devices/${deviceId}/status/heartbeat`, {
        deviceId,
        ts: new Date().toISOString(),
      });
  
      this.upsertDevice(deviceId, { online: true });
    }
  
    async sendStartStream(cmd: StartStreamCommand): Promise<void> {
      await this.publishJson(`devices/${cmd.deviceId}/commands/start-stream`, cmd);
    }
  
    async sendStopStream(cmd: StopStreamCommand): Promise<void> {
      await this.publishJson(`devices/${cmd.deviceId}/commands/stop-stream`, cmd);
    }
  
    async subscribeToCommands(deviceId: string, handlers: CommandHandlers): Promise<void> {
      if (!this.connection) throw new Error("AWS IoT not connected");
  
      await this.connection.subscribe(
        `devices/${deviceId}/commands/start-stream`,
        mqtt.QoS.AtLeastOnce,
        async (_topic, payload) => {
          const msg = JSON.parse(new TextDecoder().decode(payload)) as StartStreamCommand;
          await handlers.onStartStream?.(msg);
        }
      );
  
      await this.connection.subscribe(
        `devices/${deviceId}/commands/stop-stream`,
        mqtt.QoS.AtLeastOnce,
        async (_topic, payload) => {
          const msg = JSON.parse(new TextDecoder().decode(payload)) as StopStreamCommand;
          await handlers.onStopStream?.(msg);
        }
      );
    }
  
    async getKnownDevices(): Promise<DeviceStatus[]> {
      return [...this.knownDevices.values()];
    }
  
    private async publishJson(topic: string, body: unknown) {
      if (!this.connection) throw new Error("AWS IoT not connected");
  
      await this.connection.publish(
        topic,
        JSON.stringify(body),
        mqtt.QoS.AtLeastOnce
      );
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