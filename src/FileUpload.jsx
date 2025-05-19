import React, { useState, useEffect } from "react";
import axios from "axios";

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  // Fetch uploaded files
  const fetchFiles = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/files");
      setFiles(res.data);
    } catch (err) {
      setError("Failed to load uploaded files");
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  // File input handler
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setError("");
    setSuccessMessage("");
  };

  // Upload file to backend
  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file first");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      setUploading(true);
      await axios.post("http://localhost:5000/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccessMessage("File uploaded successfully");
      setError("");
      setSelectedFile(null);
      fetchFiles();
    } catch (err) {
      console.error("UPLOAD ERROR:", err);
      setError(err.response?.data?.message || "Error uploading file");
    } finally {
      setUploading(false);
    }
  };

  // Delete a file
  const handleDelete = async (fileId) => {
    try {
      await axios.delete(`http://localhost:5000/api/files/${fileId}`);
      setFiles(files.filter((file) => file._id !== fileId));
      setSuccessMessage("File deleted successfully");
      setError("");
    } catch (err) {
      console.error("DELETE ERROR:", err);
      setError("Error deleting file");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Upload File</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {successMessage && (
        <div className="alert alert-success">{successMessage}</div>
      )}

      <div className="mb-3">
        <input
          type="file"
          onChange={handleFileChange}
          className="form-control"
        />
      </div>

      <button
        onClick={handleUpload}
        className="btn btn-primary w-100 mb-4"
        disabled={uploading}
      >
        {uploading ? "Uploading..." : "Upload File"}
      </button>

      <h4>Uploaded Files</h4>
      {files.length === 0 ? (
        <p>No files uploaded yet.</p>
      ) : (
        <ul className="list-group">
          {files.map((file) => (
            <li
              key={file._id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <span>{file.filename}</span>

              <div className="btn-group">
                {/* View button */}
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-outline-primary"
                >
                  View
                </a>

                {/* Download button */}
                <a
                  href={file.url}
                  download
                  className="btn btn-sm btn-outline-success"
                >
                  Download
                </a>

                {/* Delete button */}
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(file._id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FileUpload;
