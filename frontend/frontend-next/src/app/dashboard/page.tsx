"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

interface User {
  email: string;
  profilePic: string;
  role: "KASIR" | "MANAGER";
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/user/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setUser(response.data))
      .catch(() => {
        localStorage.removeItem("token");
        router.push("/login");
      });
  }, [router]);

  if (!user) {
    return <div className="h-screen flex items-center justify-center text-white">Loading...</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold">Selamat datang, {user.email}!</h2>
      {user.role === "KASIR" ? <KasirDashboard /> : <ManagerDashboard />}
    </div>
  );
}

// Placeholder untuk dashboard kasir
function KasirDashboard() {
  return (
    <div className="mt-6 p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-semibold">Dashboard Kasir</h3>
      <p className="text-gray-600">Fitur kasir akan ditambahkan nanti...</p>
    </div>
  );
}

// Placeholder untuk dashboard manager
function ManagerDashboard() {
  return (
    <div className="mt-6 p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-semibold">Dashboard Manager</h3>
      <p className="text-gray-600">Fitur manager akan ditambahkan nanti...</p>
    </div>
  );
}
