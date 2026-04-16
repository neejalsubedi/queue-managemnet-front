import { useEffect, useState } from "react";
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
  useGetProfile,
  useUpdateProfile,
  useChangeProfilePassword,
} from "@/components/ApiCall/Api";
import { API_ENDPOINTS } from "@/components/constants/ApiEndpoints/apiEndpoints";
import { staffProfileUpdateSchema, changePasswordSchema } from "@/components/formValidation/Schemas";
import type { z } from "zod";
import type {
  StaffProfileResponse,
  UpdateStaffProfilePayload,
  ChangePasswordPayload,
} from "./staffProfileTypes";
import {
  User,
  Mail,
  Phone,
  Calendar,
  UserCircle,
  Lock,
  AlertCircle,
  Edit2,
} from "lucide-react";

type StaffProfileFormValues = z.infer<typeof staffProfileUpdateSchema>;
type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

function getDefaultValues(data: StaffProfileResponse | undefined): Partial<StaffProfileFormValues> {
  if (!data) {
    return {
      full_name: "",
      email: "",
      username: "",
      phone: "",
      gender: null,
    };
  }
  const d = data as Record<string, unknown>;
  return {
    full_name: (d.full_name ?? d.fullName ?? "") as string,
    email: (d.email ?? "") as string,
    username: (d.username ?? "") as string,
    phone: (d.phone ?? "") as string,
    gender: (d.gender as "M" | "F") ?? null,
  };
}

export default function StaffProfile() {
  const queryClient = useQueryClient();
  const { data: profileResponse, isLoading, isError } = useGetProfile();
  const profileData = profileResponse?.data;

  const updateProfile = useUpdateProfile();
  const changePassword = useChangeProfilePassword();

  const profileForm = useForm<StaffProfileFormValues>({
    resolver: zodResolver(staffProfileUpdateSchema),
    defaultValues: getDefaultValues(profileData),
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
      profileForm.reset(getDefaultValues(profileData));
    }
  }, [profileData, profileForm.reset]);

  const handleCancelEdit = () => {
    setIsEditing(false);
    if (profileData) profileForm.reset(getDefaultValues(profileData));
  };

  const onProfileSubmit = (values: StaffProfileFormValues) => {
    const payload: UpdateStaffProfilePayload = {
      full_name: values.full_name,
      email: values.email,
      username: values.username,
      phone: values.phone?.trim() || null,
      gender: values.gender ?? null,
    };
    updateProfile.mutate(payload as any, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.PROFILE.GET] });
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCircle className="h-5 w-5" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
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
                  Gender
                </Label>
                {isEditing ? (
                  <Select
                    value={profileForm.watch("gender") ?? ""}
                    onValueChange={(v) =>
                      profileForm.setValue("gender", v === "" ? null : (v as "M" | "F"))
                    }
                  >
                    <SelectTrigger id="gender">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="M">Male</SelectItem>
                      <SelectItem value="F">Female</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-sm font-medium py-2 px-3 bg-muted rounded-md">
                    {profileForm.watch("gender") === "M"
                      ? "Male"
                      : profileForm.watch("gender") === "F"
                        ? "Female"
                        : "—"}
                  </p>
                )}
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={handleCancelEdit}>
                  Cancel
                </Button>
                <Button type="submit" disabled={updateProfile.isPending}>
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
              <Label htmlFor="old_password">
                Current Password <span className="text-destructive">*</span>
              </Label>
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
              <Label htmlFor="new_password">
                New Password <span className="text-destructive">*</span>
              </Label>
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
              <Label htmlFor="confirm_password">
                Confirm New Password <span className="text-destructive">*</span>
              </Label>
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
