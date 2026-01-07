import { NavLink, useNavigate } from "react-router-dom";

export default function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const baseClasses =
    "fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-slate-900 text-white p-5 transition-transform duration-300 z-40";

  const linkClass = ({ isActive }) =>
    `block px-3 py-2 rounded ${
      isActive ? "bg-slate-800" : "hover:bg-slate-800"
    }`;

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`${baseClasses} ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <nav className="space-y-2">
          {/* Overview */}
          <NavLink
            to="/dashboard"
            end
            className={linkClass}
            onClick={onClose}
          >
            Overview
          </NavLink>

          {/* Employer Links */}
          {user?.role === "EMPLOYER" && (
            <>
              <NavLink
                to="/dashboard/post-job"
                className={linkClass}
                onClick={onClose}
              >
                Post Job
              </NavLink>

              <NavLink
                to="/dashboard/my-jobs"
                className={linkClass}
                onClick={onClose}
              >
                My Jobs
              </NavLink>

              <NavLink to="/dashboard/job-status" 
                className={linkClass} 
                onClick={onClose}
              >
                Job Status
              </NavLink>

              <NavLink to="/dashboard/notifications" 
                className={linkClass} 
                onClick={onClose}
              >
                Notifications
              </NavLink>

              <NavLink to="/dashboard/Profile" 
                className={linkClass} 
                onClick={onClose}
              >
                Profile
              </NavLink>
            </>
          )}

          {/* Worker Links (for later) */}
          {user?.role === "WORKER" && (
            <>
              <NavLink
                to="/dashboard/find-jobs"
                className={linkClass}
                onClick={onClose}
              >
                Find Jobs
              </NavLink>

              <NavLink
                to="/dashboard/applications"
                className={linkClass}
                onClick={onClose}
              >
                Applications
              </NavLink>

              <NavLink to="/dashboard/Profile" 
                className={linkClass} 
                onClick={onClose}
              >
                Profile
              </NavLink>

              <NavLink to="/dashboard/job-status" 
                className={linkClass} 
                onClick={onClose}
              >
                Job Status
              </NavLink>

              <NavLink to="/dashboard/notifications" 
                className={linkClass} 
                onClick={onClose}
              >
                Notifications
              </NavLink>

            </>
          )}

          {/* Logout */}
          <button
            onClick={() => {
              localStorage.clear();
              navigate("/login");
            }}
            className="block w-full text-left px-3 py-2 rounded hover:bg-red-600 mt-6"
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30"
          onClick={onClose}
        />
      )}
    </>
  );
}
