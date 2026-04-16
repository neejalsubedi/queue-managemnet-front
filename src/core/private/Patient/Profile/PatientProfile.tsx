import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useGetPatientProfile,
  useUpdatePatientProfile,
  useChangePatientPassword,
} from "@/components/ApiCall/Api";
import { API_ENDPOINTS } from "@/components/constants/ApiEndpoints/apiEndpoints";
import { patientProfileUpdateSchema, changePasswordSchema } from "@/components/formValidation/Schemas";
import type { z } from "zod";
import type { PatientProfileResponse, UpdatePatientProfilePayload, ChangePasswordPayload } from "./profileTypes";
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Droplets,
  UserCircle,
  Lock,
  AlertCircle,
  Edit2,
} from "lucide-react";

export const bloodTypeOptions = [
  { value: "Ap", label: "A+" },
  { value: "An", label: "A-" },
  { value: "Bp", label: "B+" },
  { value: "Bn", label: "B-" },
  { value: "Op", label: "O+" },
  { value: "On", label: "O-" },
  { value: "ABp", label: "AB+" },
  { value: "ABn", label: "AB-" },
] as const;

function getBloodGroupLabel(value: string | null | undefined): string {
  if (!value) return "—";
  const opt = bloodTypeOptions.find((o) => o.value === value);
  return opt?.label ?? value;
}

type ProfileFormValues = z.infer<typeof patientProfileUpdateSchema>;
type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

function getDefaultProfileValues(data: PatientProfileResponse | undefined): Partial<ProfileFormValues> {
  if (!data) {
    return {
      full_name: "",
      email: "",
      username: "",
      phone: "",
      gender: null,
      date_of_birth: undefined,
      age: undefined,
      address: undefined,
      blood_group: undefined,
      emergency_contact_name: undefined,
      emergency_contact_phone: undefined,
    };
  }
  const p = data.profile ?? {};
  const bloodValue = p.blood_group;
  const bloodGroup =
    bloodValue && bloodTypeOptions.some((o) => o.value === bloodValue)
      ? (bloodValue as ProfileFormValues["blood_group"])
      : undefined;
  return {
    full_name: data.full_name ?? "",
    email: data.email ?? "",
    username: data.username ?? "",
    phone: data.phone ?? "",
    gender: (data.gender as "M" | "F") ?? null,
    date_of_birth: p.date_of_birth ?? undefined,
    age: p.age ?? undefined,
    address: p.address ?? undefined,
    blood_group: bloodGroup,
    emergency_contact_name: p.emergency_contact_name ?? undefined,
    emergency_contact_phone: p.emergency_contact_phone ?? undefined,
  };
}

export default function PatientProfile() {
  const queryClient = useQueryClient();
  const { data: profileResponse, isLoading, isError } = useGetPatientProfile();
  const profileData = profileResponse?.data;

  const updateProfile = useUpdatePatientProfile();
  const changePassword = useChangePatientPassword();

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(patientProfileUpdateSchema),
    defaultValues: getDefaultProfileValues(profileData),
  });

  const passwordForm = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      old_password: "",
      new_password: "",
      confirm_password: "",
    },
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (profileData) {
      profileForm.reset(getDefaultProfileValues(profileData));
    }
  }, [profileData, profileForm.reset]);

  const handleCancelEdit = () => {
    setIsEditing(false);
    if (profileData) profileForm.reset(getDefaultProfileValues(profileData));
  };

  const onProfileSubmit = (values: ProfileFormValues) => {
    const payload: UpdatePatientProfilePayload = {
      full_name: values.full_name,
      email: values.email,
      username: values.username,
      phone: values.phone ?? "",
      gender: values.gender,
      date_of_birth: values.date_of_birth ?? null,
      age: typeof values.age === "number" ? values.age : values.age ? Number(values.age) : null,
      address: values.address ?? null,
      blood_group: values.blood_group ?? null,
      emergency_contact_name: values.emergency_contact_name ?? null,
      emergency_contact_phone: values.emergency_contact_phone ?? null,
    };
    updateProfile.mutate(payload as any, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.PATIENT.GET_PROFILE] });
        setIsEditing(false);
      },
    });
  };

  const onPasswordSubmit = (values: ChangePasswordFormValues) => {
    const payload: ChangePasswordPayload = {
      old_password: values.old_password,
      new_password: values.new_password,
      confirm_password: values.confirm_password,
    };
    changePassword.mutate(payload as any, {
      onSuccess: () => {
        passwordForm.reset();
      },
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold text-foreground">Profile</h1>
          <p className="text-muted-foreground mt-2">Manage your personal information</p>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading profile...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold text-foreground">Profile</h1>
          <p className="text-muted-foreground mt-2">Manage your personal information</p>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center text-destructive">
              <AlertCircle className="h-10 w-10 mx-auto mb-2" />
              <p>Failed to load profile. Please try again later.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground">Profile</h1>
          <p className="text-muted-foreground mt-2">
            Manage your personal information and security
          </p>
        </div>
        <Button
          variant={isEditing ? "outline" : "default"}
          onClick={() => (isEditing ? handleCancelEdit() : setIsEditing(true))}
        >
          <Edit2 className="h-4 w-4 mr-2" />
          {isEditing ? "Cancel" : "Edit Profile"}
        </Button>
      </div>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCircle className="h-5 w-5" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={profileForm.handleSubmit(onProfileSubmit)}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="full_name" className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  Full Name <span className="text-destructive">*</span>
                </Label>
                {isEditing ? (
                  <>
                    <Input
                      id="full_name"
                      {...profileForm.register("full_name")}
                      placeholder="Enter full name"
                    />
                    {profileForm.formState.errors.full_name && (
                      <p className="text-sm text-destructive">
                        {profileForm.formState.errors.full_name.message}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-sm font-medium py-2 px-3 bg-muted rounded-md">
                    {profileForm.watch("full_name") || "—"}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="username" className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  Username <span className="text-destructive">*</span>
                </Label>
                {isEditing ? (
                  <>
                    <Input
                      id="username"
                      {...profileForm.register("username")}
                      placeholder="Enter username"
                    />
                    {profileForm.formState.errors.username && (
                      <p className="text-sm text-destructive">
                        {profileForm.formState.errors.username.message}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-sm font-medium py-2 px-3 bg-muted rounded-md">
                    {profileForm.watch("username") || "—"}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  Email <span className="text-destructive">*</span>
                </Label>
                {isEditing ? (
                  <>
                    <Input
                      id="email"
                      type="email"
                      {...profileForm.register("email")}
                      placeholder="Enter email"
                    />
                    {profileForm.formState.errors.email && (
                      <p className="text-sm text-destructive">
                        {profileForm.formState.errors.email.message}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-sm font-medium py-2 px-3 bg-muted rounded-md">
                    {profileForm.watch("email") || "—"}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  Phone
                </Label>
                {isEditing ? (
                  <>
                    <Input
                      id="phone"
                      type="tel"
                      {...profileForm.register("phone")}
                      placeholder="e.g. 9800000000"
                    />
                    {profileForm.formState.errors.phone && (
                      <p className="text-sm text-destructive">
                        {profileForm.formState.errors.phone.message}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-sm font-medium py-2 px-3 bg-muted rounded-md">
                    {profileForm.watch("phone") || "—"}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  Gender <span className="text-destructive">*</span>
                </Label>
                {isEditing ? (
                  <>
                    <Select
                      value={profileForm.watch("gender") ?? ""}
                      onValueChange={(v) => profileForm.setValue("gender", v === "" ? null : (v as "M" | "F"))}
                    >
                      <SelectTrigger id="gender">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="M">Male</SelectItem>
                        <SelectItem value="F">Female</SelectItem>
                      </SelectContent>
                    </Select>
                    {profileForm.formState.errors.gender && (
                      <p className="text-sm text-destructive">
                        {profileForm.formState.errors.gender.message}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-sm font-medium py-2 px-3 bg-muted rounded-md">
                    {profileForm.watch("gender") === "M" ? "Male" : profileForm.watch("gender") === "F" ? "Female" : "—"}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="blood_group" className="flex items-center gap-2">
                  <Droplets className="h-4 w-4 text-muted-foreground" />
                  Blood Group
                </Label>
                {isEditing ? (
                  <Select
                    value={profileForm.watch("blood_group") ?? ""}
                    onValueChange={(v) =>
                      profileForm.setValue("blood_group", v === "" ? null : (v as ProfileFormValues["blood_group"]))
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
                ) : (
                  <p className="text-sm font-medium py-2 px-3 bg-muted rounded-md">
                    {getBloodGroupLabel(profileForm.watch("blood_group"))}
                  </p>
                )}
              </div>

              {/* DOB / Age: at least one required */}
              <div className="space-y-2 md:col-span-2">
                <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Date of Birth or Age
                </p>
                <p className="text-xs text-muted-foreground">
                  Provide either Date of Birth or Age (at least one is required).
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date_of_birth">Date of Birth</Label>
                    {isEditing ? (
                      <>
                        <Input
                          id="date_of_birth"
                          type="date"
                          {...profileForm.register("date_of_birth")}
                        />
                        {profileForm.formState.errors.date_of_birth && (
                          <p className="text-sm text-destructive">
                            {profileForm.formState.errors.date_of_birth.message}
                          </p>
                        )}
                      </>
                    ) : (
                      <p className="text-sm font-medium py-2 px-3 bg-muted rounded-md">
                        {profileForm.watch("date_of_birth") || "—"}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    {isEditing ? (
                      <>
                        <Input
                          id="age"
                          type="number"
                          min={1}
                          max={150}
                          placeholder="Enter age"
                          {...profileForm.register("age")}
                        />
                        {profileForm.formState.errors.age && (
                          <p className="text-sm text-destructive">
                            {typeof profileForm.formState.errors.age.message === "string"
                              ? profileForm.formState.errors.age.message
                              : "Invalid age"}
                          </p>
                        )}
                      </>
                    ) : (
                      <p className="text-sm font-medium py-2 px-3 bg-muted rounded-md">
                        {profileForm.watch("age") ?? "—"}
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
                {isEditing ? (
                  <Textarea
                    id="address"
                    {...profileForm.register("address")}
                    placeholder="Enter address"
                    rows={2}
                  />
                ) : (
                  <p className="text-sm font-medium py-2 px-3 bg-muted rounded-md whitespace-pre-wrap">
                    {profileForm.watch("address") || "—"}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergency_contact_name" className="flex items-center gap-2">
                  <UserCircle className="h-4 w-4 text-muted-foreground" />
                  Emergency Contact Name
                </Label>
                {isEditing ? (
                  <Input
                    id="emergency_contact_name"
                    {...profileForm.register("emergency_contact_name")}
                    placeholder="Full name"
                  />
                ) : (
                  <p className="text-sm font-medium py-2 px-3 bg-muted rounded-md">
                    {profileForm.watch("emergency_contact_name") || "—"}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergency_contact_phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  Emergency Contact Phone
                </Label>
                {isEditing ? (
                  <>
                    <Input
                      id="emergency_contact_phone"
                      type="tel"
                      {...profileForm.register("emergency_contact_phone")}
                      placeholder="e.g. 9800000000"
                    />
                    {profileForm.formState.errors.emergency_contact_phone && (
                      <p className="text-sm text-destructive">
                        {profileForm.formState.errors.emergency_contact_phone.message}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-sm font-medium py-2 px-3 bg-muted rounded-md">
                    {profileForm.watch("emergency_contact_phone") || "—"}
                  </p>
                )}
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={handleCancelEdit}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={updateProfile.isPending}
                >
                  {updateProfile.isPending ? (
                    <>
                      <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Change Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
            className="space-y-6 max-w-md"
          >
            <div className="space-y-2">
              <Label htmlFor="old_password">Current Password <span className="text-destructive">*</span></Label>
              <Input
                id="old_password"
                type="password"
                {...passwordForm.register("old_password")}
                placeholder="Enter current password"
              />
              {passwordForm.formState.errors.old_password && (
                <p className="text-sm text-destructive">
                  {passwordForm.formState.errors.old_password.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="new_password">New Password <span className="text-destructive">*</span></Label>
              <Input
                id="new_password"
                type="password"
                {...passwordForm.register("new_password")}
                placeholder="Enter new password"
              />
              {passwordForm.formState.errors.new_password && (
                <p className="text-sm text-destructive">
                  {passwordForm.formState.errors.new_password.message}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                At least 8 characters, with at least one letter and one number.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm_password">Confirm New Password <span className="text-destructive">*</span></Label>
              <Input
                id="confirm_password"
                type="password"
                {...passwordForm.register("confirm_password")}
                placeholder="Confirm new password"
              />
              {passwordForm.formState.errors.confirm_password && (
                <p className="text-sm text-destructive">
                  {passwordForm.formState.errors.confirm_password.message}
                </p>
              )}
            </div>
            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                variant="secondary"
                disabled={changePassword.isPending}
              >
                {changePassword.isPending ? (
                  <>
                    <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                    Updating...
                  </>
                ) : (
                  "Change Password"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
