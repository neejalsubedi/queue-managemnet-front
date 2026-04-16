import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  useGetPatientById,
  useGetClinicsByStaff,
  useGetDepartment,
  useGetDoctor,
  useGetDoctorShift,
  useBookAppointment,
} from "@/components/ApiCall/Api";
import { PatientSelectDropdown } from "@/components/PatientSelectDropdown";
import { useAuth } from "@/components/ContextApi/AuthContext";
import { AppointmentTypeEnum } from "@/enums/AppointmentEnum";
import { NiceSelect } from "@/components/ui/NiceSelect";
import { useNavigate } from "react-router-dom";
import type { BookAppointmentBody } from "../types";
import { UserPlus } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { DAY_NAMES, formatTimeForApi, getDayOfWeek, getDoctorShiftSummary } from "../doctorAvailability";
import { DoctorScheduleCard } from "../DoctorScheduleCard";

export default function BookAppointmentTab() {
  const [selectedPatientId, setSelectedPatientId] = useState<number | undefined>();
  const form = useForm<Partial<BookAppointmentBody> & { is_walk_in: boolean }>({
    defaultValues: { is_walk_in: false },
  });
  const navigate = useNavigate();
  const watch = form.watch();
  const clinicId = watch.clinic_id;
  const departmentId = watch.department_id;
  const doctorId = watch.doctor_id;
  const appointmentDate = watch.appointment_date;

  const { user } = useAuth();
  const { data: patientDetails } = useGetPatientById(selectedPatientId);
  const { data: clinicData } = useGetClinicsByStaff(user?.userId);
  const { data: departmentData } = useGetDepartment(clinicId);
  const { data: doctorData } = useGetDoctor(departmentId);
  const { data: shiftData } = useGetDoctorShift(doctorId, departmentId);
  const bookMutation = useBookAppointment();
  const patient = patientDetails?.data;

  const doctorShiftSummary = useMemo(
    () => getDoctorShiftSummary(shiftData as any, appointmentDate, doctorId),
    [shiftData, appointmentDate, doctorId]
  );

  const onSubmit = (values: Partial<BookAppointmentBody> & { is_walk_in: boolean }) => {
    if (selectedPatientId == null || !values.clinic_id || !values.department_id || !values.doctor_id || !values.appointment_type || !values.appointment_date || !values.scheduled_start_time) return;
    const payload: BookAppointmentBody = {
      patient_id: selectedPatientId,
      clinic_id: values.clinic_id,
      department_id: values.department_id,
      doctor_id: values.doctor_id,
      appointment_type: values.appointment_type,
      appointment_date: values.appointment_date,
      scheduled_start_time: formatTimeForApi(values.scheduled_start_time) || values.scheduled_start_time,
      notes: values.notes ?? null,
      is_walk_in: values.is_walk_in ?? false,
    };
    bookMutation.mutate(payload as any, {
      onSuccess: () => {
        form.reset();
        setSelectedPatientId(undefined);
      },
    });
  };

  const InfoRow = ({ label, value }: { label: string; value?: string | null }) => (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium">{value ?? "—"}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border bg-muted/30 p-4">
        <div className="flex-1 min-w-[200px]">
          <PatientSelectDropdown
            label="Patient"
            name="patient_id"
            value={selectedPatientId}
            onChange={(id) => {
              setSelectedPatientId(id);
              form.setValue("patient_id", id as any);
            }}
            placeholder="Choose patient"
          />
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            navigate("/patient-management/add", {
              state: { returnTo: "/appointment-management" },
            })
          }
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Add New Patient
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Patient Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {patient ? (
            <>
              <InfoRow label="Full Name" value={patient.full_name} />
              <InfoRow label="Phone" value={patient.phone} />
              <InfoRow label="Gender" value={patient.gender} />
              <InfoRow label="Age" value={patient.age != null ? String(patient.age) : null} />
              <InfoRow label="Blood Group" value={patient.blood_group} />
              <InfoRow label="Address" value={patient.address} />
            </>
          ) : (
            <p className="text-muted-foreground">Select or add a patient to continue.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Appointment Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {selectedPatientId ? (
            <>
              <div>
                <Label>Clinic</Label>
                <NiceSelect
                  name="clinic_id"
                  options={clinicData?.data?.map((c) => ({ value: c.id ?? 0, label: c.name })) ?? []}
                  placeholder="Select clinic"
                  onChange={(o) => o && form.setValue("clinic_id", Number(o.value))}
                />
              </div>
              <div>
                <Label>Department</Label>
                <NiceSelect
                  name="department_id"
                  options={departmentData?.data?.map((d) => ({ value: d.id ?? 0, label: d.name })) ?? []}
                  placeholder="Department"
                  disabled={!clinicId}
                  onChange={(o) => o && form.setValue("department_id", Number(o.value))}
                />
              </div>
              <div>
                <Label>Doctor</Label>
                <NiceSelect
                  name="doctor_id"
                  options={doctorData?.data?.map((d) => ({ value: d.id ?? 0, label: d.name })) ?? []}
                  placeholder="Doctor"
                  disabled={!departmentId}
                  onChange={(o) => o && form.setValue("doctor_id", Number(o.value))}
                />
              </div>
              {doctorId && appointmentDate && doctorShiftSummary && (
                <div className="md:col-span-2 lg:col-span-3 space-y-3">
                  <div className="rounded-md bg-muted/50 p-3 text-sm">
                    <strong>Doctor availability ({DAY_NAMES[getDayOfWeek(appointmentDate) % 7] ?? ""}):</strong> {doctorShiftSummary}
                  </div>
                  {clinicId && (
                    <DoctorScheduleCard
                      doctorId={doctorId}
                      date={appointmentDate}
                      clinicId={clinicId}
                      compact
                    />
                  )}
                </div>
              )}
              <div>
                <Label>Appointment Type</Label>
                <NiceSelect
                  name="appointment_type"
                  options={Object.values(AppointmentTypeEnum).map((t) => ({
                    value: t,
                    label: t.replace("_", " "),
                  }))}
                  placeholder="Type"
                  onChange={(o) => o && form.setValue("appointment_type", o.value)}
                />
              </div>
              <div>
                <Label>Date</Label>
                <Input
                  type="date"
                  value={watch.appointment_date ?? ""}
                  onChange={(e) => form.setValue("appointment_date", e.target.value)}
                />
              </div>
              <div>
                <Label>Start Time</Label>
                <Input
                  type="time"
                  value={watch.scheduled_start_time ?? ""}
                  onChange={(e) => form.setValue("scheduled_start_time", e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2 md:col-span-2 lg:col-span-3">
                <Checkbox
                  checked={watch.is_walk_in}
                  onCheckedChange={(v) => form.setValue("is_walk_in", Boolean(v))}
                />
                <Label>Walk-in</Label>
              </div>
              <div className="md:col-span-2 lg:col-span-3">
                <Label>Notes</Label>
                <Textarea
                  name="notes"
                  placeholder="Notes"
                  value={watch.notes ?? ""}
                  onChange={(e) => form.setValue("notes", e.target.value)}
                />
              </div>
              <div className="md:col-span-2 lg:col-span-3 flex justify-end">
                <Button
                  onClick={form.handleSubmit(onSubmit)}
                  disabled={bookMutation.isPending || !watch.appointment_date || !watch.scheduled_start_time}
                >
                  {bookMutation.isPending ? "Booking…" : "Book Appointment"}
                </Button>
              </div>
            </>
          ) : (
            <p className="text-muted-foreground col-span-full">Select a patient first.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
