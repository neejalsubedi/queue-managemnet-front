import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

import {
    useGetPatientById,
    useGetClinicsByStaff,
    useGetDepartment,
    useGetDoctor,
    useAddAppointment,
} from "@/components/ApiCall/Api";
import { PatientSelectDropdown } from "@/components/PatientSelectDropdown";
import { useAuth } from "@/components/ContextApi/AuthContext";
import { AppointmentTypeEnum } from "@/enums/AppointmentEnum";
import { NiceSelect } from "@/components/ui/NiceSelect";
import { useNavigate, useLocation } from "react-router-dom";
import { formatTimeForApi } from "./doctorAvailability";
import { DoctorScheduleCard } from "./DoctorScheduleCard";

type AppointmentFormValues = {
    patient_id: number;
    clinic_id?: number;
    department_id?: number;
    doctor_id?: number;
    appointment_type?: AppointmentTypeEnum;
    appointment_date?: string;
    scheduled_start_time?: string;
    notes?: string;
    is_walk_in: boolean;
};

const AddAppointment = () => {
    const [selectedPatientId, setSelectedPatientId] = useState<number | undefined>();

    const form = useForm<AppointmentFormValues>({
        defaultValues: {
            is_walk_in: false,
        },
    });
    const navigate = useNavigate();
    const location = useLocation();
    const { watch, setValue, handleSubmit } = form;
    const newPatientIdFromState = (location.state as { newPatientId?: number })?.newPatientId;
    useEffect(() => {
        if (newPatientIdFromState != null) {
            setSelectedPatientId(newPatientIdFromState);
            setValue("patient_id", newPatientIdFromState);
        }
    }, [newPatientIdFromState, setValue]);
    const clinicId = watch("clinic_id");
    const departmentId = watch("department_id");
    const doctorId = watch("doctor_id");
    const appointmentDate = watch("appointment_date");

    const { user } = useAuth();
    const { data: patientDetails } = useGetPatientById(selectedPatientId);

    const { data: clinicData } = useGetClinicsByStaff(user?.userId);
    const { data: departmentData } = useGetDepartment(clinicId);
    const { data: doctorData } = useGetDoctor(departmentId);
    const save = useAddAppointment()
    const patient = patientDetails?.data;


    const onSubmit = (values: AppointmentFormValues) => {
        const payload = {
            ...values,
            patient_id: selectedPatientId,
            ...(values.scheduled_start_time && { scheduled_start_time: formatTimeForApi(values.scheduled_start_time) }),
        };
        save.mutate(payload, {
            onSuccess: () => {
                navigate("/appointment-management")
            }
        })
    };
    const InfoRow = ({ label, value }: { label: string; value?: string | null }) => (
        <div className="space-y-1">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-sm font-medium">{value || "-"}</p>
        </div>
    );

    return (
        <>
            <div className={"flex justify-start p-2"}><Button variant={"secondary"} onClick={() => navigate("/appointment-management")}>Back</Button></div>
            <div className="space-y-6">
                {/* Patient Select */}
                <div className=" space-y-2 p-2 rounded-md border border-gray-200 bg-blue-200/50 flex justify-between">
                    <div>
                        <PatientSelectDropdown
                            label="Select Patient"
                            name="patient_id"
                            value={selectedPatientId}
                            onChange={(id) => {
                                setSelectedPatientId(id ?? undefined);
                                setValue("patient_id", id ?? 0);
                            }}
                            placeholder="Choose a patient"
                        />
                    </div>
                    <Button
                        className={"mt-6"}
                        type="button"
                        variant="outline"
                        onClick={() =>
                            navigate("/patient-management/add", {
                                state: { returnTo: "/appointment-management/book-appointment" },
                            })
                        }
                    >
                        Add New Patient
                    </Button>

                </div>

                {/* Patient Info */}

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Patient Information</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {patient ? (<>
                            <InfoRow label="Full Name" value={patient.full_name} />
                            <InfoRow label="Phone" value={patient.phone} />
                            <InfoRow label="Gender" value={patient.gender} />
                            <InfoRow label="Age" value={String(patient.age)} />
                            <InfoRow label="Blood Group" value={patient.blood_group} />
                            <InfoRow label="Address" value={patient.address} />
                        </>) : (
                            <span>select or add a new patient</span>
                        )}
                    </CardContent>
                </Card>


                {/* Appointment Form */}

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Appointment Details</CardTitle>
                    </CardHeader>

                    <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {selectedPatientId ? (
                            <>
                                {/* Clinic */}
                                <div>
                                    <Label>Clinic</Label>
                                    <NiceSelect
                                        name="clinic_id"
                                        options={clinicData?.data?.map((c) => ({
                                            value: c.id ?? 0,
                                            label: c.name,
                                        })) || []}
                                        placeholder="Select clinic"
                                        onChange={(option) => {
                                            if (option) setValue("clinic_id", Number(option.value));
                                        }}
                                    />
                                </div>

                                {/* Department */}
                                <div>
                                    <Label>Department</Label>
                                    <NiceSelect
                                        name="department_id"
                                        options={departmentData?.data?.map((d) => ({
                                            value: d.id ?? 0,
                                            label: d.name,
                                        })) || []}
                                        placeholder="Select department"
                                        disabled={!clinicId}
                                        onChange={(option) => {
                                            if (option) setValue("department_id", Number(option.value));
                                        }}
                                    />
                                </div>

                                {/* Doctor */}
                                <div>
                                    <Label>Doctor</Label>
                                    <NiceSelect
                                        name="doctor_id"
                                        options={doctorData?.data?.map((d) => ({
                                            value: d.id ?? 0,
                                            label: d.name,
                                        })) || []}
                                        placeholder="Select doctor"
                                        disabled={!departmentId}
                                        onChange={(option) => {
                                            if (option) setValue("doctor_id", Number(option.value));
                                        }}
                                    />
                                </div>

                                {/* Appointment Type */}
                                <div>
                                    <Label>Appointment Type</Label>
                                    <NiceSelect
                                        name="appointment_type"
                                        options={Object.values(AppointmentTypeEnum).map((t) => ({
                                            value: t as AppointmentTypeEnum,
                                            label: t.replace("_", " "),
                                        }))}
                                        placeholder="Select appointment type"
                                        onChange={(option) => {
                                            if (option) setValue("appointment_type", option.value);
                                        }}
                                    />
                                </div>

                                {/* Date */}
                                <div>
                                    <Label>Date</Label>
                                    <Input
                                        name="appointment_date"
                                        type="date"
                                        onChange={(e) => setValue("appointment_date", e.target.value)}
                                    />
                                </div>

                                {/* Start Time */}
                                <div>
                                    <Label>Start Time</Label>
                                    <Input
                                        name="scheduled_start_time"
                                        type="time"
                                        placeholder="2:30 PM"
                                        onChange={(e) => setValue("scheduled_start_time", e.target.value)}
                                    />
                                </div>

                                {doctorId && appointmentDate && clinicId && (
                                    <div className="md:col-span-3">
                                        <DoctorScheduleCard
                                            doctorId={doctorId}
                                            date={appointmentDate}
                                            clinicId={clinicId}
                                            compact
                                        />
                                    </div>
                                )}

                                {/* Walk-in */}
                                <div className="flex items-center gap-2 md:col-span-3">
                                    <Checkbox
                                        onCheckedChange={(v) => setValue("is_walk_in", Boolean(v))}
                                    />
                                    <Label>Is Walk-in</Label>
                                </div>

                                {/* Notes */}
                                <div className="md:col-span-3">
                                    <Label>Notes</Label>
                                    <Input
                                        name="notes"
                                        placeholder="Follow-up Dentist"
                                        onChange={(e) => setValue("notes", e.target.value)}
                                    />
                                </div>

                                <div className="md:col-span-3 flex justify-end">
                                    <Button onClick={handleSubmit(onSubmit)}>Book Appointment</Button>
                                </div>
                            </>
                        ) : (
                            <span>Select patient first</span>
                        )}
                    </CardContent>

                </Card>

            </div>
        </>
    );
};

export default AddAppointment;
