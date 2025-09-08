"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

interface TrashItem {
  id: string;
  name: string;
  deletedAt: string;
}

export default function TrashPage() {
  const { user } = useAuth();
  const [trashItems, setTrashItems] = useState<TrashItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const token = localStorage.getItem("token");
    (async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/trash`, {
          headers: { Authorization: `Bearer ${token || ""}` },
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch trash items: ${res.status}`);
        }

        const json: { items: TrashItem[] } = await res.json();
        setTrashItems(json.items);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  if (!user) return <div className="p-6">Redirecting to login...</div>;
  if (loading) return <div className="p-6">Loading trash items...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Trash Bin</h1>
      <ul>
        {trashItems.map((item) => (
          <li key={item.id}>
            {item.name} (Deleted at: {new Date(item.deletedAt).toLocaleString()})
          </li>
        ))}
      </ul>
    </div>
  );
}
