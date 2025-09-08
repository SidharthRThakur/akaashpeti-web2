// apps/web/app/files/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export default function FilesPage() {
  const { user } = useAuth();
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const token = localStorage.getItem("token");
    (async () => {
      try {
        const res = await fetch(`${API}/api/files`, { headers: { Authorization: `Bearer ${token || ""}` }});
        const json = await res.json();
        setFiles(json.files || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  if (!user) return <div className="p-6">Redirecting...</div>;
  if (loading) return <div className="p-6">Loading files...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">All Files</h2>
      {files.length === 0 ? <div className="text-gray-500">No files</div> : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {files.map(f => (
            <div key={f.id} className="p-4 border rounded shadow">
              <div className="font-medium">{f.name}</div>
              <div className="text-xs text-gray-500">{f.mime_type}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
