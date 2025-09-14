// apps/web/app/auth/reset-password/page.tsx
"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function ResetPasswordInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const accessToken = searchParams?.get("access_token") ?? "";

  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch(`${API}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ access_token: accessToken, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to reset password");
      } else {
        setSuccess("Password reset successful. Redirecting to login...");
        setTimeout(() => router.push("/auth/login"), 2000);
      }
    } catch (err: any) {
      setError(err.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="w-96 bg-white p-8 rounded shadow"
      >
        <h1 className="text-2xl font-bold text-blue-600 text-center mb-2">
          Reset Password
        </h1>
        <p className="text-center text-sm text-gray-500 mb-6">
          Enter your new password
        </p>

        {error && <div className="text-red-500 mb-3 text-sm">{error}</div>}
        {success && <div className="text-green-500 mb-3 text-sm">{success}</div>}

        <input
          type="password"
          placeholder="New Password"
          className="w-full p-2 border rounded mb-4"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<p className="text-center mt-10">Loading...</p>}>
      <ResetPasswordInner />
    </Suspense>
  );
}
