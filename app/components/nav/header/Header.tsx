"use client";

interface Props {
  toggleSidebar: () => void;
}

const Header: React.FC<Props> = ({ toggleSidebar }) => {
  return (
    <header className="sticky top-0 z-40 bg-transparent px-4 py-3 flex items-center justify-between">
      
      {/* LEFT – sidebar toggle */}
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

      {/* RIGHT – notifications & user */}
      <div className="flex items-center gap-4">
        
        {/* Notifications button */}
        <button className="relative p-2 rounded-full hover:bg-gray-100/50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500">
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" strokeWidth={1.8}>
            <path d="M15 17h5l-1.5-1.5A2 2 0 0118 14V11a6 6 0 10-12 0v3a2 2 0 01-.5 1.5L4 17h5m6 0a3 3 0 11-6 0" />
          </svg>
          {/* Active notification dot */}
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-1 ring-white"></span>
        </button>

        {/* User avatar + welcome text */}
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-700 leading-tight">Welcome</p>
            <p className="text-xs text-gray-500">User</p>
          </div>

          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-semibold shadow-sm transition-transform group-hover:scale-105">
            U
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;