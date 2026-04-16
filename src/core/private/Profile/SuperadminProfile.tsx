/**
 * Superadmin Profile – same API as Staff (/api/profile).
 * Renders StaffProfile by default; override here if Superadmin needs different UI/sections.
 */
import StaffProfile from "./StaffProfile";

export default function SuperadminProfile() {
  return <StaffProfile />;
}
