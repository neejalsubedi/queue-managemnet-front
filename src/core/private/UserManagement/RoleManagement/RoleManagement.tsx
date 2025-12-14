import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Row } from "@tanstack/react-table";
import { Pencil } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import Table from "@/components/Table/Table";
import {
  useAddRole,
  useGetAllRole,
  useUpdateRole,
} from "@/components/ApiCall/Api";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { GenericFormRenderer } from "@/components/form/GenericFormRenderer";

import { QUERY_KEYS } from "@/components/constants/QueryKeys/queryKeys";
import { RoleFormFields } from "./fields";
import { RoleRequest, RoleResponse } from "./roleTypes";
import TableCellFormatter from "@/helper/TableCellFormatter";
import { encryptId } from "@/utility/cryptoUtil";
import { useNavigate } from "react-router-dom";

const RoleManagement = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<RoleResponse | null>(null);

  const isEditMode = !!selectedRole;
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: fetchedRole } = useGetAllRole();
  const { mutate: addRole, isPending: pendingAdd } = useAddRole();
  const { mutate: updateRole, isPending: pendingUpdate } = useUpdateRole(
    selectedRole?.id
  );

  const form = useForm<RoleRequest>({
    defaultValues: {
      name: "",
      code: "",
      description: "",
    },
  });

  useEffect(() => {
    if (!isFormOpen) return;

    if (selectedRole) {
      form.reset({
        name: selectedRole.name,
        code: selectedRole.code,
        description: selectedRole.description,
      });
    } else {
      form.reset();
    }
  }, [isFormOpen, selectedRole, form]);

  const onSubmit = (data: RoleRequest) => {
    const action = isEditMode ? updateRole : addRole;

    action(data, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.GET_ROLES });
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ACTIVE_ROLES });
        closeForm();
      },
    });
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setSelectedRole(null);
    form.reset();
  };

  const handlePermission = (user: RoleResponse) => {
    const encryptedId = encodeURIComponent(encryptId(user.id));
    navigate(`/permission/${encryptedId}`);
    console.log(user.id);
  };

  const formKey = selectedRole ? `edit-${selectedRole.id}` : "add-role";

  const columns = [
    {
      header: "S.No",
      cell: ({ row }: { row: Row<RoleResponse> }) => row.index + 1,
    },
    {
      accessorKey: "name",
      header: "Role Name",
      cell: ({ row }: { row: Row<RoleResponse> }) => (
        <TableCellFormatter value={row.original.name} />
      ),
    },
    {
      accessorKey: "code",
      header: "Code",
    },
    {
      accessorKey: "description",
      header: "Description",
    },
    {
      header: "Actis",
      cell: ({ row }: { row: Row<RoleResponse> }) => (
        <>
          <div className="flex items-center gap-3">
            <Button
              size="sm"
              onClick={() => {
                setSelectedRole(row.original);
                setIsFormOpen(true);
              }}
            >
              <Pencil size={16} />
            </Button>
            <Button
              size={"sm"}
              variant={"secondary"}
              onClick={() => handlePermission(row.original)}
            >
              Permission
            </Button>
          </div>
        </>
      ),
    },
  ];

  return (
    <>
      <div className="flex justify-between">
        <header>
          <h1 className="text-3xl font-bold text-foreground">
            Role Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Create and manage user roles and access levels efficiently.
          </p>
        </header>

        <Button
          onClick={() => {
            setSelectedRole(null);
            setIsFormOpen(true);
          }}
        >
          Add Role
        </Button>
      </div>

      <Table
        columns={columns}
        getData={async () => fetchedRole?.data ?? []}
        pageSize={10}
      />

      <Dialog
        open={isFormOpen}
        onOpenChange={(open) => {
          setIsFormOpen(open);

          if (!open) {
            setSelectedRole(null);
            form.reset();
          }
        }}
      >
        <DialogContent className="min-w-[60vw]">
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Update Role" : "Add Role"}</DialogTitle>
            <DialogClose />
          </DialogHeader>

          <Form {...form} key={formKey}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-2 gap-3">
                <GenericFormRenderer form={form} fields={RoleFormFields} />
              </div>

              <DialogFooter className="justify-center">
                <Button type="submit">
                  {pendingAdd
                    ? "Saving..."
                    : pendingUpdate
                    ? "Updating..."
                    : isEditMode
                    ? "Update"
                    : "Add"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RoleManagement;
