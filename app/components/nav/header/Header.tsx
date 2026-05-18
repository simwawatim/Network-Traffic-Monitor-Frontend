"use client";

interface Props {
  toggleSidebar: () => void;
}

const Header: React.FC<Props> = ({ toggleSidebar }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      
      {/* LEFT */}
      <div className="flex items-center gap-4">
        {/* Sidebar toggle */}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100 transition"
        >
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor">
            <path strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">
        
        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-gray-100 transition">
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor">
            <path strokeWidth={1.8} d="M15 17h5l-1.5-1.5A2 2 0 0118 14V11a6 6 0 10-12 0v3a2 2 0 01-.5 1.5L4 17h5m6 0a3 3 0 11-6 0" />
          </svg>

          {/* Notification badge */}
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User */}
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-700 leading-none">
              Welcome
            </p>
            <p className="text-xs text-gray-500">User</p>
          </div>

          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center text-white font-semibold shadow-md">
            U
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;