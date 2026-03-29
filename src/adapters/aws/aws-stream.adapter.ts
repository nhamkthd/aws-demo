import type {
    IStreamService,
    StartStreamInput,
    StartStreamResult,
    StopStreamResult,
  } from "../../core/stream.interface.js";
  
  import { config } from "../../config.js";
  
  export class AwsStreamAdapter implements IStreamService {
    async startStream(input: StartStreamInput): Promise<StartStreamResult> {
      if (input.transport === "kvs-webrtc") {
        return {
          mode: "aws",
          transport: "kvs-webrtc",
          deviceId: input.deviceId,
          channelId: input.channelId,
          status: "RUNNING",
          signaling: {
            channelName: input.channelId,
            role: "MASTER",
          },
          playbackUrl: undefined,
        };
      }
  
      if (input.transport === "medialive-rtmp") {
        return {
          mode: "aws",
          transport: "medialive-rtmp",
          deviceId: input.deviceId,
          channelId: input.channelId,
          status: "RUNNING",
          ingestUrl: config.media.mediaLiveInputUrl,
          playbackUrl: config.media.mediaPackagePlaybackUrl,
        };
      }
  
      throw new Error(`Unsupported AWS transport: ${input.transport}`);
    }
  
    async stopStream(input: StartStreamInput): Promise<StopStreamResult> {
      return {
        mode: "aws",
        transport: input.transport,
        deviceId: input.deviceId,
        channelId: input.channelId,
        stopped: true,
      };
    }
  }