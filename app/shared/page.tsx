"use client";

import { useEffect, useState } from "react";

interface SharedItem {
  id: string;
  item_id: string;
  item_type: "file" | "folder";
  owner_id: string;
  shared_with: string;
  role: string;
  created_at: string;
}

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export default function SharedPage() {
  const [sharedWithMe, setSharedWithMe] = useState<SharedItem[]>([]);
  const [sharedByMe, setSharedByMe] = useState<SharedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSharedItems = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(`${API}/api/share/shared`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          setSharedWithMe(Array.isArray(data.sharedWithMe) ? data.sharedWithMe : []);
          setSharedByMe(Array.isArray(data.sharedByMe) ? data.sharedByMe : []);
        } else {
          console.error("Failed to fetch shared items", await res.text());
          setSharedWithMe([]);
          setSharedByMe([]);
        }
      } catch (error) {
        console.error("Error fetching shared items:", error);
        setSharedWithMe([]);
        setSharedByMe([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSharedItems();
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Shared With Me</h2>
      {sharedWithMe.length === 0 ? (
        <div>No items shared with you</div>
      ) : (
        <ul>
          {sharedWithMe.map((item) => (
            <li key={item.id} className="mb-2">
              {item.item_type === "folder" ? "📁" : "📄"} ID: {item.item_id}, Role: {item.role}
            </li>
          ))}
        </ul>
      )}

      <h2 className="text-2xl font-semibold my-4">Shared By Me</h2>
      {sharedByMe.length === 0 ? (
        <div>You have not shared any items yet</div>
      ) : (
        <ul>
          {sharedByMe.map((item) => (
            <li key={item.id} className="mb-2">
              {item.item_type === "folder" ? "📁" : "📄"} ID: {item.item_id}, Shared with: {item.shared_with}, Role: {item.role}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
