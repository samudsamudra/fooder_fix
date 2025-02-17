"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("Token tidak ditemukan, redirect ke login...");
      router.push("/login");
      return;
    }

    fetchUserProfile(token);
  }, []); // ✅ Pakai dependency kosong biar ga infinite loop

  const fetchUserProfile = async (token: string) => {
    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      const userId = decoded.id;

      console.log(`Fetching user profile for userId: ${userId}`);

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/user/profile`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true, // Include credentials
        }
      );

      console.log("User Profile Fetched:", response.data.user);
      setUserData(response.data.user);
    } catch (err) {
      console.error("Gagal mendapatkan profil:", err);
      setError("Gagal memuat profil.");
      router.push("/login"); // ✅ Redirect ke login kalau gagal
    } finally {
      setLoading(false); // ✅ Set loading false setelah fetch selesai
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-500 text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-gray-900 text-center">
          Profile
        </h2>

        {error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : (
          <div className="mt-4 text-center">
            <div className="w-24 h-24 rounded-full mx-auto overflow-hidden border border-gray-300">
              {userData?.profilePic ? (
                <img
                  src={userData.profilePic}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-600">
                  No Image
                </div>
              )}
            </div>

            <p className="mt-2 text-lg font-semibold">{userData?.email}</p>
            <p className="text-gray-500">Role: {userData?.role}</p>
            <p className="text-gray-500">UUID: {userData?.uuid}</p>
          </div>
        )}
      </div>
    </div>
  );
}
