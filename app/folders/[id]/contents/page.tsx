// apps/web/app/folders/[id]/contents/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/router";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export default function FolderContentsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { id } = router.query;
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !id) return;
    const token = localStorage.getItem("token");
    (async () => {
      try {
        const res = await fetch(`${API}/api/folders/${id}/contents`, {
          headers: { Authorization: `Bearer ${token || ""}` }
        });
        const json = await res.json();
        setItems(json.items || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [user, id]);

  if (!user) return <div className="p-6">Redirecting.</div>;
  if (loading) return <div className="p-6">Loading.</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Folder Contents</h2>
      {items.length === 0 ? (
        <div className="text-gray-500">No items found in folder</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map(it => (
            <div key={it.id} className="p-4 border rounded shadow">
              <div className="font-medium">{it.name}</div>
              <div className="text-xs text-gray-500">{it.type}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
