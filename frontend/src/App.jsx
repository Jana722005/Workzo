import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

// Public pages
import Intro from "./pages/Intro";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";

// Dashboard layout
import DashboardLayout from "./layouts/DashboardLayout";

// Dashboard pages
import DashboardHome from "./pages/DashboardHome";
import PostJob from "./pages/PostJob";
import MyJobs from "./pages/MyJobs";
import FindJobs from "./pages/FindJobs";
import Applications from "./pages/Applications";
import JobApplicants from "./pages/JobApplicants";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import WorkerProfile from "./pages/WorkerProfile";
import JobStatus from "./pages/JobStatus";

function App() {
  return (
    <Routes>
      {/* Default route */}
      <Route path="/" element={<Intro />} />

      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-email" element={<VerifyEmail />} />

      {/* Protected dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* Dashboard home */}
        <Route index element={<DashboardHome />} />

        {/* Employer */}
        <Route path="post-job" element={<PostJob />} />
        <Route path="my-jobs" element={<MyJobs />} />
        <Route path="my-jobs/:jobId/applicants" element={<JobApplicants />} />

        {/* Worker */}
        <Route path="find-jobs" element={<FindJobs />} />
        <Route path="applications" element={<Applications />} />

        {/* Shared */}
        <Route path="notifications" element={<Notifications />} />
        <Route path="profile" element={<Profile />} />

        {/* Employer → Worker profile view */}
        <Route path="worker/:id" element={<WorkerProfile />} />
        <Route path="job-status" element={<JobStatus />} />

      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
