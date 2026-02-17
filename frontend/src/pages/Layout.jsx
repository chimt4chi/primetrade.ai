import { useEffect, useState } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { apiRequest } from "../api";

export default function Layout() {
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await apiRequest("/users/profile");
        setUser(data);
      } catch {
        localStorage.removeItem("token");
        navigate("/");
      }
    };
    fetchUser();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/dashboard"
            className="text-lg font-semibold text-gray-800 hover:text-indigo-500 transition"
          >
            ✅ Todoo
          </Link>

          {/* Nav links */}
          <div className="flex items-center gap-6">
            <Link
              to="/dashboard"
              className={`text-sm font-medium transition ${
                location.pathname === "/dashboard"
                  ? "text-indigo-500"
                  : "text-gray-400 hover:text-gray-700"
              }`}
            >
              Dashboard
            </Link>

            {/* User dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2 cursor-pointer focus:outline-none"
              >
                <div className="w-8 h-8 rounded-full bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center">
                  {initials}
                </div>
                <span className="text-sm text-gray-700 font-medium">
                  {user?.name ?? "..."}
                </span>
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {dropdownOpen && (
                <>
                  {/* Backdrop */}
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setDropdownOpen(false)}
                  />
                  {/* Dropdown */}
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-md z-20 py-1 overflow-hidden">
                    <div className="px-4 py-2.5 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-800">
                        {user?.name}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {user?.email}
                      </p>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-50 transition cursor-pointer"
                    >
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Page content */}
      <main className="max-w-4xl mx-auto px-6 py-10">
        <Outlet context={{ user, setUser }} />
      </main>
    </div>
  );
}
