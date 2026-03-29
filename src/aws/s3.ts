import { S3Client } from "@aws-sdk/client-s3";
import { config } from "../config.js";

export const localS3 = new S3Client({
  region: config.region,
  endpoint: config.localstackEndpoint,
  forcePathStyle: true,
  credentials: {
    accessKeyId: "test",
    secretAccessKey: "test",
  },
});

export const realS3 = new S3Client({
  region: config.region,
});