"use client";

import React, { useState, useRef, useEffect } from "react";
import Layout from "../Layout";
import Swal from "sweetalert2";
import { UserProfile } from "@/app/api/types/types";
import { getProfile, updateProfile } from "@/app/api/client/profile";

const ProfilePage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  
  // Form fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [userBio, setUserBio] = useState("");
  const [timezone, setTimezone] = useState("America/Los_Angeles");
  
  // Avatar states
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile();
        if (response.status === "success" && response.data) {
          setProfile(response.data);
          // Populate form fields
          setFirstName(response.data.user.first_name || "");
          setLastName(response.data.user.last_name || "");
          setEmail(response.data.user.email || "");
          setUsername(response.data.user.username || "");
          setUserBio(response.data.userBio || "");
          
          // Set avatar preview if exists
          if (response.data.profile_picture) {
            const fullUrl = response.data.profile_picture.startsWith("http")
              ? response.data.profile_picture
              : `${process.env.NEXT_PUBLIC_API_BASE_URL}${response.data.profile_picture}`;
            setAvatarPreview(fullUrl);
          }
        } else {
          Swal.fire({
            title: "Error",
            text: response.message || "Failed to load profile",
            icon: "error",
            confirmButtonColor: "#16a34a",
          });
        }
      } catch (error: any) {
        console.error("Failed to fetch profile:", error);
        Swal.fire({
          title: "Error",
          text: error?.response?.data?.message || "Failed to load profile",
          icon: "error",
          confirmButtonColor: "#16a34a",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, []);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setAvatarError(null);

    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/gif", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      setAvatarError("Only JPG, GIF, or PNG files are allowed.");
      return;
    }

    // Validate file size (1MB)
    if (file.size > 1024 * 1024) {
      setAvatarError("File size must not exceed 1MB.");
      return;
    }

    // Preview image
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    
    // Store file for upload
    setAvatarFile(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSave = async () => {
    setSaving(true);
    
    try {
      const updateData: any = {
        first_name: firstName,
        last_name: lastName,
        email: email,
        username: username,
        userBio: userBio,
      };
      
      if (avatarFile) {
        updateData.profile_picture = avatarFile;
      }
      
      const response = await updateProfile(updateData);
      
      if (response.status === "success") {
        Swal.fire({
          title: "Success!",
          text: "Profile updated successfully",
          icon: "success",
          confirmButtonColor: "#16a34a",
          timer: 2000,
          showConfirmButton: false,
          backdrop: true,
          heightAuto: false,
        });
        
        // Refresh profile data
        const refreshedProfile = await getProfile();
        if (refreshedProfile.status === "success" && refreshedProfile.data) {
          setProfile(refreshedProfile.data);
        }
      } else {
        Swal.fire({
          title: "Error",
          text: response.message || "Failed to update profile",
          icon: "error",
          confirmButtonColor: "#16a34a",
        });
      }
    } catch (error: any) {
      console.error("Failed to update profile:", error);
      Swal.fire({
        title: "Error",
        text: error?.response?.data?.message || "Failed to update profile",
        icon: "error",
        confirmButtonColor: "#16a34a",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-[#f6f9fc] to-[#eef2f8] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-[#f6f9fc] to-[#eef2f8] py-8 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6 sm:p-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile Settings</h1>

              {/* Avatar Section */}
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

              {/* Form Fields */}
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <textarea
                    value={userBio}
                    onChange={(e) => setUserBio(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <div className="pt-4">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full sm:w-auto px-6 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? "Saving..." : "Save Changes"}
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