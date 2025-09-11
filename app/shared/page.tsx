"use client";
import { useEffect, useState } from "react";

interface SharedItem {
  id: string;
  name: string;
  type: "file" | "folder";
}

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export default function SharedPage() {
  const [sharedItems, setSharedItems] = useState<SharedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSharedItems = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(`${API}/api/shared`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          setSharedItems(Array.isArray(data.sharedItems) ? data.shared : []);
        } else {
          console.error("Failed to fetch shared items", await res.text());
          setSharedItems([]);
        }
      } catch (error) {
        console.error("Error fetching shared items:", error);
        setSharedItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSharedItems();
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Shared Items</h2>
      {sharedItems.length === 0 ? (
        <div>No shared items available</div>
      ) : (
        <ul>
          {sharedItems.map((item) => (
            <li key={item.id} className="mb-2">
              {item.type === "folder" ? "📁" : "📄"} {item.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
