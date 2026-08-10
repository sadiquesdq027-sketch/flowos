"use client";

import { useState } from "react";
import { signIn } from "@/lib/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    const { error } = await signIn(email, password);

    if (error) {
      alert(error.message);
    } else {
      window.location.href = "/dashboard";
    }
  }

  return (
    <main className="max-w-md mx-auto p-10">
      <h1 className="text-4xl font-bold mb-6">Login</h1>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border p-3 rounded mb-4"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full border p-3 rounded mb-6"
      />

      <button
        onClick={handleLogin}
        className="w-full bg-black text-white p-3 rounded"
      >
        Login
      </button>
    </main>
  );
}