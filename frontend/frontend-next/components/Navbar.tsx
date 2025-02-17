"use client";

import { UserIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [userData, setUserData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found!");
        return;
      }

      const decoded = JSON.parse(atob(token.split(".")[1])); // Decode JWT
      const userId = decoded.id;

      document.cookie = `token=${token}; path=/`; // Set token as a cookie

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/user/profile`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true, // Include credentials
        }
      );

      setUserData(response.data.user);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 403) {
          console.error("Access denied. Redirecting to login page.");
          router.push("/login");
        } else {
          console.error("Failed to fetch user profile:", err.message);
        }
      } else {
        console.error("An unexpected error occurred:", err);
      }
    }
  };

  return (
    <nav className="bg-gray-900 text-white flex justify-between p-4">
      <h1 className="text-xl font-bold">Dashboard</h1>
      <div className="flex items-center gap-4">
        <span>{userData?.email}</span>
        <button
          onClick={() => router.push("/profile")}
          className="w-10 h-10 rounded-full overflow-hidden border border-gray-500"
        >
          {userData?.profilePic ? (
            <img
              src={userData.profilePic}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <UserIcon className="w-full h-full text-gray-400" />
          )}
        </button>
      </div>
    </nav>
  );
}
