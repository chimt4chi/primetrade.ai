import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiRequest } from "../api";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await apiRequest("/users/profile");
        setUser(data);
        setName(data.name);
      } catch (err) {
        localStorage.removeItem("token");
        navigate("/");
      }
    };
    fetchProfile();
  }, []);

  const handleUpdate = async () => {
    setLoading(true);
    setMessage("");
    try {
      const body = { name };
      if (password) body.password = password;
      await apiRequest("/users/profile", {
        method: "PUT",
        body: JSON.stringify(body),
      });
      setMessage("Profile updated successfully!");
      setPassword("");
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-sm text-gray-400">Loading...</p>
      </div>
    );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 w-full max-w-sm">
        <h2 className="text-2xl font-semibold text-gray-800 mb-1">Profile</h2>
        <p className="text-sm text-gray-400 mb-6">{user.email}</p>

        {message && (
          <p className="text-sm text-indigo-500 bg-indigo-50 border border-indigo-100 rounded-lg px-3 py-2 mb-4">
            {message}
          </p>
        )}

        <div className="flex flex-col gap-3">
          <input
            className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 transition"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 transition"
            type="password"
            placeholder="New password (optional)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="mt-1 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white text-sm font-medium py-2.5 rounded-lg transition cursor-pointer"
            onClick={handleUpdate}
            disabled={loading}
          >
            {loading ? "Saving..." : "Update Profile"}
          </button>
        </div>

        <div className="mt-4 text-center">
          <Link
            to="/dashboard"
            className="text-sm text-indigo-500 hover:underline"
          >
            Go to Todos →
          </Link>
        </div>

        <button
          className="mt-3 w-full text-sm font-medium py-2.5 rounded-lg border border-red-200 text-red-400 hover:bg-red-50 transition cursor-pointer"
          onClick={logout}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
