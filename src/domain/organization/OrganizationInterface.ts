export interface IOrganization {
  uuid?: string;
  name: string;
  type: string;
  about: string;
  shine_name?: string;
  active: boolean;
  user_shine_name: string;
  user_encrypted_data: string;
  user_public_key: string;
  transactionId?: string;
  transactionStatus?: boolean;
}

export interface IOrganizationUpdate {
  uuid: string;
  name?: string;
  about?: string;
  active?: boolean;
}