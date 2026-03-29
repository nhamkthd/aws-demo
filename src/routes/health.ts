import { Router } from "express";
import dotenv from "dotenv";

dotenv.config();


const router:Router = Router();

router.get("/", (_req, res) => {
  res.json({
    ok: true,
    service: "aws-webrtc-poc-local-control-plane",
    ts: new Date().toISOString(),
    mode: process.env.APP_MODE || "unknown",
  });
});

export default router;