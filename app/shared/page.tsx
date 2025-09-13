// apps/web/app/shared/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

interface SharedItem {
  id: string;
  item_name: string;
  item_type: "file" | "folder";
  role: string;
}

export default function SharedPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [sharedWithMe, setSharedWithMe] = useState<SharedItem[]>([]);
  const [sharedByMe, setSharedByMe] = useState<SharedItem[]>([]);
  const [loading, setLoading] = useState(true);

  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  // ✅ redirect if not logged in
  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  useEffect(() => {
    if (!user) return;

    async function fetchShared() {
      try {
        const token = localStorage.getItem("token");
        const [withMeRes, byMeRes] = await Promise.all([
          fetch(`${API}/api/share/shared-with-me`, {
            headers: { Authorization: `Bearer ${token || ""}` },
          }),
          fetch(`${API}/api/share/shared-by-me`, {
            headers: { Authorization: `Bearer ${token || ""}` },
          }),
        ]);

        const withMeData = await withMeRes.json();
        const byMeData = await byMeRes.json();

        setSharedWithMe(withMeData.sharedWithMe || []);
        setSharedByMe(byMeData.sharedByMe || []);
      } catch (err) {
        console.error("Failed to fetch shared items", err);
      } finally {
        setLoading(false);
      }
    }

    fetchShared();
  }, [API, user]);

  if (!user) return null;

  return (
    <main className="flex-1 p-6">
      <h1 className="text-2xl font-bold mb-4">Shared</h1>

      {loading ? (
        <p>Loading shared items...</p>
      ) : (
        <>
          <section className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Shared With Me</h2>
            {sharedWithMe.length === 0 ? (
              <p className="text-gray-500">No items shared with you.</p>
            ) : (
              <ul className="space-y-2">
                {sharedWithMe.map((item) => (
                  <li
                    key={item.id}
                    className="p-3 border rounded flex justify-between items-center"
                  >
                    <span>
                      {item.item_name} ({item.item_type}) —{" "}
                      <span className="italic text-sm">{item.role}</span>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-2">Shared By Me</h2>
            {sharedByMe.length === 0 ? (
              <p className="text-gray-500">You haven’t shared any items yet.</p>
            ) : (
              <ul className="space-y-2">
                {sharedByMe.map((item) => (
                  <li
                    key={item.id}
                    className="p-3 border rounded flex justify-between items-center"
                  >
                    <span>
                      {item.item_name} ({item.item_type}) —{" "}
                      <span className="italic text-sm">{item.role}</span>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </main>
  );
}
