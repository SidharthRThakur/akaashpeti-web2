"use client";
import { ChangeEvent, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

interface Props {
  ownerId: string;
}

export default function FileUpload({ ownerId }: Props) {
  const [isDisabled, setIsDisabled] = useState(false);

  const handleFiles = async (files: FileList) => {
    if (!files.length) return;

    setIsDisabled(true);

    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append("files", file));

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/api/files/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token ?? ""}` },
        body: formData,
      });

      if (res.ok) {
        alert("Files uploaded successfully");
      } else {
        alert("Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload error");
    } finally {
      setIsDisabled(false);
    }
  };

  return (
    // @ts-ignore
    <input
      type="file"
      className="hidden"
      multiple
      onChange={(e: ChangeEvent<HTMLInputElement>) => e.target.files && handleFiles(e.target.files)}
      disabled={isDisabled}
      webkitdirectory="true"
      directory="true"
    />
  );
}
