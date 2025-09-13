// apps/web/app/files/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

interface File {
  id: string;
  name: string;
  url: string;
}

export default function FilesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  // ✅ redirect if not logged in
  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  useEffect(() => {
    if (!user) return;

    const fetchFiles = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API}/api/files`, {
          headers: { Authorization: `Bearer ${token || ""}` },
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
  }, [API, user]);

  if (!user) return null;

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-2">All Files</h2>
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
}
