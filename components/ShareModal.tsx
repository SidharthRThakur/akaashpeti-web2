"use client";

import { useState } from "react";

// Ensure API URL is defined at runtime
const API = process.env.NEXT_PUBLIC_API_URL;

if (!API) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined in environment variables");
}

console.log("API URL:", API); // Debugging: Will print correct API URL at runtime

type Props = {
  isOpen: boolean;
  onClose: () => void;
  itemId: string;
  itemType: "file" | "folder";
};

export default function ShareModal({ isOpen, onClose, itemId, itemType }: Props) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"viewer" | "editor">("viewer");
  const [message, setMessage] = useState("");

  async function handleShare() {
    if (!email) {
      setMessage("Enter email");
      return;
    }

    const token = localStorage.getItem("token");

    const res = await fetch(`${API}/api/share`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token || ""}`,
      },
      body: JSON.stringify({
        file_id: itemId,    // Correct key as per backend
        email: email,       // Correct key as per backend
        access_level: role, // Correct key as per backend
      }),
    });

    if (res.ok) {
      setMessage("Shared successfully");
      setEmail("");
      setRole("viewer");
    } else {
      const j = await res.json().catch(() => ({}));
      setMessage(j?.error || "Share failed");
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white w-96 p-6 rounded shadow">
        <h3 className="text-lg font-semibold mb-3">Share {itemType}</h3>
        <input
          type="email"
          placeholder="Enter email to share with"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded mb-3"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as "viewer" | "editor")}
          className="w-full p-2 border rounded mb-3"
        >
          <option value="viewer">Viewer</option>
          <option value="editor">Editor</option>
        </select>
        {message && <div className="text-sm text-gray-600 mb-3">{message}</div>}
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 rounded bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleShare}
            className="px-3 py-1 rounded bg-blue-600 text-white"
          >
            Share
          </button>
        </div>
      </div>
    </div>
  );
}
