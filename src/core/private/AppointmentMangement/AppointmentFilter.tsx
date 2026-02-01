import { useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import {
    useGetClinic,
    useGetDepartment,
    useGetDoctor,
} from "@/components/ApiCall/Api";
import { Label } from "@/components/ui/label";

const AppointmentFilter = () => {
    const { register, control, setValue } = useFormContext();

    const clinicId = useWatch({ control, name: "clinicId" });
    const departmentId = useWatch({ control, name: "departmentId" });

    const { data: clinicData } = useGetClinic();
    const { data: departmentData } = useGetDepartment(clinicId);
    const { data: doctorData } = useGetDoctor(departmentId);

    /** ✅ Auto-select first clinic */
    useEffect(() => {
        if (!clinicId && clinicData?.data?.length) {
            setValue("clinicId", clinicData.data[0].id);
        }
    }, [clinicData, clinicId, setValue]);

    /** ✅ Auto-select first department after clinic is selected */
    useEffect(() => {
        if (clinicId && !departmentId && departmentData?.data?.length) {
            setValue("departmentId", departmentData.data[0].id);
        }
    }, [clinicId, departmentData, departmentId, setValue]);

    return (
        <>
            {/* Clinic */}
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

            {/* Department */}
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

            {/* Doctor (NO auto-select as requested) */}
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
