import {
  MediaConvertClient,
  DescribeEndpointsCommand,
} from "@aws-sdk/client-mediaconvert";
import { config } from "../config.js";

let cachedClient: MediaConvertClient | null = null;

export async function getMediaConvertClient() {
  if (cachedClient) return cachedClient;

  // AWS docs note DescribeEndpoints is kept mainly for backward compatibility;
  // regional endpoint usage is preferred, but this still works for account-specific discovery.
  const bootstrap = new MediaConvertClient({
    region: config.region,
  });

  const endpoints = await bootstrap.send(new DescribeEndpointsCommand({}));
  const endpoint = endpoints.Endpoints?.[0]?.Url;

  if (!endpoint) {
    throw new Error("No MediaConvert endpoint found");
  }

  cachedClient = new MediaConvertClient({
    region: config.region,
    endpoint,
  });

  return cachedClient;
}