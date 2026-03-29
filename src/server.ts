import express from "express";
import cors from "cors";
import path from "node:path";

import healthRoute from "./routes/health.js";
import uploadRoute from "./routes/upload.js";
import mediaRoute from "./routes/media.js";
import deviceRoute from "./routes/device.js";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.use("/api/health", healthRoute);
app.use("/api/upload", uploadRoute);
app.use("/api/media", mediaRoute);
app.use("/api/device", deviceRoute);

app.use("/media/live", express.static(path.resolve("storage/live")));
app.use("/media/vod", express.static(path.resolve("storage/vod")));

app.listen(port, () => {
  console.log(`🚀 Local control-plane running at http://localhost:${port}`);
});