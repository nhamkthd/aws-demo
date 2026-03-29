import { CreateJobCommand } from "@aws-sdk/client-mediaconvert";
import { getMediaConvertClient } from "../aws/mediaconvert-client.js";
import { config } from "../config.js";

export async function startMediaConvertJob() {
  const client = await getMediaConvertClient();

  const inputUrl = `s3://${config.buckets.real.input}/sample.mp4`;
  const outputUrl = `s3://${config.buckets.real.output}/mediaconvert/`;

  const result = await client.send(
    new CreateJobCommand({
      Role: config.media.mediaConvertRoleArn,
      Settings: {
        Inputs: [
          {
            FileInput: inputUrl,
          },
        ],
        OutputGroups: [
          {
            Name: "File Group",
            OutputGroupSettings: {
              Type: "FILE_GROUP_SETTINGS",
              FileGroupSettings: {
                Destination: outputUrl,
              },
            },
            Outputs: [
              {
                ContainerSettings: {
                  Container: "MP4",
                },
                VideoDescription: {
                  CodecSettings: {
                    Codec: "H_264",
                    H264Settings: {
                      RateControlMode: "QVBR",
                    },
                  },
                },
                AudioDescriptions: [
                  {
                    CodecSettings: {
                      Codec: "AAC",
                      AacSettings: {
                        Bitrate: 96000,
                        CodingMode: "CODING_MODE_2_0",
                        SampleRate: 48000,
                      },
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    })
  );

  return {
    jobId: result.Job?.Id,
    inputUrl,
    outputUrl,
  };
}