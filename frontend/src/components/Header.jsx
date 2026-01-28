import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { API_BASE_URL } from "../services/api";

export default function Header({ onMenuClick }) {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnreadCount = async () => {
    if (!token) return;

    try {
      const res = await fetch(
        `${API_BASE_URL}/notifications/unread-count`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      setUnreadCount(data.count || 0);
    } catch {
      // silent fail (no crash)
    }
  };

  // 🔔 Initial load + polling
  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 15000);

    const handleRead = () => {
      setUnreadCount(0);
      // optionally fetchUnreadCount() to be double sure, but 0 is instant feedback
    };

    window.addEventListener("notifications-read", handleRead);

    return () => {
      clearInterval(interval);
      window.removeEventListener("notifications-read", handleRead);
    };
  }, [token]);

  // 🔕 When notifications page is opened, refresh count
  useEffect(() => {
    if (location.pathname === "/dashboard/notifications") {
      fetchUnreadCount();
    }
  }, [location.pathname]);

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white shadow z-50 flex items-center px-6">
      <button onClick={onMenuClick} className="mr-4 text-2xl">
        ☰
      </button>

      <h1 className="text-xl font-bold text-blue-600">
        WORKZO
      </h1>

      <div className="flex-1" />

      <button
        onClick={() => navigate("/dashboard/notifications")}
        className="relative mr-6"
      >
        🔔
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      <span className="text-sm text-gray-600">
        Dashboard
      </span>
    </header>
  );
}
