import EmployerOverview from "./EmployerOverview";
import WorkerOverview from "./WorkerOverview";

export default function DashboardHome() {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) return null;

  if (user.role === "EMPLOYER") {
    return <EmployerOverview />;
  }

  if (user.role === "WORKER") {
    return <WorkerOverview />;
  }

  return null;
}
