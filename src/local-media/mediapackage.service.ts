export function getLocalPlaybackUrl(channelId: string) {
  return `http://localhost:3000/media/live/${channelId}/index.m3u8`;
}
