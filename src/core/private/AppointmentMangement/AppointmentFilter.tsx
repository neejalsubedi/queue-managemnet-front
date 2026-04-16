import { useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import {
    useGetClinicsByStaff,
    useGetDepartment,
    useGetDoctor,
} from "@/components/ApiCall/Api";
import { useAuth } from "@/components/ContextApi/AuthContext";
import { Label } from "@/components/ui/label";

const AppointmentFilter = () => {
    const { register, control, setValue } = useFormContext();
    const { user } = useAuth();
    const staffId = user?.userId;

    const clinicId = useWatch({ control, name: "clinicId" });
    const departmentId = useWatch({ control, name: "departmentId" });

    const { data: clinicData } = useGetClinicsByStaff(staffId);
    // Department: only when clinic is selected
    const { data: departmentData } = useGetDepartment(clinicId);
    // Doctor: only when department is selected
    const { data: doctorData } = useGetDoctor(departmentId);

    // Clear department and doctor whenever clinic selection changes
    useEffect(() => {
        setValue("departmentId", "");
        setValue("doctorId", "");
    }, [clinicId, setValue]);

    // Clear doctor whenever department selection changes
    useEffect(() => {
        setValue("doctorId", "");
    }, [departmentId, setValue]);

    return (
        <>
            <div>
                <Label>Clinic</Label>
                <select
                    {...register("clinicId")}
                    className="w-full border rounded-md h-10 px-3"
                >
                    <option value="">Select Clinic</option>
                    {clinicData?.data?.map((clinic: any) => (
                        <option key={clinic.id} value={clinic.id}>
                            {clinic.name}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <Label>Department</Label>
                <select
                    {...register("departmentId")}
                    disabled={!clinicId}
                    className="w-full border rounded-md h-10 px-3"
                >
                    <option value="">Select Department</option>
                    {departmentData?.data?.map((dept: any) => (
                        <option key={dept.id} value={dept.id}>
                            {dept.name}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <Label>Doctor</Label>
                <select
                    {...register("doctorId")}
                    disabled={!departmentId}
                    className="w-full border rounded-md h-10 px-3"
                >
                    <option value="">Select Doctor</option>
                    {doctorData?.data?.map((doc: any) => (
                        <option key={doc.id} value={doc.id}>
                            {doc.name}
                        </option>
                    ))}
                </select>
            </div>
        </>
    );
};

export default AppointmentFilter;
