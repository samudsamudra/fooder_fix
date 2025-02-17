"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  HomeIcon,
  UserGroupIcon,
  ClipboardIcon,
  CogIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/outline";

const menuKasir = [
  { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
  { name: "Transaksi", href: "/dashboard/transaksi", icon: ClipboardIcon },
];

const menuManager = [
  { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
  { name: "Kelola Pengguna", href: "/dashboard/users", icon: UserGroupIcon },
];

export default function Sidebar() {
  const [role, setRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const decoded = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
    setRole(decoded.role);
  }, [router]);

  const menuItems = role === "MANAGER" ? menuManager : menuKasir;

  return (
    <div className="bg-gray-800 text-white h-screen w-64 flex flex-col">
      <div className="px-6 py-4 text-lg font-bold border-b border-gray-700">Toko Makanan</div>
      <nav className="flex-1 mt-4">
        {menuItems.map((item) => (
          <a
            key={item.name}
            href={item.href}
            className="flex items-center px-4 py-3 hover:bg-gray-700 transition"
          >
            <item.icon className="w-6 h-6 mr-3" />
            {item.name}
          </a>
        ))}
      </nav>
      <button
        className="flex items-center px-4 py-3 hover:bg-red-600 transition mt-auto"
        onClick={() => {
          localStorage.removeItem("token");
          router.push("/login");
        }}
      >
        <ArrowLeftOnRectangleIcon className="w-6 h-6 mr-3" />
        Logout
      </button>
    </div>
  );
}
