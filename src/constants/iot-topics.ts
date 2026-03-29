export const IoTTopics = {
    heartbeat: (deviceId: string) => `devices/${deviceId}/heartbeat`,
    status: (deviceId: string) => `devices/${deviceId}/status`,
    commands: (deviceId: string) => `devices/${deviceId}/commands`,
    streamEvents: (deviceId: string) => `devices/${deviceId}/stream/events`,
    debugEvents: () => `debug/events`,
  };
  
  export const IoTTopicSubscriptions = {
    allHeartbeats: "devices/+/heartbeat",
    allStatus: "devices/+/status",
    allCommands: "devices/+/commands",
    allStreamEvents: "devices/+/stream/events",
    allDebugEvents: "debug/events",
  };