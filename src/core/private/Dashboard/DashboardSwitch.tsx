import { useAuth } from "@/components/ContextApi/AuthContext";
import { isPatient } from "@/utility/roleUtils";
import { DashboardProvider } from "@/components/ContextApi/DashboardProvider";
import Dashboard from "./Dashboard";
import PatientDashboard from "@/core/private/Patient/PatientDashboard";

/**
 * Renders staff Dashboard or PatientDashboard based on user role.
 * Patients (moduleList contains my-appointments) see PatientDashboard; others see the staff Dashboard.
 */
export default function DashboardSwitch() {
  const { user } = useAuth();
  const showPatientDashboard = isPatient(user?.moduleList ?? null);

  if (showPatientDashboard) {
    return <PatientDashboard />;
  }

  return (
    <DashboardProvider>
      <Dashboard />
    </DashboardProvider>
  );
}
