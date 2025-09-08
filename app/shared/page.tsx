// apps/web/app/shared/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export default function SharedPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const token = localStorage.getItem("token");
    (async () => {
      try {
        const res = await fetch(`${API}/api/share`, { headers: { Authorization: `Bearer ${token || ""}` }});
        const json = await res.json();
        setItems(json.shared || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  async function removeAccess(id: string) {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API}/api/share/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token || ""}` }});
    if (res.ok) setItems((s) => s.filter((i) => i.id !== id));
  }

  if (!user) return <div className="p-6">Redirecting...</div>;
  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Shared with Me</h2>
      {items.length === 0 ? <div className="text-gray-500">No shared items</div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map(it => (
            <div key={it.id} className="p-4 border rounded shadow flex justify-between items-center">
              <div>
                <div className="font-medium">{it.item_id || it.name || "Shared item"}</div>
                <div className="text-xs text-gray-500">{it.role}</div>
              </div>
              <button onClick={() => removeAccess(it.id)} className="bg-red-500 text-white px-3 py-1 rounded">Remove Access</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
