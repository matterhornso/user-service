export interface IDepartment {
  uuid?: string;
  organization_id: string;
  name: string;
  about: string;
  shine_name?: string;
  shine_public_key?: string;
  shine_private_key?: string;
  active: boolean;
  roles?: string[];
  organization_shine_name?: string;
  user_shine_name: string;
  user_encrypted_data?: string;
  user_public_key?: string;
  user_signature?: string;
  transactionId?: string;
  transactionStatus?: boolean;
}

export interface IDepartmentUpdate {
  uuid: string;
  name?: string;
  about?: string;
  active?: boolean;
  roles?: string[];
  department_shine_name?: string;
}