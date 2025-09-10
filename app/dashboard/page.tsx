"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Folder {
  id: string;
  name: string;
}

interface File {
  id: string;
  name: string;
}

export default function DashboardPage() {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [newFolder, setNewFolder] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{ id: string; type: "file" | "folder" } | null>(null);
  const [recipientEmail, setRecipientEmail] = useState("");

  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user) {
      try {
        setUser(JSON.parse(user));
      } catch (err) {
        console.error("Invalid user object in localStorage", err);
      }
    }
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");

      try {
        const foldersRes = await fetch(`${API}/api/folders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const filesRes = await fetch(`${API}/api/files`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const foldersData = await foldersRes.json();
        const filesData = await filesRes.json();

        setFolders(foldersData.folders || []);
        setFiles(filesData.files || []);
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const createFolder = async () => {
    if (!newFolder.trim()) return;

    const token = localStorage.getItem("token");

    const res = await fetch(`${API}/api/folders`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name: newFolder, parent_id: null }),
    });

    if (res.ok) {
      setNewFolder("");
      window.location.reload();
    }
  };

  const openShare = (id: string, type: "file" | "folder") => {
    setSelectedItem({ id, type });
    setShareOpen(true);
    setRecipientEmail("");
  };

  const handleShare = async () => {
    if (!recipientEmail.trim() || !selectedItem) return;

    const token = localStorage.getItem("token");

    const res = await fetch(`${API}/api/share`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        item_id: selectedItem.id,
        item_type: selectedItem.type,
        recipient_email: recipientEmail,
      }),
    });

    if (res.ok) {
      alert("Shared successfully!");
      setShareOpen(false);
    } else {
      alert("Failed to share. Please try again.");
    }
  };

  if (!user) return <div className="p-6">Redirecting to login.</div>;
  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">My Drive</h2>
        <div className="flex items-center space-x-3">
          <input
            type="text"
            placeholder="New folder name"
            value={newFolder}
            onChange={(e) => setNewFolder(e.target.value)}
            className="border p-2 rounded"
          />
          <button onClick={createFolder} className="bg-green-600 text-white px-3 py-2 rounded">
            Create
          </button>
        </div>
      </div>

      <section className="mb-8">
        <h3 className="text-lg font-medium mb-3">Folders</h3>
        {folders.length === 0 ? (
          <div className="text-gray-500">No folders yet</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {folders.map((f) => (
              <div key={f.id} className="p-4 border rounded shadow relative text-center">
                <Link href={`/folders/${f.id}/contents`} className="block">
                  <div className="text-4xl">📁</div>
                  <div className="mt-2 font-medium">{f.name}</div>
                </Link>
                <button
                  onClick={() => openShare(f.id, "folder")}
                  className="absolute top-2 right-2 text-blue-600 underline cursor-pointer"
                >
                  Share
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h3 className="text-lg font-medium mb-3">Files</h3>
        {files.length === 0 ? (
          <div className="text-gray-500">No files yet</div>
        ) : (
          <ul>
            {files.map((file) => (
              <li key={file.id} className="mb-2">
                {file.name}
                <button
                  onClick={() => openShare(file.id, "file")}
                  className="ml-2 text-blue-600 underline cursor-pointer"
                >
                  Share
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {shareOpen && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-96">
            <h3 className="text-xl font-semibold mb-4">Share file</h3>
            <div className="mb-3">
              <p>ID: {selectedItem.id}</p>
            </div>
            <input
              type="email"
              placeholder="Enter recipient email"
              className="border p-2 rounded w-full mb-3"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
            />
            <div className="flex space-x-4">
              <button
                onClick={handleShare}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Share Now
              </button>
              <button
                onClick={() => setShareOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
