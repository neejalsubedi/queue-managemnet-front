import { useNavigate, Link, useLocation } from "react-router-dom";
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
import { useAddPatient } from "@/components/ApiCall/Api";
import { API_ENDPOINTS } from "@/components/constants/ApiEndpoints/apiEndpoints";
import { addPatientSchema } from "@/components/formValidation/Schemas";
import type { z } from "zod";
import { bloodTypeOptions } from "./constants";
import { ArrowLeft, User, Phone, Calendar, MapPin, UserCircle } from "lucide-react";

type AddPatientFormValues = z.infer<typeof addPatientSchema>;

export default function AddPatient() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const addPatient = useAddPatient();
  const returnTo = (location.state as { returnTo?: string })?.returnTo;

  const form = useForm<AddPatientFormValues>({
    resolver: zodResolver(addPatientSchema),
    defaultValues: {
      full_name: "",
      username: "",
      email: "",
      password: "",
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

  const onSubmit = (values: AddPatientFormValues) => {
    const payload = {
      full_name: values.full_name,
      username: values.username,
      email: values.email,
      password: values.password,
      phone: values.phone,
      gender: values.gender,
      date_of_birth: values.dob ?? null,
      age: values.age ?? null,
      address: values.address ?? null,
      blood_group: values.blood_group ?? null,
      emergency_contact_name: values.emergency_contact_name ?? null,
      emergency_contact_phone: values.emergency_contact_phone ?? null,
    };
    addPatient.mutate(payload as any, {
      onSuccess: async (res) => {
        await queryClient.refetchQueries({ queryKey: [API_ENDPOINTS.PATIENT.GET_PATIENT] });
        const newId = (res?.data as any)?.data?.id ?? (res?.data as any)?.id;
        if (returnTo && newId != null) {
          navigate(returnTo, { state: { newPatientId: newId } });
        } else {
          navigate("/patient-management");
        }
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/patient-management" aria-label="Back to patient list">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-xl font-bold text-foreground">Add Patient</h1>
          <p className="text-muted-foreground mt-1">
            Create a new patient record. Provide either Date of Birth or Age.
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
                <Label htmlFor="full_name">
                  Full Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="full_name"
                  {...form.register("full_name")}
                  placeholder="Enter full name"
                />
                {form.formState.errors.full_name && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.full_name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">
                  Username <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="username"
                  {...form.register("username")}
                  placeholder="Enter username"
                />
                {form.formState.errors.username && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.username.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  {...form.register("email")}
                  placeholder="Enter email"
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">
                  Password <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="password"
                  type="password"
                  {...form.register("password")}
                  placeholder="Enter password"
                />
                {form.formState.errors.password && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">
                  Phone <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  {...form.register("phone")}
                  placeholder="e.g. 9800000000"
                />
                {form.formState.errors.phone && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.phone.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">
                  Gender <span className="text-destructive">*</span>
                </Label>
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
                  <p className="text-sm text-destructive">
                    {form.formState.errors.gender.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="blood_group">Blood Group</Label>
                <Select
                  value={form.watch("blood_group") ?? ""}
                  onValueChange={(v) =>
                    form.setValue("blood_group", v === "" ? undefined : (v as any))
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
                    <Input
                      id="dob"
                      type="date"
                      {...form.register("dob")}
                    />
                    {form.formState.errors.dob && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.dob.message}
                      </p>
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
                <Input
                  id="address"
                  {...form.register("address")}
                  placeholder="Enter address"
                />
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
              <Button type="submit" disabled={addPatient.isPending}>
                {addPatient.isPending ? (
                  <>
                    <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  "Add Patient"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
