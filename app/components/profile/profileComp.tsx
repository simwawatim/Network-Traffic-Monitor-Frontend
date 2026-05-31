"use client";

import React, { useState, useRef } from "react";
import Layout from "../Layout"; 
import Swal from "sweetalert2";

const ProfilePage: React.FC = () => {

  const [firstName, setFirstName] = useState("John");
  const [lastName, setLastName] = useState("Doe");
  const [email, setEmail] = useState("john.doe@example.com");
  const [username, setUsername] = useState("janesmith");
  const [timezone, setTimezone] = useState("America/Los_Angeles"); 

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);


  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setAvatarError(null);

    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/gif", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      setAvatarError("Only JPG, GIF, or PNG files are allowed.");
      return;
    }

    if (file.size > 1024 * 1024) {
      setAvatarError("File size must not exceed 1MB.");
      return;
    }


    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  
  const handleSave = () => {
    console.log({
      firstName,
      lastName,
      email,
      username,
      timezone,
      avatar: avatarPreview, 
    });
    Swal.fire({
          title: "Submitted!",
          text: `Profile updated successfully`,
          icon: "success",
          confirmButtonColor: "#16a34a",
          timer: 2000,
          showConfirmButton: false,
          backdrop: true,
          heightAuto: false,
        });
    
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-[#f6f9fc] to-[#eef2f8] py-8 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6 sm:p-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile Settings</h1>

              <div className="mb-8 flex flex-col sm:flex-row sm:items-center gap-6">
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
                    {avatarPreview ? (
                      <img
                        src={avatarPreview}
                        alt="Avatar preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <svg
                        className="w-12 h-12 text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    )}
                  </div>
                </div>
                <div>
                  <button
                    type="button"
                    onClick={triggerFileInput}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    Change avatar
                  </button>
                  <p className="text-xs text-gray-500 mt-2">JPG, GIF or PNG. 1MB max.</p>
                  {avatarError && <p className="text-xs text-red-600 mt-1">{avatarError}</p>}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/gif,image/png"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </div>
              </div>
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First name
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last name
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                      example.com/
                    </span>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="flex-1 min-w-0 block w-full px-3 py-2 rounded-r-lg border border-gray-300 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Timezone
                  </label>
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="America/Los_Angeles">Pacific Standard Time</option>
                    <option value="America/Denver">Mountain Standard Time</option>
                    <option value="America/Chicago">Central Standard Time</option>
                    <option value="America/New_York">Eastern Standard Time</option>
                    <option value="UTC">UTC</option>
                  </select>
                </div>

                <div className="pt-4">
                  <button
                    onClick={handleSave}
                    className="w-full sm:w-auto px-6 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;