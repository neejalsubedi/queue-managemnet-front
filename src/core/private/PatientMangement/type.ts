export type Patient = {
    id?: number;
    full_name: string;
    username: string;
    email: string;
    password: string;
    phone: string;
    gender: "M" | "F";
    dob: string; // ideally YYYY-MM-DD
    age: number | null;

    address: string;
    blood_group: string;
    emergency_contact_name: string;
    emergency_contact_phone: string;
};
