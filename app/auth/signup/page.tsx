// apps/web/app/auth/signup/page.tsx
"use client";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "../../../context/AuthContext";

export default function SignupPage() {
  const { signup } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  try {
    await signup(email, password);
  } catch (err) {
    if (err instanceof Error) {
      setError(err.message);
    } else {
      setError("An unexpected error occurred");
    }
  }
}


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="w-96 bg-white p-8 rounded shadow">
        <h1 className="text-3xl font-bold text-blue-600 text-center mb-2">Akaash-Peti</h1>
        <p className="text-center text-sm text-gray-500 mb-6">Create your account</p>

        {error && <div className="text-red-500 mb-3 text-sm">{error}</div>}

        <input type="email" placeholder="Email" className="w-full p-2 border rounded mb-3" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" className="w-full p-2 border rounded mb-4" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded">Sign Up</button>

        <p className="text-center text-sm mt-4 text-gray-600">
          Already have an account? <Link href="/auth/login" className="text-blue-600">Login</Link>
        </p>
      </form>
    </div>
  );
}
