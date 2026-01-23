import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import {
    useGetPermissions,
    useUpdatePermissions,
} from "@/components/ApiCall/Api";

import { Button } from "@/components/ui/button";

/* ================= TYPES ================= */
export interface Permission {
    id: number;
    name: string;
    code: string;
    canRead: boolean;
    canWrite: boolean;
    canUpdate: boolean;
    canDelete: boolean;
}

/* ================= COMPONENT ================= */
const PermissionTable = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();

    const role_name = location.state?.role_name;
    const code = location.state?.code;
    const roleId = Number(id);

    const { data } = useGetPermissions(roleId);
    const updatePermissions = useUpdatePermissions(roleId);

    const [permissions, setPermissions] = useState<Permission[]>([]);

    /* Populate permissions */
    useEffect(() => {
        if (data?.data) {
            const mappedPermissions: Permission[] = data.data.map((item: any) => ({
                id: Number(item.module_id),
                name: item.name,
                code: item.code,
                canRead: item.can_read,
                canWrite: item.can_write,
                canUpdate: item.can_update,
                canDelete: item.can_delete,
            }));

            setPermissions(mappedPermissions);
        }
    }, [data]);

    /* Toggle single checkbox */
    const handleCheckboxChange = (
        permissionId: number,
        field: keyof Permission
    ) => {
        setPermissions((prev) =>
            prev.map((item) =>
                item.id === permissionId
                    ? { ...item, [field]: !item[field] }
                    : item
            )
        );
    };

    /* ✅ FIXED: Select All (row-wise) */
    const handleSelectAllToggle = (permissionId: number) => {
        setPermissions((prev) =>
            prev.map((item) => {
                if (item.id !== permissionId) return item;

                const isAllSelected =
                    item.canRead &&
                    item.canWrite &&
                    item.canUpdate &&
                    item.canDelete;

                return {
                    ...item,
                    canRead: !isAllSelected,
                    canWrite: !isAllSelected,
                    canUpdate: !isAllSelected,
                    canDelete: !isAllSelected,
                };
            })
        );
    };

    /* Save */
    const handleSaveChanges = () => {
        const payload = {
            role_name,
            code,
            permissions: permissions.map((p) => ({
                module_id: p.id,
                can_read: p.canRead,
                can_write: p.canWrite,
                can_update: p.canUpdate,
                can_delete: p.canDelete,
            })),
        };

        updatePermissions.mutate(payload, {
            onSuccess: () => navigate("/role-management"),
        });
    };

    return (
        <div className="overflow-x-auto space-y-4 p-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Permission Management</h1>
                    <p className="text-muted-foreground mt-2">
                        Manage role-based permissions and access control.
                    </p>
                </div>

                <div className="flex gap-3">
                    <Button size="sm" variant="outline" onClick={() => navigate(-1)}>
                        <ArrowLeft />
                    </Button>

                    <Button onClick={handleSaveChanges}>
                        {updatePermissions.isPending ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </div>

            <table className="table-auto w-full border-collapse border border-gray-300">
                <thead>
                <tr>
                    <th className="border px-4 py-2 bg-gray-100 text-left">Menu</th>
                    <th className="border px-4 py-2 bg-gray-100 text-center">
                        Select All
                    </th>
                    <th className="border px-4 py-2 bg-gray-100">Read</th>
                    <th className="border px-4 py-2 bg-gray-100">Write</th>
                    <th className="border px-4 py-2 bg-gray-100">Update</th>
                    <th className="border px-4 py-2 bg-gray-100">Delete</th>
                </tr>
                </thead>

                <tbody>
                {permissions.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-100">
                        <td className="border px-4 py-2 font-medium">{item.name}</td>

                        <td className="border px-4 py-2 text-center">
                            <input
                                type="checkbox"
                                checked={
                                    item.canRead &&
                                    item.canWrite &&
                                    item.canUpdate &&
                                    item.canDelete
                                }
                                onChange={() => handleSelectAllToggle(item.id)}
                                className="h-5 w-5 accent-blue-500 cursor-pointer"
                            />
                        </td>

                        <td className="border px-4 py-2 text-center">
                            <input
                                type="checkbox"
                                checked={item.canRead}
                                onChange={() =>
                                    handleCheckboxChange(item.id, "canRead")
                                }
                                className="h-4 w-4 accent-blue-500 cursor-pointer"
                            />
                        </td>

                        <td className="border px-4 py-2 text-center">
                            <input
                                type="checkbox"
                                checked={item.canWrite}
                                onChange={() =>
                                    handleCheckboxChange(item.id, "canWrite")
                                }
                                className="h-4 w-4 accent-blue-500 cursor-pointer"
                            />
                        </td>

                        <td className="border px-4 py-2 text-center">
                            <input
                                type="checkbox"
                                checked={item.canUpdate}
                                onChange={() =>
                                    handleCheckboxChange(item.id, "canUpdate")
                                }
                                className="h-4 w-4 accent-blue-500 cursor-pointer"
                            />
                        </td>

                        <td className="border px-4 py-2 text-center">
                            <input
                                type="checkbox"
                                checked={item.canDelete}
                                onChange={() =>
                                    handleCheckboxChange(item.id, "canDelete")
                                }
                                className="h-4 w-4 accent-blue-500 cursor-pointer"
                            />
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default PermissionTable;
