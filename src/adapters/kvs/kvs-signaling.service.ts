import {
    KinesisVideoClient,
    DescribeSignalingChannelCommand,
    GetSignalingChannelEndpointCommand,
  } from "@aws-sdk/client-kinesis-video";
  
  import {
    KinesisVideoSignalingClient,
    GetIceServerConfigCommand,
  } from "@aws-sdk/client-kinesis-video-signaling";
  
  export async function getKvsSignalingInfo(channelName: string, region: string) {
    const kv = new KinesisVideoClient({ region });
  
    const desc = await kv.send(
      new DescribeSignalingChannelCommand({
        ChannelName: channelName,
      })
    );
  
    const channelArn = desc.ChannelInfo?.ChannelARN;
    if (!channelArn) throw new Error(`Channel not found: ${channelName}`);
  
    const endpointRes = await kv.send(
      new GetSignalingChannelEndpointCommand({
        ChannelARN: channelArn,
        SingleMasterChannelEndpointConfiguration: {
          Protocols: ["WSS", "HTTPS"],
          Role: "MASTER",
        },
      })
    );
  
    const endpoints = Object.fromEntries(
      (endpointRes.ResourceEndpointList || []).map((e) => [e.Protocol!, e.ResourceEndpoint!])
    );
  
    const signalingClient = new KinesisVideoSignalingClient({
      region,
      endpoint: endpoints.HTTPS,
    });
  
    const ice = await signalingClient.send(
      new GetIceServerConfigCommand({
        ChannelARN: channelArn,
      })
    );
  
    return {
      channelArn,
      endpoints,
      iceServers: [
        {
          urls: [`stun:stun.kinesisvideo.${region}.amazonaws.com:443`],
        },
        ...(ice.IceServerList || []).map((s) => ({
          urls: s.Uris || [],
          username: s.Username,
          credential: s.Password,
        })),
      ],
    };
  }