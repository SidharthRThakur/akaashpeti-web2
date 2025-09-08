"use client";

import { useEffect, useState } from "react";

interface LinkShare {
  id: string;
  resource_id: string;
  resource_type: string;
  token: string;
  expires_at: string | null;
  created_at: string;
}

export default function LinksPage() {
  const [links, setLinks] = useState<LinkShare[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch("http://localhost:8080/api/link-shares", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (data.link_shares) {
          setLinks(data.link_shares);
        }
      } catch (err) {
        console.error("Error fetching links:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLinks();
  }, []);

  const revokeLink = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await fetch(`http://localhost:8080/api/link-shares/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      setLinks((prev) => prev.filter((link) => link.id !== id));
    } catch (err) {
      console.error("Error revoking link:", err);
    }
  };

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Public Links</h1>

      {links.length === 0 ? (
        <p>No public links found.</p>
      ) : (
        <table className="w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Resource Type</th>
              <th className="p-2 border">Token</th>
              <th className="p-2 border">Expires At</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {links.map((link) => {
              const isExpired =
                link.expires_at && new Date(link.expires_at) < new Date();

              return (
                <tr key={link.id} className="text-center">
                  <td className="p-2 border">{link.resource_type}</td>
                  <td className="p-2 border font-mono text-sm">{link.token}</td>
                  <td className="p-2 border">
                    {isExpired ? (
                      <span className="text-red-500">Expired</span>
                    ) : (
                      link.expires_at || "No expiry"
                    )}
                  </td>
                  <td className="p-2 border flex justify-center gap-2">
                    <button
                      onClick={() =>
                        navigator.clipboard.writeText(
                          `http://localhost:8080/api/link-shares/${link.token}`
                        )
                      }
                      className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Copy
                    </button>
                    <button
                      onClick={() => revokeLink(link.id)}
                      className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Revoke
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
