/** Role/module helpers for conditional UI (dashboard, profile, etc.) */

export type ModuleItem = { path?: string | null; [key: string]: unknown };

/** True when user has patient modules (e.g. my-appointments) */
export function isPatient(moduleList: ModuleItem[] | undefined | null): boolean {
  if (!moduleList?.length) return false;
  return moduleList.some(
    (m) =>
      m.path?.toLowerCase().includes("my-appointments") ||
      m.path?.toLowerCase().includes("my_appointments")
  );
}

/** True when user is superadmin by role code */
export function isSuperadmin(
  roleCode: string | null | undefined,
  role: string | null | undefined
): boolean {
  const code = (roleCode ?? role ?? "").toUpperCase();
  return code === "SA" || code === "SUPERADMIN" || code === "SUPER_ADMIN";
}
