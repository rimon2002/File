import fs from "fs";
import path from "path";
import File from "../models/File.js";

// Upload File
export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const file = new File({
      filename: req.file.originalname,
      url: `http://localhost:5000/uploads/${req.file.filename}`,
      localPath: req.file.path, // ✅ This is critical!
    });

    await file.save();
    res.status(200).json({ message: "File uploaded", file });
  } catch (error) {
    console.error("Upload failed:", error);
    res.status(500).json({ message: "Upload failed", error: error.message });
  }
};

// Get All Files
export const getFiles = async (req, res) => {
  try {
    const files = await File.find().sort({ createdAt: -1 });
    res.status(200).json(files);
  } catch (error) {
    console.error("Fetching files failed:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch files", error: error.message });
  }
};

// Delete File
export const deleteFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ message: "File not found" });

    const localPath = file.localPath;

    if (localPath && typeof localPath === "string") {
      const resolvedPath = path.resolve(localPath);

      if (fs.existsSync(resolvedPath)) {
        fs.unlinkSync(resolvedPath);
      } else {
        console.warn("🟡 File not found on disk:", resolvedPath);
      }
    } else {
      console.warn(
        "⚠️ Skipping disk delete: localPath is missing or invalid:",
        localPath
      );
    }

    await File.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("❌ Delete failed:", error.message);
    res.status(500).json({ message: "Delete failed", error: error.message });
  }
};
