

export interface Clinic {
    id?: number|string;
    name: string;
    address: string;
    contact: string;
}
export interface GetClinicResponse {
    statusCode: number;
    message: string;
    data: Clinic[];
}
