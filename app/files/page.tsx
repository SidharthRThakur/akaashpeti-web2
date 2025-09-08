"use client";
import { useEffect, useState } from "react";

interface File {
  id: string;
  name: string;
  url: string;
}

export default function FilesPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const token = localStorage.getItem("token");

        if (!token) {
          setError("No token found. Please login again.");
          return;
        }

        const res = await fetch(`${apiUrl}/api/files`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch files: ${res.status}`);
        }

        const data = await res.json();
        setFiles(data.files || []);
      } catch (err: unknown) {
        console.error("Error fetching files:", err);
        setError((err as Error).message);
      }
    };

    fetchFiles();
  }, []);

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-2">All Files</h2>
      <ul className="list-disc pl-6">
        {files.map((file) => (
          <li key={file.id}>
            <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
              {file.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
