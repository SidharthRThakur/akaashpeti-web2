// apps/web/app/settings/page.tsx
"use client";

import { useEffect, useState } from "react";

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function fetchUser() {
      const res = await fetch("http://localhost:8080/api/users/me", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      if (res.ok) setUser(data.user);
    }
    fetchUser();
  }, []);

  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Settings</h1>
      {user ? (
        <div className="space-y-2">
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>ID:</strong> {user.id}</p>
        </div>
      ) : (
        <p>Loading profile…</p>
      )}
      <button onClick={logout} className="px-4 py-2 rounded bg-red-600 text-white">
        Logout
      </button>
    </div>
  );
}
