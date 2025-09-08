"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

interface File {
  id: string;
  name: string;
  folder_id: string | null;
}

export default function FilesPage() {
  const { user } = useAuth();
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    async function fetchFiles() {
      setLoading(true);
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(`${API}/api/files`, { headers: { Authorization: `Bearer ${token || ""}` } });
        const data = await res.json();
        setFiles(data.files || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchFiles();
  }, [user]);

  if (!user) return <div className="p-6">Redirecting to login.</div>;
  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div>
      <h1>Files</h1>
      {files.map((file) => (
        <div key={file.id}>{file.name}</div>
      ))}
    </div>
  );
}
