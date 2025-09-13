// apps/web/app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import ShareModal from "../components/ShareModal"; // ✅ import modal

export default function DashboardPage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  const [files, setFiles] = useState<any[]>([]);
  const [shareTarget, setShareTarget] = useState<{ id: string; type: "file" | "folder" } | null>(null);

  useEffect(() => {
    if (!user || !token) {
      router.push("/auth/login");
      return;
    }

    async function fetchFiles() {
      try {
        const res = await fetch(`${API}/api/files`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setFiles(data.files || []);
        } else {
          console.error("API error:", data.error);
        }
      } catch (err) {
        console.error("Failed to load files:", err);
      }
    }

    fetchFiles();
  }, [user, token, router, API]);

  if (!user) {
    return <p className="text-center mt-10">Redirecting to login...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Welcome to Your Dashboard</h1>
      <p className="mt-2 text-gray-600">
        Logged in as <span className="font-medium">{user.email}</span>
      </p>

      <h2 className="text-lg font-semibold mt-6 mb-2">Your Files</h2>
      {files.length === 0 ? (
        <p className="text-gray-500">No files uploaded yet.</p>
      ) : (
        <ul className="space-y-2">
          {files.map((file) => (
            <li
              key={file.id}
              className="flex justify-between items-center border p-2 rounded"
            >
              <span>{file.name}</span>
              <button
                onClick={() =>
                  setShareTarget({ id: file.id, type: "file" }) // ✅ open modal for this file
                }
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Share
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* ✅ Render modal when shareTarget is set */}
      {shareTarget && (
        <ShareModal
          itemId={shareTarget.id}
          itemType={shareTarget.type}
          onClose={() => setShareTarget(null)}
        />
      )}
    </div>
  );
}
