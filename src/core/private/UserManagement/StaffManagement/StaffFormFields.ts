import { FieldConfig } from "@/components/form/types";

export const StaffFormFields: FieldConfig[] = [
  {
    name: "firstName",
    label: "Firstname",
    type: "text",
    placeholder: "enter your firstname",
  },
  {
    name: "middleName",
    label: "Middlename",
    type: "text",
    placeholder: "enter your middlename",
  },
  {
    name: "lastName",
    label: "Lastname",
    type: "text",
    placeholder: "enter your lastname",
  },
  {
    name: "username",
    label: "Username",
    type: "text",
    placeholder: "eg: john.doe",
  },
  {
    name: "email",
    label: "Email",
    type: "text",
    placeholder: "enter your email",
  },
  {
    name: "gender",
    label: "Gender",
    type: "radio",
    options: [
      { value: "M", label: "Male" },
      { value: "F", label: "Female" },
    ],
  },
  {
    name: "roleList",
    label: "Role",
    type: "multiselect",
  },
  {
    name: "branch",
    label: "Branch",
    type: "select",
  },
  {
    name: "allStaff",
    label: "View All Staff",
    type: "select",
  },
  {
    name: "allBranch",
    label: "View All Branch",
    type: "select",
  },
  {
    name: "sendSms",
    label: "Send SMS",
    type: "select",
  },
  {
    name: "sendEmail",
    label: "Send Email",
    type: "select",
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "enter your password",
  },
];
