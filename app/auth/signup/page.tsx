"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const res = await fetch(`${API}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // Save token and email to localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("email", email);

        // Redirect to dashboard
        router.push("/dashboard");
      } else {
        // Handle specific errors (e.g., duplicate email)
        if (data.message.includes("duplicate key")) {
          setErrorMessage("This email is already registered.");
        } else {
          setErrorMessage(data.message || "Signup failed. Please try again.");
        }
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("An unexpected error occurred.");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create Your Account</h1>

      <form onSubmit={handleSignup} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded"
        />

        {errorMessage && (
          <div className="text-red-500">{errorMessage}</div>
        )}

        <button type="submit" className="w-full bg-green-600 text-white p-2 rounded">
          Sign Up
        </button>
      </form>

      <p className="mt-4 text-center">
        Already have an account?{" "}
        <a href="/auth/login" className="text-blue-600 underline">
          Login
        </a>
      </p>
    </div>
  );
}
