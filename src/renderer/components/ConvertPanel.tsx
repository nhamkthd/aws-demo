import React, { useState } from "react";
import { startConvert } from "../services/media-api.js";

type Props = {
  onStatusMessage: (msg: string) => void;
};

export default function ConvertPanel({ onStatusMessage }: Props) {
  const [jobId, setJobId] = useState(`job-${Date.now()}`);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleStart = async () => {
    try {
      setLoading(true);
      const res = await startConvert(jobId);
      setResult(res.result);
      onStatusMessage(`Convert job started: ${res.result.jobId}`);
    } catch (err: any) {
      console.error(err);
      onStatusMessage(`Convert failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm space-y-4">
      <h2 className="text-lg font-semibold">MediaConvert</h2>

      <input
        value={jobId}
        onChange={(e) => setJobId(e.target.value)}
        className="w-full rounded-xl border px-3 py-2"
        placeholder="job id"
      />

      <button
        onClick={handleStart}
        disabled={loading}
        className="rounded-xl bg-black text-white px-4 py-2 disabled:opacity-50"
      >
        Start Convert
      </button>

      {result && (
        <div className="text-sm space-y-2">
          <div><strong>Job ID:</strong> {result.jobId}</div>
          <div><strong>Status:</strong> {result.status}</div>
          {result.outputUrl && (
            <div className="break-all"><strong>Output:</strong> {result.outputUrl}</div>
          )}
          {result.thumbnailsUrl && (
            <div className="break-all"><strong>Thumbs:</strong> {result.thumbnailsUrl}</div>
          )}
        </div>
      )}
    </div>
  );
}