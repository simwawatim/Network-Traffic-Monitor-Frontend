"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

interface Props {
  open: boolean;
}

const Sidebar: React.FC<Props> = ({ open }) => {
  const pathname = usePathname();

  useEffect(() => {
    console.log("[Sidebar] Mounted");
    return () => console.log("[Sidebar] Unmounted");
  }, []);

  useEffect(() => {
    console.log("[Sidebar] Pathname changed:", pathname);
  }, [pathname]);

  useEffect(() => {
    console.log("[Sidebar] Open state:", open);
  }, [open]);

  const navItems = [
    {
      name: "Normal Traffic",
      href: "/traffic/normal",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeWidth={1.8} d="M3 17l6-6 4 4 8-8" />
        </svg>
      ),
    },
    {
      name: "Suspicious Traffic",
      href: "/traffic/suspicious",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeWidth={1.8}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      ),
    },
    {
      name: "DDoS Traffic",
      href: "/traffic/attack",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeWidth={1.8}
            d="M12 2l7 4v6c0 5-3 9-7 10-4-1-7-5-7-10V6l7-4z"
          />
        </svg>
      ),
    },
    {
      name: "Missing Data",
      href: "/traffic/missing/data",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeWidth={1.8}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
    },
  ];

  const handleNavClick = (itemName: string, href: string) => {
    console.log("[Sidebar] Navigation click:", itemName, "->", href);
  };

  console.log("[Sidebar] Render triggered, open =", open);

  return (
    <aside
      className={`h-screen bg-white text-gray-700 flex flex-col border-r border-gray-100 bg-white rounded-3xl shadow-[0_20px_35px_-12px_rgba(0,0,0,0.08),0_2px_6px_rgba(0,0,0,0.02)] border border-gray-100/80 ease-in-out ${
        open ? "w-64" : "w-16"
      }`}
    >
      {/* Brand header - refined green theme */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-gray-100">
        <Link href="/home">
            <div className="w-9 h-9 flex items-center cursor-pointer">
              <Image
                src="/system-logo.png"
                alt="Logo"
                width={36}
                height={36}
                className="object-cover rounded-lg"
              />
            </div>
          </Link>

        {open && (
          <div className="flex flex-col transition-all duration-200">
            <span className="text-base font-bold tracking-tight text-green-700">
              DDoS
            </span>
            <span className="text-[11px] font-medium text-gray-400 tracking-wide uppercase">
              Detection System
            </span>
          </div>
        )}
      </div>

      {/* Navigation links - improved hover and active states */}
      <nav className="flex-1 px-3 py-6 space-y-1.5">
        {navItems.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => handleNavClick(item.name, item.href)}
              className={`
                relative group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                transition-all duration-200 ease-in-out
                ${
                  active
                    ? "text-green-600 bg-green-50/50"
                    : "text-gray-600 hover:text-green-600 hover:bg-gray-50"
                }
              `}
            >
              {/* Icon container with slight scaling on hover */}
              <div
                className={`
                  transition-all duration-200
                  ${active ? "text-green-600" : "text-gray-500 group-hover:text-green-600"}
                  group-hover:scale-105
                `}
              >
                {item.icon}
              </div>

              {open && (
                <span className="transition-all duration-200">{item.name}</span>
              )}

              {/* Tooltip when closed */}
              {!open && (
                <span className="absolute left-full ml-3 px-2.5 py-1.5 bg-gray-800 text-white text-xs font-medium rounded-md shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                  {item.name}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout button - refined red hover */}
      <div className="p-3 border-t border-gray-100">
        <Link
          href="/"
          onClick={() => console.log("[Sidebar] Logout clicked")}
          className="relative group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:text-red-600 hover:bg-red-50 transition-all duration-200"
        >
          <div className="transition-transform duration-200 group-hover:scale-105">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeWidth={1.8}
                d="M17 16l4-4m0 0l-4-4m4 4H7"
              />
            </svg>
          </div>

          {open && <span>Logout</span>}

          {!open && (
            <span className="absolute left-full ml-3 px-2.5 py-1.5 bg-gray-800 text-white text-xs font-medium rounded-md shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
              Logout
            </span>
          )}
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;