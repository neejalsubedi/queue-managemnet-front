import { DashboardProvider } from "@/components/ContextApi/DashboardProvider";
import { ReportsProvider } from "@/components/ContextApi/ReportsProvider";
import ErrorPage from "@/helper/errorPage";
import { lazy } from "react";
import { Navigate, RouteObject } from "react-router-dom";
import { DynamicRedirect } from "./dynamicRedirect";

const PrivateLayout = lazy(() => import("../components/layout/MainLayout"));
const DashboardSwitch = lazy(() => import("../core/private/Dashboard/DashboardSwitch"));
const Reports = lazy(() => import("../core/private/Reports/Reports"));
const UserTable = lazy(() => import("../core/private/UserManagement/StaffManagement/UserTable"));
const RoleManagement = lazy(() => import("../core/private/UserManagement/RoleManagement/RoleManagement"));
const ClinicManagement = lazy(() => import("@/core/private/UserManagement/ClinicManagement/ClinicTable.tsx"));
const PatientManagement = lazy(() => import("@/core/private/PatientMangement/PatientTable.tsx"));
const AddPatient = lazy(() => import("@/core/private/PatientMangement/AddPatient.tsx"));
const EditPatient = lazy(() => import("@/core/private/PatientMangement/EditPatient.tsx"));
const PermissionsTable = lazy(() => import("../core/private/UserManagement/RoleManagement/PermissionTable/PermissionTable.tsx"));
const Appointment = lazy(() => import("../core/private/AppointmentMangement/AppointmentTabs.tsx"))
const BookAppointmentPage = lazy(() => import("../core/private/AppointmentMangement/BookAppointmentPage.tsx"));
const MyAppointments = lazy(() => import("../core/private/Patient/MyAppointments/MyAppointments"));
const ProfilePage = lazy(() => import("../core/private/Profile/ProfilePage"));

export const privateRoutes: RouteObject[] = [
  {
    path: "/",
    element: <PrivateLayout />,
    errorElement: (
      <>
        <div>Error</div>
      </>
    ),
    children: [
      {
        index: true,
        element: <DynamicRedirect />,
      },
      {
        path: "home",
        element: <DashboardSwitch />,
      },
      {
        path: "reports",
        element: (
          <ReportsProvider>
            <Reports />
          </ReportsProvider>
        ),
      },
      {
        path: "/staff-management",
        element: <UserTable />,
      },
      {
        path: "role-management",
        element: < RoleManagement />
      },
      {
        path: "/role-management/permissions/:id",
        element: <PermissionsTable />
      },
      {
        path: "clinic-management",
        element: <ClinicManagement />
      },

      {
        path: "patient-management",
        element: <PatientManagement />
      },
      {
        path: "patient-management/add",
        element: <AddPatient />
      },
      {
        path: "patient-management/edit/:id",
        element: <EditPatient />
      },
      {
        path: "appointment-management",
        element: <Appointment />
      },
      {
        path: "appointment-management/book-appointment",
        element: <BookAppointmentPage />
      },
      // Patient Routes
      {
        path: "my-appointments",
        element: <MyAppointments />
      },
      {
        path: "profile",
        element: <ProfilePage />
      }
    ],
  },
  {
    path: "/unauthorized",
    element: <ErrorPage />,
  },
  {
    path: "*",
    element: <Navigate to="/unauthorized" replace />,
  },
];
