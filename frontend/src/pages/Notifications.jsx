import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Notifications() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const load = async () => {
      const res = await fetch(
        "http://localhost:5000/api/notifications",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      setNotifications(data);

      // ✅ mark all as read
      await fetch(
        "http://localhost:5000/api/notifications/mark-read",
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // 🔔 FORCE HEADER BADGE UPDATE (KEY FIX)
      window.dispatchEvent(new Event("notifications-read"));
    };

    load();
  }, [token]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Notifications</h1>

      {notifications.length === 0 && (
        <p className="text-gray-500">No notifications</p>
      )}

      <div className="space-y-4">
        {notifications.map((n) => (
          <div
            key={n._id}
            onClick={() => n.link && navigate(n.link)}
            className={`p-4 rounded-xl shadow cursor-pointer ${
              n.read ? "bg-white" : "bg-blue-50"
            }`}
          >
            <p className="text-sm">{n.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
