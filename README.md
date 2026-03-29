Phase	Service	Action
1. Provision	IoT Core	Electron App connects via MQTT. IoT Shadow is updated to status: "ready".
2. Request	API Gateway (Local)	Viewer clicks "Live Stream". Call sent to LocalStack.
3. Trigger	Lambda (Local)	Lambda sends StartChannel command to Real AWS MediaLive.
4. Ingest	KVS / MediaLive	Electron Camera Sim starts pushing bits to KVS (WebRTC) and MediaLive (RTMP/SRT).
5. Process	MediaPackage	MediaLive sends output to MediaPackage to generate HLS/DASH manifests.
6. Monitor	CloudWatch	Real-time logs and bitrate metrics are pulled from CloudWatch into the Electron UI.
7. Playback	CloudFront	Viewer App (React) plays the HLS stream using hls.js or Video.js.
8. Archive	MediaConvert	When stream ends, a clip is saved to S3. MediaConvert transcodes it for the "Playback History" section.

### KVS Signaling channel

AWS-POC-Test-Channel
arn:aws:kinesisvideo:us-east-2:679990114271:channel/AWS-POC-Test-Channel/1774672583860