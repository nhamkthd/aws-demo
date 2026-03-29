import { PutObjectCommand } from "@aws-sdk/client-s3";
import { localS3 } from "../aws/s3.js";
import { config } from "../config.js";

export async function uploadToLocalS3(fileBuffer: Buffer, fileName: string, contentType: string) {
  await localS3.send(
    new PutObjectCommand({
      Bucket: config.buckets.local.input,
      Key: fileName,
      Body: fileBuffer,
      ContentType: contentType,
    })
  );

  return {
    bucket: config.buckets.local.input,
    key: fileName,
    location: `localstack://${config.buckets.local.input}/${fileName}`,
  };
}