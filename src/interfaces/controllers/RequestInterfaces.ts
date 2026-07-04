export interface ICreateOrganizationRequest {
  name: string;
  type: string;
  about: string;
  active: boolean;
  user_encrypted_data: string;
  user_signature: string;
}
export interface ISuperAdminRequest {
  username: string,
  password: string,
  permission: any[]
}
export interface IOnBoardingOrgType {
  type: string;
  permissions: any;
}
export interface IOnBoardingRoleName {
  departmentId: string
  role_name: string;
  permissions: any;
}
export interface IUpdateOrganizationRequest {
  uuid: string;
  name?: string;
  about?: string;
  active?: boolean;
}
export interface IDepartmentIDRequest {
  id: any
}

export interface ICreateDepartmentRequest {
  organization_id: string;
  name: string;
  about: string;
  active: boolean;
  roles?: string[];
  user_encrypted_data: string;
  user_signature: string;
}

export interface IUpdateDepartmentRequest {
  uuid: string;
  name?: string;
  about?: string;
  active?: boolean;
  roles?: string[];
}

export interface ICreateUserRequest {
  fullName: string;
  email: string;
  departmentId: string;
  password: string;
  shineKey: string;
  shineName: string;
  shinePrivateKey: string;
  user_encrypted_data: string;
  user_signature: string;
}

export interface IChangePasswordRequest {
  uuid: string;
  email: string;
  oldPassword: string;
  newPassword: string;
  id: string;
  captcha: string;
}
export interface IResetPasswordRequest {
  email: string;
  newPassword: string;
  token: string
  id: string;
  captcha: string;
}

export interface IForgotPasswordRequest {
  email: string;
  id: string;
  captcha: string;
}

export interface IUpdateUserRequest {
  uuid: string;
  email: string;
  fullName: string;
}


export interface IBlockchainAdminPermRequest {
  department_shine_name: string;
}