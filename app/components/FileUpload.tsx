"use client";

import { ChangeEvent, useRef, useState, useEffect } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

interface Props {
  ownerId: string;
}

export default function FileUpload({ ownerId }: Props) {
  const [isDisabled, setIsDisabled] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute("webkitdirectory", "true");
      fileInputRef.current.setAttribute("directory", "true");
    }
  }, []);

  const handleFiles = async (files: FileList) => {
    if (!files.length) return;

    setIsDisabled(true);

    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append("files", file);
    });

    try {
      const token = localStorage.getItem("token");
      await fetch(`${API}/api/files/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token || ""}`,
        },
        body: formData,
      });
      alert("Files uploaded successfully");
    } catch (err) {
      console.error(err);
      alert("File upload failed");
    } finally {
      setIsDisabled(false);
    }
  };

  return (
    <input
      ref={fileInputRef}
      type="file"
      className="hidden"
      multiple
      onChange={(e: ChangeEvent<HTMLInputElement>) =>
        e.target.files && handleFiles(e.target.files)
      }
      disabled={isDisabled}
    />
  );
}
