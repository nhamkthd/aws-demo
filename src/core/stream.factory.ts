import { config } from "../config.js";
import type { IStreamService } from "./stream.interface.js";

import { LocalStreamAdapter } from "../adapters/local/local-stream-adapter.js";
import { AwsStreamAdapter } from "../adapters/aws/aws-stream.adapter.js";
import { HybridStreamAdapter } from "../adapters/hybrid/bybrid-stream.adapter.js";

export function createStreamService(): IStreamService {
  switch (config.appMode) {
    case "local":
      return new LocalStreamAdapter();

    case "hybrid":
      return new HybridStreamAdapter();

    case "aws":
      return new AwsStreamAdapter();

    default:
      return new LocalStreamAdapter();
  }
}