import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Building2, User, Clock, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useGetPatientClinics,
  useGetPatientDoctors,
  useBookPatientAppointment,
} from "@/components/ApiCall/Api";
import { BookAppointmentRequest, Clinic, Doctor, PREFERRED_TIME } from "./appointmentTypes";
import { useQueryClient } from "@tanstack/react-query";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DoctorScheduleCard } from "@/core/private/AppointmentMangement/DoctorScheduleCard";

interface BookingFlowProps {
  onSuccess?: () => void;
}

const STEPS = [
  { id: 1, label: "Select Date", icon: Calendar },
  { id: 2, label: "Select Clinic", icon: Building2 },
  { id: 3, label: "Select Time & Doctor", icon: Clock },
  { id: 4, label: "Add Notes & Confirm", icon: CheckCircle2 },
];

export default function BookingFlow({ onSuccess }: BookingFlowProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const queryClient = useQueryClient();

  const { data: clinicsData, isLoading: clinicsLoading } = useGetPatientClinics();
  const clinics: Clinic[] = clinicsData?.data || [];

  const { data: doctorsData, isLoading: doctorsLoading } = useGetPatientDoctors(
    selectedClinic?.id ?? null,
    selectedDate
  );
  const doctors: Doctor[] = doctorsData?.data || [];

  const bookAppointment = useBookPatientAppointment();

  const form = useForm<BookAppointmentRequest>({
    defaultValues: {
      preferred_date: "",
      clinic_id: 0,
      preferred_time: "ANY",
      department_id: undefined,
      doctor_id: undefined,
      notes: "",
    },
  });

  // Update form when selections change
  useEffect(() => {
    if (selectedDate) {
      form.setValue("preferred_date", selectedDate);
    }
    if (selectedClinic) {
      form.setValue("clinic_id", selectedClinic.id);
    }
    if (selectedDoctor) {
      form.setValue("doctor_id", selectedDoctor.id);
      form.setValue("department_id", selectedDoctor.department_id);
    }
  }, [selectedDate, selectedClinic, selectedDoctor, form]);

  const formatTimeRange = (start: string | null, end: string | null) => {
    if (!start || !end) return "Not available";
    return `${start} - ${end}`;
  };

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedClinic(null);
    setSelectedDoctor(null);
    if (date) {
      handleNext();
    }
  };

  const handleClinicSelect = (clinicId: string) => {
    const clinic = clinics.find((c) => c.id === Number(clinicId));
    setSelectedClinic(clinic || null);
    setSelectedDoctor(null);
    if (clinic) {
      handleNext();
    }
  };

  const handleDoctorSelect = (doctorId: string) => {
    const doctor = doctors.find((d) => d.id === Number(doctorId));
    setSelectedDoctor(doctor || null);
  };

  const onSubmit = (data: BookAppointmentRequest) => {
    const payload: BookAppointmentRequest = {
      preferred_date: data.preferred_date,
      clinic_id: data.clinic_id,
      preferred_time: data.preferred_time,
      department_id: data.department_id,
      doctor_id: data.doctor_id,
      notes: data.notes, // Required field
    };

    bookAppointment.mutate(payload, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["api/patient/appointment"] });
        onSuccess?.();
        // Reset form
        setCurrentStep(1);
        setSelectedDate("");
        setSelectedClinic(null);
        setSelectedDoctor(null);
        form.reset();
      },
    });
  };

  const minDate = new Date().toISOString().split("T")[0];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Book Appointment</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;

            return (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "h-10 w-10 rounded-full flex items-center justify-center border-2 transition-all",
                      isActive
                        ? "bg-primary text-primary-foreground border-primary"
                        : isCompleted
                          ? "bg-green-500 text-white border-green-500"
                          : "bg-muted text-muted-foreground border-muted-foreground"
                    )}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                  </div>
                  <span
                    className={cn(
                      "mt-2 text-xs font-medium",
                      isActive ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    {step.label}
                  </span>
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={cn(
                      "flex-1 h-0.5 mx-2",
                      isCompleted ? "bg-green-500" : "bg-muted"
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Step Content */}
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Step 1: Select Date */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <Label htmlFor="date">Select Preferred Date</Label>
              <Input
                id="date"
                type="date"
                min={minDate}
                value={selectedDate}
                onChange={(e) => handleDateSelect(e.target.value)}
                required
              />
            </div>
          )}

          {/* Step 2: Select Clinic */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <Label>Select Clinic</Label>
              {clinicsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <Select
                  value={selectedClinic?.id.toString() || ""}
                  onValueChange={handleClinicSelect}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a clinic" />
                  </SelectTrigger>
                  <SelectContent>
                    {clinics.map((clinic) => (
                      <SelectItem key={clinic.id} value={clinic.id.toString()}>
                        {clinic.name}
                        {clinic.address && ` - ${clinic.address}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          )}

          {/* Step 3: Select Time & Doctor */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="preferred_time">Preferred Time *</Label>
                <Select
                  value={form.watch("preferred_time")}
                  onValueChange={(value) => form.setValue("preferred_time", value as any)}
                >
                  <SelectTrigger id="preferred_time">
                    <SelectValue placeholder="Select preferred time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={PREFERRED_TIME.Morning}>Morning</SelectItem>
                    <SelectItem value={PREFERRED_TIME.Afternoon}>Afternoon</SelectItem>
                    <SelectItem value={PREFERRED_TIME.Evening}>Evening</SelectItem>
                    <SelectItem value={PREFERRED_TIME.Any}>Any Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Select Doctor (Optional)</Label>
                <p className="text-sm text-muted-foreground">
                  You can skip this step. Staff will assign a doctor based on your notes.
                </p>
                {doctorsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : doctors.length === 0 ? (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      No doctors available for the selected date and clinic. You can still proceed without selecting a doctor.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Select
                    value={selectedDoctor?.id.toString() || ""}
                    onValueChange={(value) => {
                      if (value === "none") {
                        setSelectedDoctor(null);
                        form.setValue("doctor_id", undefined);
                        form.setValue("department_id", undefined);
                      } else {
                        handleDoctorSelect(value);
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a doctor (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Skip - Let staff assign</SelectItem>
                      {doctors.map((doctor) => (
                        <SelectItem key={doctor.id} value={doctor.id.toString()}>
                          <div className="flex flex-col py-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{doctor.name}</span>
                              {doctor.department_name && (
                                <span className="text-xs text-muted-foreground">
                                  ({doctor.department_name})
                                </span>
                              )}
                            </div>
                            {doctor.is_day_off ? (
                              <span className="text-xs text-orange-600 font-medium">Day Off</span>
                            ) : doctor.start_time && doctor.end_time ? (
                              <span className="text-xs text-muted-foreground">
                                Available: {formatTimeRange(doctor.start_time, doctor.end_time)}
                              </span>
                            ) : (
                              <span className="text-xs text-muted-foreground">Schedule not set</span>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              {selectedDoctor && selectedClinic && selectedDate && (
                <DoctorScheduleCard
                  doctorId={selectedDoctor.id}
                  date={selectedDate}
                  clinicId={selectedClinic.id}
                  title="This doctor's appointments on your chosen day"
                  compact
                />
              )}
            </div>
          )}

          {/* Step 4: Add Notes & Confirm */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Date:</span>
                  <span>{selectedDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Clinic:</span>
                  <span>{selectedClinic?.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Preferred Time:</span>
                  <span>
                    {form.watch("preferred_time") === "MORNING" && "Morning"}
                    {form.watch("preferred_time") === "AFTERNOON" && "Afternoon"}
                    {form.watch("preferred_time") === "EVENING" && "Evening"}
                    {form.watch("preferred_time") === "ANY" && "Any Time"}
                  </span>
                </div>
                {selectedDoctor ? (
                  <>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Doctor:</span>
                      <span>{selectedDoctor.name}</span>
                    </div>
                    {selectedDoctor.department_name && (
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Department:</span>
                        <span>{selectedDoctor.department_name}</span>
                      </div>
                    )}
                  </>
                ) : (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      No doctor selected. Staff will assign a doctor based on your notes.
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">
                  Notes <span className="text-red-500">*</span>
                </Label>
                <p className="text-sm text-muted-foreground">
                  Please provide details about your appointment. Staff will use this information to assign the appropriate doctor and department.
                </p>
                <Textarea
                  id="notes"
                  {...form.register("notes", {
                    required: "Notes are required. Please describe your appointment needs."
                  })}
                  placeholder="Describe your symptoms, concerns, or reason for the appointment..."
                  className="mt-2"
                  rows={6}
                />
                {form.formState.errors.notes && (
                  <p className="text-sm text-red-500 mt-1">
                    {form.formState.errors.notes.message}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
            >
              Back
            </Button>
            {currentStep < STEPS.length ? (
              <Button
                type="button"
                onClick={handleNext}
                disabled={
                  (currentStep === 1 && !selectedDate) ||
                  (currentStep === 2 && !selectedClinic) ||
                  (currentStep === 3 && !form.watch("preferred_time"))
                }
              >
                Next
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={bookAppointment.isPending}
              >
                {bookAppointment.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Booking...
                  </>
                ) : (
                  "Confirm Booking"
                )}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

