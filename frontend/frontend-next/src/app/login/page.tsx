"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/user/login`, {
        email,
        password,
      });

      console.log("Login response:", response.data);

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        router.push("/dashboard");
      } else {
        setError("Login berhasil, tetapi token tidak ditemukan.");
      }
    } catch (err: any) {
      console.error("Login failed:", err);
      const errorMessage = err.response?.data?.message || "Email atau password salah";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-blue-600">
      <div className="bg-white/20 backdrop-blur-lg shadow-xl rounded-lg p-8 max-w-md w-full border border-white/30">
        <h2 className="text-3xl font-bold text-white text-center mb-6">Sign in</h2>

        {error && <p className="text-red-400 text-center mb-4">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-white text-sm font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-3 mt-1 rounded-lg bg-white/30 border border-white/50 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-white text-sm font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-3 mt-1 rounded-lg bg-white/30 border border-white/50 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className={`w-full bg-white/30 hover:bg-white/50 text-white font-semibold py-3 rounded-lg transition-all duration-300 shadow-md ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-white mt-4">
          Don't have an account?{" "}
          <a href="/register" className="underline hover:text-gray-200">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
