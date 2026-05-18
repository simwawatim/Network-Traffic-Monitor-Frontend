"use client";

import React, { useState } from "react";
import Sidebar from "../components/nav/header/Sidebar";
import Header from "../components/nav/header/Header";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [open, setOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar open={open} />

      {/* Main */}
      <div className="flex-1 flex flex-col">
        <Header toggleSidebar={() => setOpen(!open)} />

        <main className="p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
