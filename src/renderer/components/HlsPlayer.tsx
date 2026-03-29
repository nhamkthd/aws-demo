import { useEffect, useRef } from "react";
import Hls from "hls.js";

type Props = {
  url?: string | undefined
};

export default function HlsPlayer({ url }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !url) return;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(url);
      hls.attachMedia(video);

      return () => {
        hls.destroy();
      };
    }

    if (video.canPlayType?.("application/vnd.apple.mpegurl")) {
      video.src = url;
    }
  }, [url]);

  return (
    <div className="rounded-2xl border bg-black overflow-hidden">
      <video
        ref={videoRef}
        controls
        autoPlay
        muted
        playsInline
        className="w-full h-[360px] bg-black"
      />
    </div>
  );
}