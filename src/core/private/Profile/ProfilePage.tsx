import { useAuth } from "@/components/ContextApi/AuthContext";
import PatientProfile from "@/core/private/Patient/Profile/PatientProfile";
import StaffProfile from "./StaffProfile";
import SuperadminProfile from "./SuperadminProfile";

function isPatient(moduleList: { path?: string | null }[]): boolean {
  return moduleList.some(
    (m) => m.path?.toLowerCase().includes("my-appointments") || m.path?.toLowerCase().includes("my_appointments")
  );
}

function isSuperadmin(roleCode: string | null | undefined, role: string | null | undefined): boolean {
  const code = (roleCode ?? role ?? "").toUpperCase();
  return code === "SA" || code === "SUPERADMIN" || code === "SUPER_ADMIN";
}

export default function ProfilePage() {
  const { user } = useAuth();
  const moduleList = user?.moduleList ?? [];
  const roleCode = user?.roleCode;
  const role = user?.role;

  if (isPatient(moduleList)) {
    return <PatientProfile />;
  }
  if (isSuperadmin(roleCode, role)) {
    return <SuperadminProfile />;
  }
  return <StaffProfile />;
}
