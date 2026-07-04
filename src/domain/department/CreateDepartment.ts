import { IDepartment } from './DepartmentInterface';
import { v4 as uuidv4 } from 'uuid';
import { Utils } from '../Utils';

export class CreateDepartment implements IDepartment {
  uuid?: string;
  name: string;
  about: string;
  organization_id: string;
  active: boolean;
  roles?: string[];
  organization_shine_name?: string;
  shine_name?: string;
  shine_public_key?: string;
  shine_private_key?: string;
  user_shine_name: string;
  user_encrypted_data: string;
  user_public_key: string;
  user_signature: string;

  constructor(department: IDepartment) {
    if (!department.name) throw new Error('name missing');
    if (!department.about) throw new Error('about missing');
    if (!department.organization_id) throw new Error('organization_id missing');
    if (!department.shine_private_key) throw new Error('shine_private_key missing');
    if (!department.shine_public_key) throw new Error('shine_public_key missing');
    if (!department.user_shine_name) throw new Error('user_shine_name missing');
    if (!department.user_encrypted_data) throw new Error('missing user_encrypted_data');
    if (!department.user_signature) throw new Error('user_signature missing');
    if (!department.user_public_key) throw new Error('missing user_public_key');
    // if (!department.organization_shine_name) throw new Error('missing organization_shine_name');

    this.uuid = uuidv4();
    this.name = department.name;
    this.about = department.about;
    this.organization_id = department.organization_id;
    this.shine_name = new Utils().generateShineName();
    this.shine_private_key = department.shine_private_key;
    this.shine_public_key = department.shine_public_key;

    this.user_shine_name = department.user_shine_name;
    this.user_encrypted_data = department.user_encrypted_data;
    this.user_public_key = department.user_public_key;
    this.user_signature = department.user_signature;

    department.active == undefined ? this.active = true : this.active = department.active;

    if (department.roles && department.roles.length > 0) this.roles = department.roles;
    else this.roles = [];
  }
}