import { Router } from "express";
import multer from "multer";
import { uploadToLocalS3 } from "../services/upload-local.service.js";
import { uploadToRealS3 } from "../services/upload-real.service.js";

const router:Router = Router();
const upload = multer();

router.post("/local", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const result = await uploadToLocalS3(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype
    );

    res.json({ ok: true, target: "localstack", result });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/real", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const result = await uploadToRealS3(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype
    );

    res.json({ ok: true, target: "real-aws", result });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;