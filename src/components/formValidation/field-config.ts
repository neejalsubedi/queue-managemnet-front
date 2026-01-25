import { RegisterOptions } from "react-hook-form";

export type BaseOption = {
  label: string;
  value: string | number;
};

export type FieldConfig =
  | {
      type: "group";
      label: string;
      colSpan?: number;
      children: FieldConfig[];
      hide?: (form: any) => boolean;
    }
  | {
      name: string;
      label: string;
      type: "text" | "number" | "select" | "file" | "textarea";
      colSpan?: number;
      rules?: RegisterOptions;
      disabled?: boolean;
      options?: BaseOption[];
      searchable?: boolean;
      onChange?: (val: any, form?: any) => void;
      hide?: (form: any) => boolean;
      required?: boolean;
      placeholder?: string;
      previewUrl?: string | string[] | null;
      multiple?: boolean;
      accept?: string;
      clickableUpload?: boolean;
    };

export type NamedField = Extract<FieldConfig, { name: string }>;

export function isNamedField(field: FieldConfig): field is NamedField {
  return field.type !== "group";
}
