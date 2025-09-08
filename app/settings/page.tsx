"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

interface SettingsData {
  theme: string;
  notificationsEnabled: boolean;
}

export default function SettingsPage() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<SettingsData | null>(null);

  const fetchSettings = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/settings`, {
      headers: { Authorization: `Bearer ${token || ""}` },
    });
    const json: SettingsData = await res.json();
    setSettings(json);
  };

  if (!user) return <div className="p-6">Redirecting to login...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Settings</h1>
      <button onClick={fetchSettings} className="bg-blue-500 text-white p-2 rounded">
        Load Settings
      </button>

      {settings && (
        <div className="mt-4">
          <p>Theme: {settings.theme}</p>
          <p>Notifications Enabled: {settings.notificationsEnabled ? "Yes" : "No"}</p>
        </div>
      )}
    </div>
  );
}
