
type Props = {
  channelId?: string;
};

export default function KvsViewerPanel({ channelId }: Props) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold mb-4">KVS WebRTC Viewer</h2>

      {!channelId ? (
        <div className="text-sm text-gray-500">
          No KVS channel selected yet.
        </div>
      ) : (
        <div className="space-y-2 text-sm">
          <div>
            Signaling Channel:
            <div className="font-mono mt-1">{channelId}</div>
          </div>

          <div className="text-gray-600">
            This panel is ready for real KVS viewer integration.
          </div>
        </div>
      )}
    </div>
  );
}
