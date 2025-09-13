"use client";

import { useState } from "react";

interface CreateFolderProps {
  onCreate?: () => void; // ✅ callback to refresh list
}

export default function CreateFolder({ onCreate }: CreateFolderProps) {
  const [folderName, setFolderName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!folderName.trim()) return;

    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/api/folders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ name: folderName }),
      });

      const data = await res.json();
      console.log("Folder create response:", data);

      if (res.ok) {
        setFolderName("");
        if (onCreate) onCreate(); // ✅ refresh parent after success
      }
    } catch (err) {
      console.error("Create folder error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        value={folderName}
        onChange={(e) => setFolderName(e.target.value)}
        placeholder="New Folder Name"
        className="border px-3 py-2 rounded w-48"
      />
      <button
        onClick={handleCreate}
        disabled={loading}
        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Creating..." : "Create Folder"}
      </button>
    </div>
  );
}
    