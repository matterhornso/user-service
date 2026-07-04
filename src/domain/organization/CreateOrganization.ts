import { IOrganization } from './OrganizationInterface';
import { Utils } from '../Utils';
import { v4 as uuidv4 } from 'uuid';

export class CreateOrganization implements IOrganization {
  uuid: string;
  name: string;
  about: string;
  active: boolean;
  type: string;
  shine_name?: string;
  user_shine_name: string;
  user_encrypted_data: string;
  user_public_key: string;
  transactionId?: string | undefined;
  transactionStatus?: boolean | undefined;

  constructor(organization: IOrganization) {
    console.log('organization', organization)
    // if (!organization.uuid) throw new Error('uuid missing');
    if (!organization.name) throw new Error('name missing');
    if (!organization.about) throw new Error('about missing');
    if (!organization.type) throw new Error('type signatures');
    if (!organization.user_shine_name) throw new Error('missing user_shine_name');
    if (!organization.user_encrypted_data) throw new Error('missing signatures');
    if (!organization.user_public_key) throw new Error('missing user_public_key');

    this.uuid = uuidv4();
    this.name = organization.name;
    this.type = organization.type;
    this.about = organization.about;
    organization.active == undefined ? this.active = true : this.active = organization.active;
    this.shine_name = new Utils().generateShineName();
    this.user_shine_name = organization.user_shine_name;
    this.user_encrypted_data = organization.user_encrypted_data;
    this.user_public_key = organization.user_public_key;
  }
}
