"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {
  open: boolean;
}

const Sidebar: React.FC<Props> = ({ open }) => {
  const pathname = usePathname();

  const navItems = [
    {
      name: "Dashboard",
      href: "/home",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor">
          <path strokeWidth={1.8} d="M3 12l2-2m0 0l7-7 7 7M5 10v10h14V10" />
        </svg>
      ),
    },
    {
      name: "Normal Traffic",
      href: "/traffic/normal",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor">
          <path strokeWidth={1.8} d="M3 17l6-6 4 4 8-8" />
        </svg>
      ),
    },
    {
      name: "Suspicious Traffic",
      href: "/traffic/suspicious",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor">
          <path strokeWidth={1.8} d="M12 3v18M3 12h18" />
        </svg>
      ),
    },
    {
      name: "Attack Traffic",
      href: "/traffic/attack",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor">
          <path strokeWidth={1.8} d="M12 2l7 4v6c0 5-3 9-7 10-4-1-7-5-7-10V6l7-4z" />
        </svg>
      ),
    },
    {
      name: "Settings",
      href: "/settings",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor">
          <path strokeWidth={1.8} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  return (
    <aside
      className={`h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-gray-200 flex flex-col border-r border-gray-800 transition-all duration-300 ${
        open ? "w-64" : "w-16"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-gray-800">
        <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-indigo-600 text-white font-bold shadow-md">
          ⚡
        </div>
        {open && (
          <span className="text-lg font-semibold tracking-wide">
            DDoS Shield
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-2">
        {navItems.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                active
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              {item.icon}

              {open && <span>{item.name}</span>}

              {/* Tooltip (collapsed mode) */}
              {!open && (
                <span className="absolute left-16 bg-gray-800 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                  {item.name}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom (Logout) */}
      <div className="p-3 border-t border-gray-800">
        <Link
          href="/"
          className="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-600/20 transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor">
            <path strokeWidth={1.8} d="M17 16l4-4m0 0l-4-4m4 4H7" />
          </svg>

          {open && <span>Logout</span>}

          {!open && (
            <span className="absolute left-16 bg-gray-800 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100">
              Logout
            </span>
          )}
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;