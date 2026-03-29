import type {
    IStreamService,
    StartStreamInput,
    StartStreamResult,
    StopStreamResult,
  } from "../../core/stream.interface.js";
  
  import { LocalStreamAdapter } from "../local/local-stream-adapter.js";
  import { AwsStreamAdapter } from "../aws/aws-stream.adapter.js";
  
  export class HybridStreamAdapter implements IStreamService {
    private local = new LocalStreamAdapter();
    private aws = new AwsStreamAdapter();
  
    async startStream(input: StartStreamInput): Promise<StartStreamResult> {
      if (input.transport === "local-hls") {
        const result = await this.local.startStream(input);
        return { ...result, mode: "hybrid" };
      }
  
      if (input.transport === "kvs-webrtc" || input.transport === "medialive-rtmp") {
        const result = await this.aws.startStream(input);
        return { ...result, mode: "hybrid" };
      }
  
      throw new Error(`Unsupported hybrid transport: ${input.transport}`);
    }
  
    async stopStream(input: StartStreamInput): Promise<StopStreamResult> {
      if (input.transport === "local-hls") {
        const result = await this.local.stopStream(input);
        return { ...result, mode: "hybrid" };
      }
  
      const result = await this.aws.stopStream(input);
      return { ...result, mode: "hybrid" };
    }
  }