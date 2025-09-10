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
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{ id: string; type: "file" | "folder" } | null>(null);

  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");
    if (token && email) {
      setUser({ email });
    } else {
      // Redirect explicitly to login page if not authenticated
      window.location.href = "/auth/login";
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
  };

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
                <span
                  onClick={() => openShare(file.id, "file")}
                  className="ml-2 text-blue-600 underline cursor-pointer"
                >
                  Share
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {shareOpen && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-medium mb-2">Share {selectedItem.type}</h3>
            <p>ID: {selectedItem.id}</p>
            {/* Insert form fields to specify the user/email to share with */}
            <button onClick={() => setShareOpen(false)} className="mt-4 bg-gray-500 text-white px-3 py-2 rounded">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
