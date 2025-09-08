"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

interface SharedItem {
  id: string;
  name: string;
}

export default function SharedPage() {
  const { user } = useAuth();
  const [sharedItems, setSharedItems] = useState<SharedItem[]>([]);

  useEffect(() => {
    if (!user) return;

    const token = localStorage.getItem("token");
    (async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/shared`, {
        headers: { Authorization: `Bearer ${token || ""}` },
      });
      const json: { items: SharedItem[] } = await res.json();
      setSharedItems(json.items);
    })();
  }, [user]);

  if (!user) return <div className="p-6">Redirecting...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Shared Items</h1>
      <ul>
        {sharedItems.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}
