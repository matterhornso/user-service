import { CreateOrganization, UpdateOrganization } from '../index';
import { IOrganizationUpdate, IOrganization } from './OrganizationInterface';

export class Organization {

  constructor() { };

  create(organization: IOrganization, usecase: any) {
    let createOrganization = new CreateOrganization(organization);
    return usecase.execute(createOrganization)
  }

  updateOrganizationByUUID(organization: IOrganizationUpdate, usecase: any) {
    let updateOrganization = new UpdateOrganization(organization);
    return usecase.execute(updateOrganization)
  }
}