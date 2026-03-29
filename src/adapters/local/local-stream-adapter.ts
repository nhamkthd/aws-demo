import type {
    IStreamService,
    StartStreamInput,
    StartStreamResult,
    StopStreamResult,
  } from "../../core/stream.interface.js";
  
  import {
    startLocalMediaLive,
    stopLocalMediaLive,
  } from "../../local-media/medialive.service.js";
  
  export class LocalStreamAdapter implements IStreamService {
    async startStream(input: StartStreamInput): Promise<StartStreamResult> {
      if (input.transport !== "local-hls") {
        throw new Error(`Local mode only supports local-hls, got: ${input.transport}`);
      }
  
      const result = await startLocalMediaLive(input.channelId);
  
      return {
        mode: "local",
        transport: "local-hls",
        deviceId: input.deviceId,
        channelId: input.channelId,
        status: result.session?.status || "ERROR",
        playbackUrl: result.session?.playbackUrl,
      };
    }
  
    async stopStream(input: StartStreamInput): Promise<StopStreamResult> {
      stopLocalMediaLive();
  
      return {
        mode: "local",
        transport: "local-hls",
        deviceId: input.deviceId,
        channelId: input.channelId,
        stopped: true,
      };
    }
  }