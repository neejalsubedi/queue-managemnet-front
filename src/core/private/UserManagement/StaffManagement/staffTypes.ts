export interface RoleApiResponse {
  id: number;
  name: string;
  code: string;
  description: string;
}

export interface GetRolesResponse {
  statusCode: number;
  message: string;
  data: RoleApiResponse[];
}

export interface GetUserResponse {
  statusCode: number;
  message: string;
  data: User[];
}

// export interface User {
//   id: number;
//   firstName: string;
//   middleName: string;
//   lastName: string;
//   username: string;
//   email: string;
//   gender: string;
//   password: string;
//   roleList: [];
//   name?: string;
//   code?: string;
//   description?: string;
//   allStaff?: boolean;
//   allBranch?: boolean;
//   branch?: number;
//   sendSms?: boolean;
//   sendEmail?: boolean;
// }

export interface User {
  id: number;
  fullname: string;
  email: string;
  role_id: number;
  role_name: string;
    password?: string;
  isactive: boolean;
}
