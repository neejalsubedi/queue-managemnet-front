import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Save, Shield, CheckSquare, Eye, Edit, Trash2, FileText } from "lucide-react";

import {
  useGetPermissions,
  useUpdatePermissions,
} from "@/components/ApiCall/Api";
import { API_ENDPOINTS } from "@/components/constants/ApiEndpoints/apiEndpoints";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export interface Permission {
  id: number;
  name: string;
  code: string;
  canRead: boolean;
  canWrite: boolean;
  canUpdate: boolean;
  canDelete: boolean;
}

const PermissionTable = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const role_name = location.state?.role_name;
  const code = location.state?.code;
  const roleId = Number(id);

  const { data, isLoading, refetch } = useGetPermissions(roleId);
  const updatePermissions = useUpdatePermissions(roleId);

  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

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
      setHasChanges(false);
    }
  }, [data]);

  const handleCheckboxChange = (
    permissionId: number,
    field: keyof Permission,
  ) => {
    setPermissions((prev) =>
      prev.map((item) =>
        item.id === permissionId ? { ...item, [field]: !item[field] } : item,
      ),
    );
    setHasChanges(true);
  };

  const handleSelectAllToggle = (permissionId: number) => {
    setPermissions((prev) =>
      prev.map((item) => {
        if (item.id !== permissionId) return item;

        const isAllSelected =
          item.canRead && item.canWrite && item.canUpdate && item.canDelete;

        return {
          ...item,
          canRead: !isAllSelected,
          canWrite: !isAllSelected,
          canUpdate: !isAllSelected,
          canDelete: !isAllSelected,
        };
      }),
    );
    setHasChanges(true);
  };

  const handleSaveChanges = () => {
    const payload = permissions.map((p) => ({
      module_id: p.id,
      canRead: p.canRead,
      canWrite: p.canWrite,
      canUpdate: p.canUpdate,
      canDelete: p.canDelete,
    }));

    updatePermissions.mutate(payload, {
      onSuccess: () => {
        const endpoint = API_ENDPOINTS.ROLE.GET_PERMISSIONS(roleId);
        queryClient.invalidateQueries({
          queryKey: [endpoint],
        });
        refetch();
        navigate("/role-management");
      },
    });
  };

  const getPermissionIcon = (code: string) => {
    const iconMap: Record<string, any> = {
      user: FileText,
      role: Shield,
      clinic: FileText,
      department: FileText,
      doctor: FileText,
      patient: FileText,
    };
    return iconMap[code.toLowerCase()] || FileText;
  };

  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Permission Management</h1>
              <p className="text-muted-foreground mt-1">
                Manage role-based permissions and access control
              </p>
            </div>
          </div>
          {role_name && (
            <div className="mt-3 flex items-center gap-2">
              <Badge variant="outline" className="text-sm font-medium">
                Role: {role_name}
              </Badge>
              {code && (
                <Badge variant="secondary" className="text-sm">
                  {code}
                </Badge>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate(-1)}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          <Button
            onClick={handleSaveChanges}
            disabled={!hasChanges || updatePermissions.isPending}
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            {updatePermissions.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      {/* Permission Table */}
      <Card className="border shadow-sm">
        <CardHeader className="border-b bg-muted/30">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <CheckSquare className="h-5 w-5" />
            Module Permissions
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-12 w-64" />
                  <Skeleton className="h-5 w-5 rounded" />
                  <Skeleton className="h-5 w-5 rounded" />
                  <Skeleton className="h-5 w-5 rounded" />
                  <Skeleton className="h-5 w-5 rounded" />
                </div>
              ))}
            </div>
          ) : permissions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground min-w-[200px]">
                      Module
                    </th>
                    <th className="px-4 py-4 text-center text-sm font-semibold text-foreground">
                      <div className="flex items-center justify-center gap-2">
                        <CheckSquare className="h-4 w-4" />
                        Select All
                      </div>
                    </th>
                    <th className="px-4 py-4 text-center text-sm font-semibold text-foreground">
                      <div className="flex items-center justify-center gap-2">
                        <Eye className="h-4 w-4" />
                        Read
                      </div>
                    </th>
                    <th className="px-4 py-4 text-center text-sm font-semibold text-foreground">
                      <div className="flex items-center justify-center gap-2">
                        <FileText className="h-4 w-4" />
                        Write
                      </div>
                    </th>
                    <th className="px-4 py-4 text-center text-sm font-semibold text-foreground">
                      <div className="flex items-center justify-center gap-2">
                        <Edit className="h-4 w-4" />
                        Update
                      </div>
                    </th>
                    <th className="px-4 py-4 text-center text-sm font-semibold text-foreground">
                      <div className="flex items-center justify-center gap-2">
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </div>
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {permissions.map((item) => {
                    const Icon = getPermissionIcon(item.code);
                    const isAllSelected =
                      item.canRead &&
                      item.canWrite &&
                      item.canUpdate &&
                      item.canDelete;

                    return (
                      <tr
                        key={item.id}
                        className={cn(
                          "hover:bg-muted/30 transition-colors",
                          isAllSelected && "bg-primary/5"
                        )}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <Icon className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <div className="font-medium text-sm text-foreground">
                                {item.name}
                              </div>
                              <div className="text-xs text-muted-foreground mt-0.5">
                                {item.code}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-4 text-center">
                          <Checkbox
                            checked={isAllSelected}
                            onCheckedChange={() =>
                              handleSelectAllToggle(item.id)
                            }
                            className="h-5 w-5"
                          />
                        </td>

                        <td className="px-4 py-4 text-center">
                          <Checkbox
                            checked={item.canRead}
                            onCheckedChange={() =>
                              handleCheckboxChange(item.id, "canRead")
                            }
                            className="h-5 w-5"
                          />
                        </td>

                        <td className="px-4 py-4 text-center">
                          <Checkbox
                            checked={item.canWrite}
                            onCheckedChange={() =>
                              handleCheckboxChange(item.id, "canWrite")
                            }
                            className="h-5 w-5"
                          />
                        </td>

                        <td className="px-4 py-4 text-center">
                          <Checkbox
                            checked={item.canUpdate}
                            onCheckedChange={() =>
                              handleCheckboxChange(item.id, "canUpdate")
                            }
                            className="h-5 w-5"
                          />
                        </td>

                        <td className="px-4 py-4 text-center">
                          <Checkbox
                            checked={item.canDelete}
                            onCheckedChange={() =>
                              handleCheckboxChange(item.id, "canDelete")
                            }
                            className="h-5 w-5"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center">
              <Shield className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">No permissions found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary Footer */}
      {permissions.length > 0 && (
        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border">
          <div className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">
              {permissions.length}
            </span>{" "}
            modules configured
          </div>
          {hasChanges && (
            <Badge variant="outline" className="text-amber-600 border-amber-300">
              Unsaved changes
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default PermissionTable;
