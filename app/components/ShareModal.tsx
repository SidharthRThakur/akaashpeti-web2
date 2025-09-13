// apps/web/components/ShareModal.tsx
"use client";
import { useState } from "react";

interface ShareModalProps {
  itemId: string;
  itemType: "file" | "folder"; // ✅ now passed in
  onClose: () => void;
}

export default function ShareModal({ itemId, itemType, onClose }: ShareModalProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("viewer");

  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  async function handleShare() {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API}/api/share`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token || ""}`,
        },
        body: JSON.stringify({
          item_id: itemId,
          item_type: itemType, // ✅ dynamic
          email,
          access_level: role,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to share");
      } else {
        alert("Shared successfully");
        onClose();
      }
    } catch (err: any) {
      console.error("Share failed:", err);
      alert(err.message || "Share failed");
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow w-96">
        <h2 className="text-xl font-semibold mb-4">Share {itemType}</h2>
        <p className="text-sm text-gray-500 mb-2">ID: {itemId}</p>

        <input
          type="email"
          placeholder="Recipient email"
          className="w-full p-2 border rounded mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full p-2 border rounded mb-3"
        >
          <option value="viewer">Viewer</option>
          <option value="editor">Editor</option>
        </select>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
            Close
          </button>
          <button
            onClick={handleShare}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Share Now
          </button>
        </div>
      </div>
    </div>
  );
}
