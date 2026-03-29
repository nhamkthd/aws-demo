import { api } from "./api";
import type {
  DeviceStatus,
  StartStreamResponse,
  StopStreamResponse,
  StreamTransport,
} from "../types/api";

export async function fetchDevices(): Promise<DeviceStatus[]> {
  const res = await api.get("/device");
  return res.data.devices || [];
}

export async function startDeviceStream(params: {
  deviceId: string;
  channelId: string;
  transport: StreamTransport;
}): Promise<StartStreamResponse> {
  const res = await api.post(`/device/${params.deviceId}/start-stream`, {
    channelId: params.channelId,
    transport: params.transport,
  });

  return res.data;
}

export async function stopDeviceStream(params: {
  deviceId: string;
  channelId: string;
  transport: StreamTransport;
}): Promise<StopStreamResponse> {
  const res = await api.post(`/device/${params.deviceId}/stop-stream`, {
    channelId: params.channelId,
    transport: params.transport,
  });

  return res.data;
}