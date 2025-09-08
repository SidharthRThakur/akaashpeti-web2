// apps/web/components/FileUpload.tsx
"use client";

import { useState } from "react";

interface FileUploadProps {
  onUpload?: () => void; // refresh callback
}

export default function FileUpload({ onUpload }: FileUploadProps) {
  const [uploading, setUploading] = useState(false);

  // ✅ handle files (single or multiple)
  const handleFiles = async (files: FileList) => {
    setUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("http://localhost:8080/api/files", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        });

        const data = await res.json();
        console.log("Upload response:", data);
      }

      if (onUpload) onUpload();
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex gap-3">
      {/* ✅ File Upload */}
      <label className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
        {uploading ? "Uploading..." : "Upload File"}
        <input
          type="file"
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          disabled={uploading}
        />
      </label>

      {/* ✅ Folder Upload */}
      <label className="cursor-pointer bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
        {uploading ? "Uploading..." : "Upload Folder"}
        <input
          type="file"
          className="hidden"
          webkitdirectory="true"
          directory="true"
          multiple
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          disabled={uploading}
        />
      </label>
    </div>
  );
}
