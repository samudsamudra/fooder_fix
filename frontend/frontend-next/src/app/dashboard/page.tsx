"use client";

import Sidebar from "../../../components/Sidebar";
import Navbar from "../../../components/Navbar";

export default function DashboardPage() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <div className="p-6">
          <h2 className="text-2xl font-semibold text-gray-700">Selamat datang di Dashboard</h2>
          <p className="text-gray-600 mt-2">Pilih menu di sidebar untuk mulai bekerja.</p>
        </div>
      </div>
    </div>
  );
}
