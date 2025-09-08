// apps/web/components/Sidebar.tsx
"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export default function Sidebar() {
  const { logout } = useAuth();
  const router = useRouter();
  const [uploading, setUploading] = useState(false);

  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  async function handleUploadChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`${API}/api/files`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token || ""}` }, // DO NOT set Content-Type
        body: formData,
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        console.error("Upload failed", json);
        alert("Upload failed: " + (json?.error || res.statusText));
      } else {
        // Success
        alert(json?.message || "Upload succeeded");
        router.refresh(); // refresh current page data
      }
    } catch (err) {
      console.error("Upload failed", err);
      alert("Upload failed: " + (err as any).message || String(err));
    } finally {
      setUploading(false);
      // clear the input so same file can be uploaded again if needed
      const targ = e.target as HTMLInputElement;
      if (targ) targ.value = "";
    }
  }

  return (
    <aside className="w-72 bg-white border-r p-4 hidden md:block">
      <nav className="space-y-3">
        <Link href="/dashboard" className="block px-3 py-2 rounded hover:bg-gray-100">
          📁 My Drive
        </Link>
        <Link href="/files" className="block px-3 py-2 rounded hover:bg-gray-100">
          📄 All Files
        </Link>
        <Link href="/shared" className="block px-3 py-2 rounded hover:bg-gray-100">
          🤝 Shared
        </Link>
        <Link href="/trash" className="block px-3 py-2 rounded hover:bg-gray-100">
          🗑 Trash
        </Link>

        <div className="mt-4">
          <label className="block bg-gray-100 px-3 py-2 rounded cursor-pointer">
            ⬆️ {uploading ? "Uploading..." : "Upload File"}
            <input type="file" onChange={handleUploadChange} className="hidden" />
          </label>
        </div>

        <div className="mt-4">
          <button
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              logout();
            }}
            className="w-full bg-red-500 text-white px-3 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </nav>
    </aside>
  );
}
