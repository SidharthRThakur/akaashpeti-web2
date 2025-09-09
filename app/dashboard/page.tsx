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

  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");
    if (token && email) setUser({ email });
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");

      try {
        const [foldersRes, filesRes] = await Promise.all([
          fetch(`${API}/api/folders`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API}/api/files`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        const foldersData = await foldersRes.json();
        const filesData = await filesRes.json();

        setFolders(foldersData.folders ?? []);
        setFiles(filesData.files ?? []);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
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
    } else {
      console.error("Failed to create folder");
    }
  };

  if (!user) return <div className="p-6">Redirecting to login...</div>;
  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">My Drive</h2>

      <input type="text" value={newFolder} onChange={(e) => setNewFolder(e.target.value)} placeholder="New folder name" className="border p-2 rounded" />
      <button onClick={createFolder} className="bg-green-600 text-white px-3 py-2 rounded ml-2">Create</button>

      <h3 className="mt-6 font-medium">Folders</h3>
      {folders.length === 0 ? <p>No folders yet</p> : folders.map((f) => <div key={f.id}>{f.name}</div>)}

      <h3 className="mt-6 font-medium">Files</h3>
      {files.length === 0 ? <p>No files yet</p> : files.map((file) => <div key={file.id}>{file.name}</div>)}
    </div>
  );
}
