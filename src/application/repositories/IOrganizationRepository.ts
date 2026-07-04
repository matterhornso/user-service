import { CreateOrganization, UpdateOrganization } from '../../domain/index';

export abstract class IOrganizationRepository {
  abstract createOrganization(organization: CreateOrganization): Promise<any>
  abstract findOrganizationByUUID(uuid: string): Promise<any>
  abstract findOrganizationByID(id: string): Promise<any>
  abstract updateOrganizationByUUID(organization: UpdateOrganization): Promise<any>
  abstract getAllOrganization(page?: number, page_size?: number): Promise<any>
  abstract getAllOrganizationByType(type: string): Promise<any>;
  abstract findOrganizationByName(name: string): Promise<any>
}