// import React, { createContext, useContext, useMemo } from "react";
// import { GetRolesResponse } from "./staffTypes";
// import { useApiGet } from "@/components/ApiCall/ApiGet";
// import { QUERY_KEYS } from "@/components/constants/QueryKeys/queryKeys";
//
// // Define the Role interface
// interface Role {
//   value: string;
//   label: string;
// }
//
// // Define the shape of the context
// interface ActiveRolesContextType {
//   activeRoles: Role[];
//   refreshRoles: () => void;
// }
//
// // Create the context
// const ActiveRolesContext = createContext<ActiveRolesContextType | undefined>(
//   undefined
// );
//
// // Provider component
// export const ActiveRolesProvider: React.FC<{ children: React.ReactNode }> = ({
//   children,
// }) => {
//   const { data, refetch } = useApiGet<GetRolesResponse>(
//     QUERY_KEYS.ACTIVE_ROLES,
//     {
//       enabled: true,
//       retry: 1,
//     }
//   );
//
//   const activeRoles: Role[] = useMemo(() => {
//     return (
//       data?.data?.map((role: any) => ({
//         value: role.id,
//         label: role.name,
//       })) ?? []
//     );
//   }, [data]);
//
//   const refreshRoles = () => {
//     refetch();
//   };
//
//   return (
//     <ActiveRolesContext.Provider value={{ activeRoles, refreshRoles }}>
//       {children}
//     </ActiveRolesContext.Provider>
//   );
// };
//
// // Hook for consuming the context
// export const useActiveRoles = (): ActiveRolesContextType => {
//   const context = useContext(ActiveRolesContext);
//   if (!context) {
//     throw new Error(
//       "useActiveRoles must be used within an ActiveRolesProvider"
//     );
//   }
//   return context;
// };
