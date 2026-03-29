import 'dotenv/config';

export const config = {
  appMode: process.env.APP_MODE || "hybrid",
  region: process.env.AWS_REGION!,
  localstackEndpoint: process.env.LOCALSTACK_ENDPOINT!,
  sampleVideo: process.env.SAMPLE_VIDEO!,
  aws_accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
  aws_secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET!,
  
  buckets: {
    local: {
      input: process.env.LOCAL_S3_INPUT_BUCKET!,
      output: process.env.LOCAL_S3_OUTPUT_BUCKET!,
      snapshots: process.env.LOCAL_S3_SNAPSHOTS_BUCKET!,
    },
    real: {
      input: process.env.REAL_S3_INPUT_BUCKET!,
      output: process.env.REAL_S3_OUTPUT_BUCKET!,
    },
  },
  iot: {
    thingName: process.env.THING_NAME!,
    clientId: process.env.CLIENT_ID!,
    endpoint: process.env.IOT_ENDPOINT!,
    certPath: process.env.IOT_CERT_PATH!,
    keyPath: process.env.IOT_KEY_PATH!,
    caPath: process.env.IOT_CA_PATH!,
  },

  kvs: {
    channelName: process.env.KVS_CHANNEL_NAME!,
  },

  media: {
    mediaLiveInputName: process.env.MEDIALIVE_INPUT_NAME!,
    mediaLiveChannelName: process.env.MEDIALIVE_CHANNEL_NAME!,
    mediaPackageChannelGroup: process.env.MEDIAPACKAGE_CHANNEL_GROUP!,
    mediaPackageChannel: process.env.MEDIAPACKAGE_CHANNEL!,
    mediaPackageEndpoint: process.env.MEDIAPACKAGE_ENDPOINT!,
    mediaStoreContainer: process.env.MEDIASTORE_CONTAINER!,
    mediaConvertRoleArn: process.env.MEDIACONVERT_ROLE_ARN!,
    mediaLiveInputUrl: process.env.MEDIALIVE_INPUT_URL!,
    mediaPackagePlaybackUrl: process.env.MEDIAPACKAGE_PLAYBACK_URL!,
  }
};