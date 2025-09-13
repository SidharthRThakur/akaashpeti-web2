// apps/web/app/auth/forgot-password/page.tsx
"use client";

import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const res = await fetch(`${API}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message || "Password reset email sent");
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      setError("Failed to request password reset");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="w-96 bg-white p-8 rounded shadow"
      >
        <h1 className="text-2xl font-bold text-blue-600 mb-4 text-center">
          Forgot Password
        </h1>
        <p className="text-gray-600 text-sm mb-6 text-center">
          Enter your email and we’ll send you a reset link.
        </p>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border rounded p-2 mb-4"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Send Reset Link
        </button>

        {message && <p className="text-green-600 mt-3 text-sm">{message}</p>}
        {error && <p className="text-red-600 mt-3 text-sm">{error}</p>}

        <p className="text-sm text-center mt-4">
          <a href="/auth/login" className="text-blue-600 hover:underline">
            Back to Login
          </a>
        </p>
      </form>
    </div>
  );
}
