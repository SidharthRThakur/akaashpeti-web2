// apps/web/components/FileList.tsx
"use client";
import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

type Props = {
  ownerId: string;
};

export default function FileList({ ownerId }: Props) {
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ownerId) return;
    const token = localStorage.getItem("token");
    (async () => {
      try {
        const res = await fetch(`${API}/api/files?ownerId=${ownerId}`, {
          headers: { Authorization: `Bearer ${token || ""}` }
        });
        const json = await res.json();
        setFiles(json.files || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [ownerId]);

  if (loading) return <div>Loading files...</div>;

  return (
    <div>
      {files.length === 0 ? (
        <div className="text-gray-500">No files uploaded</div>
      ) : (
        <ul>
          {files.map((file: any) => (
            <li key={file.id}>
              {file.name} - {file.mime_type}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
