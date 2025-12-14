import { FieldConfig } from "@/components/form/types";

export const RoleFormFields: FieldConfig[] = [
  {
    name: "name",
    label: "Role Name",
    type: "text",
    placeholder: "enter name of role",
  },
  {
    name: "code",
    label: "Role Code",
    type: "text",
    placeholder: "enter Code of role",
  },
  {
    name: "description",
    label: "Description",
    type: "text",
    placeholder: "description",
  },
];
