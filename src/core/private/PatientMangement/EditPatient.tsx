import { useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useGetPatientById,
  useUpdatePatient,
} from "@/components/ApiCall/Api";
import { API_ENDPOINTS } from "@/components/constants/ApiEndpoints/apiEndpoints";
import { editPatientSchema } from "@/components/formValidation/Schemas";
import type { z } from "zod";
import { bloodTypeOptions } from "./constants";
import {
  ArrowLeft,
  User,
  Phone,
  Calendar,
  MapPin,
  UserCircle,
} from "lucide-react";

type EditPatientFormValues = z.infer<typeof editPatientSchema>;

export default function EditPatient() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: patientResponse, isLoading, isError } = useGetPatientById(id);
  const rawPatient = patientResponse?.data;
  const patient = Array.isArray(rawPatient) ? rawPatient[0] : rawPatient;
  const updatePatient = useUpdatePatient(id);

  const form = useForm<EditPatientFormValues>({
    resolver: zodResolver(editPatientSchema),
    defaultValues: {
      full_name: "",
      username: "",
      email: "",
      phone: "",
      gender: "M",
      dob: undefined,
      age: undefined,
      address: "",
      blood_group: undefined,
      emergency_contact_name: "",
      emergency_contact_phone: "",
    },
  });

  useEffect(() => {
    if (patient && typeof patient === "object") {
      const row = patient as Record<string, unknown>;
      const dobValue = (row.date_of_birth ?? row.dob) as string | undefined;
      form.reset({
        full_name: String(row.full_name ?? ""),
        username: String(row.username ?? ""),
        email: String(row.email ?? ""),
        phone: String(row.phone ?? ""),
        gender: (row.gender === "F" ? "F" : "M") as "M" | "F",
        dob: dobValue && String(dobValue).trim() ? dobValue : undefined,
        age:
          row.age != null && row.age !== ""
            ? Number(row.age)
            : undefined,
        address: String(row.address ?? ""),
        blood_group: bloodTypeOptions.some((o) => o.value === row.blood_group)
          ? (row.blood_group as EditPatientFormValues["blood_group"])
          : undefined,
        emergency_contact_name: String(row.emergency_contact_name ?? ""),
        emergency_contact_phone: String(row.emergency_contact_phone ?? ""),
      });
    }
  }, [patient, form]);

  const onSubmit = (values: EditPatientFormValues) => {
    const payload = {
      full_name: values.full_name,
      username: values.username,
      email: values.email,
      phone: values.phone,
      gender: values.gender,
      date_of_birth: values.dob ?? null,
      age: values.age ?? null,
      address: values.address ?? null,
      blood_group: values.blood_group ?? null,
      emergency_contact_name: values.emergency_contact_name ?? null,
      emergency_contact_phone: values.emergency_contact_phone ?? null,
    };
    updatePatient.mutate(payload as any, {
      onSuccess: async () => {
        await queryClient.refetchQueries({ queryKey: [API_ENDPOINTS.PATIENT.GET_PATIENT] });
        navigate("/patient-management");
      },
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/patient-management" aria-label="Back to patient list">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-xl font-bold text-foreground">Edit Patient</h1>
            <p className="text-muted-foreground mt-1">Loading...</p>
          </div>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError || !patient) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/patient-management">Back</Link>
          </Button>
          <div>
            <h1 className="text-xl font-bold text-foreground">Edit Patient</h1>
            <p className="text-destructive mt-1">Failed to load patient.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/patient-management" aria-label="Back to patient list">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-xl font-bold text-foreground">Edit Patient</h1>
          <p className="text-muted-foreground mt-1">
            Update patient record. Provide either Date of Birth or Age.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Patient Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name <span className="text-destructive">*</span></Label>
                <Input id="full_name" {...form.register("full_name")} placeholder="Enter full name" />
                {form.formState.errors.full_name && (
                  <p className="text-sm text-destructive">{form.formState.errors.full_name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username <span className="text-destructive">*</span></Label>
                <Input id="username" {...form.register("username")} placeholder="Enter username" />
                {form.formState.errors.username && (
                  <p className="text-sm text-destructive">{form.formState.errors.username.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email <span className="text-destructive">*</span></Label>
                <Input id="email" type="email" {...form.register("email")} placeholder="Enter email" />
                {form.formState.errors.email && (
                  <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone <span className="text-destructive">*</span></Label>
                <Input id="phone" type="tel" {...form.register("phone")} placeholder="e.g. 9800000000" />
                {form.formState.errors.phone && (
                  <p className="text-sm text-destructive">{form.formState.errors.phone.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender <span className="text-destructive">*</span></Label>
                <Select
                  value={form.watch("gender")}
                  onValueChange={(v) => form.setValue("gender", v as "M" | "F")}
                >
                  <SelectTrigger id="gender">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="M">Male</SelectItem>
                    <SelectItem value="F">Female</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.gender && (
                  <p className="text-sm text-destructive">{form.formState.errors.gender.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="blood_group">Blood Group</Label>
                <Select
                  value={form.watch("blood_group") ?? ""}
                  onValueChange={(v) =>
                    form.setValue("blood_group", v === "" ? undefined : (v as EditPatientFormValues["blood_group"]))
                  }
                >
                  <SelectTrigger id="blood_group">
                    <SelectValue placeholder="Select blood group" />
                  </SelectTrigger>
                  <SelectContent>
                    {bloodTypeOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Date of Birth or Age <span className="text-destructive">*</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  Provide either Date of Birth or Age (at least one is required).
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input id="dob" type="date" {...form.register("dob")} />
                    {form.formState.errors.dob && (
                      <p className="text-sm text-destructive">{form.formState.errors.dob.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      min={1}
                      max={150}
                      placeholder="Enter age (optional)"
                      {...form.register("age", {
                        setValueAs: (v) =>
                          v === "" || v === undefined || v === null
                            ? undefined
                            : Number(v),
                      })}
                    />
                    {form.formState.errors.age && (
                      <p className="text-sm text-destructive">
                        {typeof form.formState.errors.age.message === "string"
                          ? form.formState.errors.age.message
                          : "Invalid age"}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  Address
                </Label>
                <Input id="address" {...form.register("address")} placeholder="Enter address" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergency_contact_name" className="flex items-center gap-2">
                  <UserCircle className="h-4 w-4 text-muted-foreground" />
                  Emergency Contact Name
                </Label>
                <Input
                  id="emergency_contact_name"
                  {...form.register("emergency_contact_name")}
                  placeholder="Full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergency_contact_phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  Emergency Contact Phone
                </Label>
                <Input
                  id="emergency_contact_phone"
                  type="tel"
                  {...form.register("emergency_contact_phone")}
                  placeholder="e.g. 9800000000"
                />
                {form.formState.errors.emergency_contact_phone && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.emergency_contact_phone.message}
                  </p>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" asChild>
                <Link to="/patient-management">Cancel</Link>
              </Button>
              <Button type="submit" disabled={updatePatient.isPending}>
                {updatePatient.isPending ? (
                  <>
                    <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Updating...
                  </>
                ) : (
                  "Update Patient"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
