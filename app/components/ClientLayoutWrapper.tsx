"use client";

import { useState } from "react";
import Sidebar from "../../app/components/nav/header/Sidebar";
import Header from "../../app/components/nav/header/Header";

export default function ClientLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar open={sidebarOpen} />
      <div className="flex-1 flex flex-col overflow-auto">
        <Header toggleSidebar={toggleSidebar} />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}