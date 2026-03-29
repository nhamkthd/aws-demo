import { PutObjectCommand } from "@aws-sdk/client-s3";
import { realS3 } from "../aws/s3.js";
import { config } from "../config.js";

export async function uploadToRealS3(fileBuffer: Buffer, fileName: string, contentType: string) {
  await realS3.send(
    new PutObjectCommand({
      Bucket: config.buckets.real.input,
      Key: fileName,
      Body: fileBuffer,
      ContentType: contentType,
    })
  );

  return {
    bucket: config.buckets.real.input,
    key: fileName,
    location: `s3://${config.buckets.real.input}/${fileName}`,
  };
}