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
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">My Files</h1>
      {files.length === 0 ? (
        <div className="text-gray-500">No files uploaded yet</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {files.map((file) => (
            <div key={file.id} className="p-4 border rounded shadow">
              <div className="font-medium">{file.name}</div>
              <div className="text-sm text-gray-500">Folder: {file.folder_id || "None"}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
