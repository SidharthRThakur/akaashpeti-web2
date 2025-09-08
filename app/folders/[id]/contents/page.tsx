// apps/web/app/folders/[id]/contents/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../../../context/AuthContext";
import ShareModal from "../../../../components/ShareModal";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export default function FolderContentsPage() {
  const { user } = useAuth();
  const params = useParams();
  const folderId = params?.id;
  const [folders, setFolders] = useState<any[]>([]);
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [shareOpen, setShareOpen] = useState(false);
  const [sel, setSel] = useState<{ id: string; type: "file" | "folder" } | null>(null);

  useEffect(() => {
    if (!user || !folderId) return;
    const token = localStorage.getItem("token");
    (async () => {
      try {
        const res = await fetch(`${API}/api/folders/${folderId}/contents`, { headers: { Authorization: `Bearer ${token || ""}` }});
        const json = await res.json();
        setFolders(json.subfolders || json.folders || []);
        setFiles(json.files || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [user, folderId]);

  function openShare(id: string, type: "file" | "folder") {
    setSel({ id, type });
    setShareOpen(true);
  }

  if (!user) return <div className="p-6">Redirecting...</div>;
  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Folder Contents</h2>

      <section className="mb-8">
        <h3 className="text-lg font-medium mb-3">Folders</h3>
        {folders.length === 0 ? <div className="text-gray-500">No subfolders</div> : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {folders.map(f => (
              <div key={f.id} className="p-4 border rounded shadow relative text-center">
                <Link href={`/folders/${f.id}/contents`} className="block">
                  <div className="text-4xl">📁</div>
                  <div className="mt-2 font-medium">{f.name}</div>
                </Link>
                <button onClick={() => openShare(f.id, "folder")} className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-sm">Share</button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h3 className="text-lg font-medium mb-3">Files</h3>
        {files.length === 0 ? <div className="text-gray-500">No files</div> : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {files.map(file => (
              <div key={file.id} className="p-4 border rounded shadow relative text-center">
                <div className="text-4xl">📄</div>
                <div className="mt-2 font-medium">{file.name}</div>
                <div className="text-xs text-gray-500">{file.mime_type}</div>
                <button onClick={() => openShare(file.id, "file")} className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-sm">Share</button>
              </div>
            ))}
          </div>
        )}
      </section>

      {shareOpen && sel && <ShareModal isOpen={shareOpen} onClose={() => setShareOpen(false)} itemId={sel.id} itemType={sel.type} />}
    </div>
  );
}
