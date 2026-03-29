import { api } from "./api";
import type { ConvertStartResult, ModeResponse } from "../types/api";

export async function fetchMode(): Promise<ModeResponse["mode"]> {
  const res = await api.get("/media/mode");
  return res.data.mode;
}

export async function startConvert(jobId?: string): Promise<ConvertStartResult> {
  const res = await api.post("/media/convert/start", { jobId });
  return res.data;
}