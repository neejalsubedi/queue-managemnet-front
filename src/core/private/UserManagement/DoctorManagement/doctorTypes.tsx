// doctorTypes.ts

export interface Doctor {
    id?: number | string;
    department_id: number | string;
    name: string;
    phone: string;
    email: string;
}

export interface GetDoctorResponse {
    statusCode: number;
    message: string;
    data: Doctor[];
}
