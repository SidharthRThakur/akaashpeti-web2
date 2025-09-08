"use client";

import { useEffect, useState } from "react";

interface FileItem {
  id: string;
  name: string;
  url: string;
}

const FileList = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const token = localStorage.getItem("token");

        console.log("🔎 Debug - API URL:", apiUrl);
        console.log("🔎 Debug - Token exists:", !!token);

        if (!token) {
          setError("No token found. Please login again.");
          return;
        }

        const res = await fetch(`${apiUrl}/api/files`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch files: ${res.status}`);
        }

        const data = await res.json();
        setFiles(data);
      } catch (err: any) {
        console.error("❌ Error fetching files:", err);
        setError(err.message);
      }
    };

    fetchFiles();
  }, []);

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Uploaded Files</h2>
      <ul className="list-disc pl-6">
        {files.map((file) => (
          <li key={file.id}>
            <a
              href={file.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              {file.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileList;
