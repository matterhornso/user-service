import { CreateDepartment, UpdateDepartment } from "../../domain/index";

export abstract class IDepartmentRepository {
  abstract createDepartment(organization: CreateDepartment): Promise<any>;
  abstract findDepartmentByUUID(uuid: string): Promise<any>;
  abstract findDepartmentByID(id: string): Promise<any>;
  abstract getDepartmentByOrgId(id: string): Promise<any>;
  abstract findDepartmentByName(organization_id: string, name: string): Promise<any>;
  abstract findDepartmentByIDs(id: any): Promise<any>;
  abstract getAllDepartment(): Promise<any>;
  abstract getAllDepartmentByOrganizationId(
    id: any,
    page?: number,
    page_size?: number
  ): Promise<any>;
  abstract updateDepartmentByUUID(
    organization: UpdateDepartment
  ): Promise<any>;
}
