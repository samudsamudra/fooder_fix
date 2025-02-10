"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/user/login`, {
        email,
        password,
      });

      console.log("Login response:", response.data);

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);

        console.log("Token stored:", localStorage.getItem("token"));

        // ✅ Setelah login berhasil, ambil data user
        fetchUserData();
      } else {
        setError("Login berhasil, tetapi token tidak ditemukan.");
      }
    } catch (err: any) {
      console.error("Login failed:", err);
      const errorMessage = err.response?.data?.message || "Email atau password salah";
      setError(errorMessage);
    }
  };

  // ✅ Fungsi untuk mengambil data user berdasarkan token
  const fetchUserData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found!");
      return;
    }

    try {
      const userResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/get-user`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("User data fetched:", userResponse.data);

      // Simpan data user ke localStorage atau state global (misal Redux)
      localStorage.setItem("user", JSON.stringify(userResponse.data));

      // **Redirect ke dashboard setelah user ditemukan**
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Fetching user failed:", err);
      setError("Gagal mengambil data user.");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600">
      <div className="bg-white/10 backdrop-blur-lg shadow-lg rounded-lg p-8 max-w-md w-full border border-white/20">
        <h2 className="text-3xl font-bold text-white text-center mb-6">Welcome Back</h2>
        {error && <p className="text-red-400 text-center mb-4">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-white text-sm font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 mt-1 rounded-md bg-white/20 border border-white/30 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-white/50"
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
              className="w-full px-3 py-2 mt-1 rounded-md bg-white/20 border border-white/30 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-white/50"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-white/20 hover:bg-white/30 text-white font-semibold py-2 rounded-md transition-all duration-300 shadow-md"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
