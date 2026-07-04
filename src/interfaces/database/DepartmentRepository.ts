import { CreateDepartment, UpdateDepartment } from "../../domain/index";
import { IDBConnection } from "./IDBConnection";
import { IDepartmentRepository } from "../../application/repositories/IDepartmentRepository";

export class DepartmentRepository extends IDepartmentRepository {

  private connection: IDBConnection;

  constructor(connection: IDBConnection) {
    super();
    this.connection = connection;
  }

  async createDepartment(department: CreateDepartment): Promise<any> {
    let result = await this.connection.createDepartment(department);
    return result;
  }

  async findDepartmentByUUID(uuid: string): Promise<any> {
    let result = await this.connection.findDepartmentByUUID(uuid);
    return result;
  }

  async findDepartmentByID(id: string): Promise<any> {
    let result = await this.connection.findDepartmentByID(id);
    return result;
  }

  async findDepartmentByName(organization_id: string, name: string): Promise<any> {
    let result = await this.connection.findDepartmentByName(organization_id, name);
    return result;
  }

  async updateDepartmentByUUID(department: UpdateDepartment): Promise<any> {
    let result = await this.connection.updateDepartmentByUUID(department);
    return result;
  }
  async getAllDepartment(): Promise<any> {
    let result = await this.connection.getAllDepartment();
    return result;
  }
  async getAllDepartmentByOrganizationId(
    id: any,
    page: number,
    page_size: number
  ): Promise<any> {
    let result = await this.connection.getAllDepartmentByOrganizationId(
      id,
      page,
      page_size
    );
    return result;
  }
  async findDepartmentByIDs(id: any): Promise<any> {
    let result = await this.connection.findDepartmentByIDs(id);
    return result;
  }
  async getDepartmentByOrgId(id: string): Promise<any> {
    let result = await this.connection.getDepartmentByOrgId(id);
    return result;
  }
}
