// apps/web/app/trash/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export default function TrashPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const token = localStorage.getItem("token");
    (async () => {
      try {
        const res = await fetch(`${API}/api/trash`, { headers: { Authorization: `Bearer ${token || ""}` }});
        const json = await res.json();
        // backend returns { files, folders } according to bundle; unify
        const combined = [...(json.files || []), ...(json.folders || [])];
        setItems(combined);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  async function restoreItem(id: string, type: string) {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API}/api/trash/restore/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token || ""}` },
      body: JSON.stringify({ type }),
    });
    if (res.ok) setItems((s) => s.filter((i) => i.id !== id));
  }

  async function deleteItem(id: string, type: string) {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API}/api/trash/${type}/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token || ""}` }});
    if (res.ok) setItems((s) => s.filter((i) => i.id !== id));
  }

  if (!user) return <div className="p-6">Redirecting...</div>;
  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Trash</h2>
      {items.length === 0 ? <div className="text-gray-500">Trash is empty</div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map(it => (
            <div key={it.id} className="p-4 border rounded shadow flex justify-between items-center">
              <div>
                <div className="font-medium">{it.name || it.item_id}</div>
                <div className="text-xs text-gray-500">{it.type || it.item_type || ""}</div>
              </div>
              <div className="space-x-2">
                <button onClick={() => restoreItem(it.id, it.type || it.item_type || "file")} className="bg-green-500 text-white px-3 py-1 rounded">Restore</button>
                <button onClick={() => deleteItem(it.id, it.type || it.item_type || "file")} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
