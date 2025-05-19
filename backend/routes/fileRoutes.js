import express from "express";
import multer from "multer";
import {
  uploadFile,
  getFiles,
  deleteFile,
} from "../controllers/fileController.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads"); // store in /uploads
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // unique name
  },
});

const upload = multer({ storage });

router.post("/upload", upload.single("file"), uploadFile);
router.get("/files", getFiles);
router.delete("/files/:id", deleteFile);

export default router;
