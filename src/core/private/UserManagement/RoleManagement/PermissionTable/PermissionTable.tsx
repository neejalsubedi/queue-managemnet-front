import { useEffect, useState } from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import {
    useGetPermissions,
    useUpdatePermissions,
} from "@/components/ApiCall/Api";

import { Button } from "@/components/ui/button";

// types/permission.ts
export interface Permission {
    module_id: string;
    name: string;
    code: string;
    can_read: boolean;
    can_write: boolean;
    can_update: boolean;
    can_delete: boolean;
}

const PermissionTable = () => {
    const { id } = useParams<{ id: string }>();
    const location = useLocation();
    console.log(location.state.role_name, location.state.code);
    const role_name=location.state.role_name;
    const code=location.state.code;
    const roleId = id ?? undefined;

    const navigate = useNavigate();

    const { data } = useGetPermissions(id);
    const updatePermissions = useUpdatePermissions(roleId);

    const [permissions, setPermissions] = useState<Permission[]>([]);

    /* Populate permissions when API data arrives */
    useEffect(() => {
        if (data?.data) {
            setPermissions(data?.data);
        }
    }, [data]);

    const handleCheckboxChange = (
        permissionId: number,
        field: keyof Permission
    ) => {
        setPermissions((prev) =>
            prev.map((item) =>
                item.module_id === permissionId
                    ? { ...item, [field]: !item[field] }
                    : item
            )
        );
    };
    useEffect(() => {
        console.log("Permissions IDs:", permissions.map(p => p));
    }, [permissions]);

    const handleSelectAllToggle = (permissionId: number) => {
        setPermissions((prev) =>
            prev.map((item) => {
                if (item.module_id !== permissionId) return item;

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

    const handleSaveChanges = () => {
        const payload={...permissions,role_name,code};
        updatePermissions.mutate(payload, {
            onSuccess: () => {
                navigate("/role-management");
            },
        });
    };

    const handleBack = () => {
        navigate(-1);
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
                    <Button
                        size="sm"
                        variant="outline"
                        className="border-gray-400"
                        onClick={handleBack}
                    >
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
