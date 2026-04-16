

export interface Doctor {
    id?: number | string;
    department_id: number | string | undefined;
    name: string;
    phone: string;
    email: string;
    department_name?: string;
    clinic_id?: number | string;
    clinic_name?: string;
    today_start_time?: string | null;
    today_end_time?: string | null;
    is_day_off?: boolean;
}


