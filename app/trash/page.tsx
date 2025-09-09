"use client";
import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export default function TrashPage() {
  const [trashItems, setTrashItems] = useState<{ id: string; name: string }[]>([]);
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) setUser(JSON.parse(userData));
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchTrash = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API}/api/trash`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          setTrashItems(data.trash ?? []);
        } else {
          console.error("Failed to fetch trash", await res.text());
          setTrashItems([]);
        }
      } catch (err) {
        console.error("Error fetching trash", err);
        setTrashItems([]);
      }
    };

    fetchTrash();
  }, [user]);

  if (!user) return <div className="p-6">Redirecting to login.</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Trash</h2>
      {trashItems.length === 0 ? (
        <p>No items in trash</p>
      ) : (
        <ul>
          {trashItems.map((item) => (
            <li key={item.id}>{item.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
