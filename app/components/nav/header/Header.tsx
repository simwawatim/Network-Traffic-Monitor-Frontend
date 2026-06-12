"use client";

import { getProfilePicture } from "@/app/api/client/profile";
import Link from "next/link";
import { useEffect, useState } from "react";


interface Props {
  toggleSidebar: () => void;
}

interface User {
  id: number;
  username: string;
  email: string;
}

const Header: React.FC<Props> = ({ toggleSidebar }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(null);

  useEffect(() => {
    const storedUser =
      localStorage.getItem("user") || sessionStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (e) {
        console.error("Failed to parse user data", e);
      }
    }

    const fetchProfilePicture = async () => {
      try {
        const response = await getProfilePicture();
        if (response.status === "success" && response.data?.profile_picture) {
          const relativePath = response.data.profile_picture;
          const fullUrl = relativePath.startsWith("http")
            ? relativePath
            : `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000"}${relativePath}`;
          setProfilePictureUrl(fullUrl);
        } else {
          setProfilePictureUrl(null);
        }
      } catch (error) {
        console.error("Failed to fetch profile picture:", error);
        setProfilePictureUrl(null);
      }
    };

    fetchProfilePicture();
  }, []);

  const getInitial = () => {
    if (user?.username) return user.username.charAt(0).toUpperCase();
    return "U";
  };

  return (
    <header className="sticky top-0 z-40 bg-transparent px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-full hover:bg-gray-100/50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500"
          aria-label="Toggle sidebar"
        >
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-full hover:bg-gray-100/50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500">
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" strokeWidth={1.8}>
            <path d="M15 17h5l-1.5-1.5A2 2 0 0118 14V11a6 6 0 10-12 0v3a2 2 0 01-.5 1.5L4 17h5m6 0a3 3 0 11-6 0" />
          </svg>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-1 ring-white"></span>
        </button>

        <Link href="/profile">
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-700 leading-tight">
                {user ? `Welcome, ${user.username}` : "Welcome"}
              </p>
              <p className="text-xs text-gray-500">
                {user ? user.email : "User"}
              </p>
            </div>

            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-semibold shadow-sm transition-transform group-hover:scale-105 overflow-hidden">
              {profilePictureUrl ? (
                <img
                  src={profilePictureUrl}
                  alt={user?.username || "User"}
                  className="w-full h-full object-cover"
                />
              ) : (
                getInitial()
              )}
            </div>
          </div>
        </Link>
      </div>
    </header>
  );
};

export default Header;