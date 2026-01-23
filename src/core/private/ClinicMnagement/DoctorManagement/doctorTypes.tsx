// doctorTypes.ts

export interface Doctor {
    id?: number | string;
    department_id: number | string|undefined;
    name: string;
    phone: string;
    email: string;
}


