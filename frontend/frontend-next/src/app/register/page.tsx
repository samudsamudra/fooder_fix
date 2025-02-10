"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>(""); // ✅ State untuk notifikasi sukses
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setProfilePic(e.target.files[0]);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage(""); // Reset notifikasi sebelum request baru

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    if (profilePic) {
      formData.append("profilePic", profilePic);
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/user/register`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Registration successful:", response.data);
      setSuccessMessage("Registrasi berhasil! Mengarahkan ke halaman login...");

      // ✅ Tunggu 2 detik sebelum redirect ke login
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      console.error("Registration failed:", err);
      const errorMessage = err.response?.data?.message || "Pendaftaran gagal";
      setError(errorMessage);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-r from-green-500 to-blue-600">
      <div className="bg-white/10 backdrop-blur-lg shadow-lg rounded-lg p-8 max-w-md w-full border border-white/20">
        <h2 className="text-3xl font-bold text-white text-center mb-6">Create an Account</h2>

        {/* ✅ Notifikasi sukses */}
        {successMessage && (
          <p className="text-green-400 text-center mb-4">{successMessage}</p>
        )}

        {/* ✅ Notifikasi error */}
        {error && <p className="text-red-400 text-center mb-4">{error}</p>}

        <form onSubmit={handleRegister} className="space-y-4">
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
          <div>
            <label className="block text-white text-sm font-medium">Profile Picture</label>
            <input
              type="file"
              title="Profile Picture"
              onChange={handleFileChange}
              className="w-full px-3 py-2 mt-1 rounded-md bg-white/20 border border-white/30 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-white/20 hover:bg-white/30 text-white font-semibold py-2 rounded-md transition-all duration-300 shadow-md"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
