import { CreateOrganization, UpdateOrganization } from '../../domain/index'
import { IDBConnection } from './IDBConnection'
import { IOrganizationRepository } from '../../application/repositories/IOrganizationRepository'

export class OrganizationRepository extends IOrganizationRepository {


  private connection: IDBConnection

  constructor(connection: IDBConnection) {
    super()
    this.connection = connection
  }

  async createOrganization(organization: CreateOrganization): Promise<any> {
    let result = await this.connection.createOrganization(organization);
    return result;
  }

  async findOrganizationByUUID(uuid: string): Promise<any> {
    let result = await this.connection.findOrganizationByUUID(uuid);
    return result;
  }

  async findOrganizationByID(id: string): Promise<any> {
    let result = await this.connection.findOrganizationByID(id);
    return result;
  }

  async findOrganizationByName(name: string): Promise<any> {
    let result = await this.connection.findOrganizationByName(name);
    return result;
  }

  async updateOrganizationByUUID(organization: UpdateOrganization): Promise<any> {
    let result = await this.connection.updateOrganizationByUUID(organization);
    return result;
  }

  async getAllOrganization(page: number, page_size: number): Promise<any> {
    let result = await this.connection.getAllOrganization(page, page_size);
    return result;
  }
  async getAllOrganizationByType(type: string): Promise<any> {
    let result = await this.connection.getAllOrganizationByType(type);
    return result;
  }
}