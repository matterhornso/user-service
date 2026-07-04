import { IOrganizationUpdate } from './OrganizationInterface';

export class UpdateOrganization implements IOrganizationUpdate {
  uuid!: string;
  name?: string;
  about?: string;
  active?: boolean;

  constructor(organization: IOrganizationUpdate) {
    if (!organization.uuid) throw new Error('uuid missing');
    this.uuid = organization.uuid;
    if (organization.name) this.name = organization.name;
    if (organization.about) this.about = organization.about;
    if (organization.active) this.active = organization.active;
  }
}