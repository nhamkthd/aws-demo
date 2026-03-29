import { config } from "../config.js";
import type { IIoTService } from "./iot.interface.js";

import { LocalIoTAdapter } from "../adapters/iot/local-iot.adapter.js";
import { AwsIoTAdapter } from "../adapters/iot/aws-iot.adapter.js";
import { HybridIoTAdapter } from "../adapters/iot/hybrid-iot.adapter.js";

export function createIoTService(): IIoTService {
  switch (config.appMode) {
    case "local":
      return new LocalIoTAdapter();
    case "hybrid":
      return new HybridIoTAdapter();
    case "aws":
      return new AwsIoTAdapter();
    default:
      return new LocalIoTAdapter();
  }
}