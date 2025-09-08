"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

interface Item {
  id: string;
  name: string;
  type: "file" | "folder";
}

interface FolderContentsResponse {
  items: Item[];
}

export default function FolderContentsPage({ params }: { params: { id: string } }) {
  const { user } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchFolderContents = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${API}/api/folders/${params.id}/contents`, {
          headers: {
            Authorization: `Bearer ${token || ""}`,
          },
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch folder contents: ${res.status}`);
        }

        const data: FolderContentsResponse = await res.json();
        setItems(data.items || []);
      } catch (err) {
        console.error("❌ Error fetching folder contents:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFolderContents();
  }, [user, params.id]);

  if (!user) return <div className="p-6">Redirecting to login.</div>;
  if (loading) return <div className="p-6">Loading folder contents...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Folder Contents</h1>
      {items.length === 0 ? (
        <p>No items found in this folder.</p>
      ) : (
        <ul className="list-disc pl-6">
          {items.map((item) => (
            <li key={item.id}>
              {item.type === "folder" ? "📁" : "📄"} {item.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
