// apps/web/app/components/Sidebar.tsx
"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export default function Sidebar() {
  const { user, logout } = useAuth();
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
        alert("Upload failed: " + (json?.error || res.statusText));
      } else {
        alert(json?.message || "Upload succeeded");
        // refresh page after upload
        router.refresh();
      }
    } catch (err: any) {
      alert("Upload failed: " + (err?.message || String(err)));
    } finally {
      setUploading(false);
      (e.target as HTMLInputElement).value = "";
    }
  }

  async function handleLogout() {
    logout(); // update provider + localStorage
    // immediately navigate to login (use app router path)
    router.replace("/auth/login");
  }

  return (
    <aside className="w-72 bg-white border-r p-4 hidden md:block">
      <nav className="space-y-3">
        <Link href="/dashboard" className="block px-3 py-2 rounded hover:bg-gray-100">📁 My Drive</Link>
        <Link href="/files" className="block px-3 py-2 rounded hover:bg-gray-100">📄 All Files</Link>
        <Link href="/shared" className="block px-3 py-2 rounded hover:bg-gray-100">🤝 Shared</Link>
        <Link href="/trash" className="block px-3 py-2 rounded hover:bg-gray-100">🗑 Trash</Link>

        <div className="mt-4">
          <label className="block bg-gray-100 px-3 py-2 rounded cursor-pointer">
            ⬆️ {uploading ? "Uploading..." : "Upload File"}
            <input type="file" onChange={handleUploadChange} className="hidden" />
          </label>
        </div>

        {user && (
          <div className="mt-4">
            <button onClick={handleLogout} className="w-full bg-red-500 text-white px-3 py-2 rounded">Logout</button>
          </div>
        )}
      </nav>
    </aside>
  );
}
