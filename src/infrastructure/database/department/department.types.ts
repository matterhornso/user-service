import { Document, Model } from "mongoose";
import {
  IDepartment,
  IDepartmentUpdate,
} from "../../../domain/department/DepartmentInterface";
import { IOrganization } from "../../../domain/organization/OrganizationInterface";

export interface IDepartmentDocument extends IDepartment, Document { }

export interface IDepartmentModel extends Model<IDepartmentDocument> {
  createDepartment: (
    this: IDepartmentModel,
    department: IDepartment
  ) => Promise<IDepartmentDocument>;

  findDepartmentByID: (
    this: IDepartmentModel,
    id: string
  ) => Promise<IDepartmentDocument>;

  findDepartmentByName: (
    this: IDepartmentModel,
    organization_id: string,
    name: string
  ) => Promise<IDepartmentDocument>;
  findDepartmentByIDs: (
    this: IDepartmentModel,
    id: any
  ) => Promise<IDepartmentDocument>;

  findDepartmentByUUID: (
    this: IDepartmentModel,
    uuid: string
  ) => Promise<IDepartmentDocument>;

  findByUUIDAndUpdate: (
    this: IDepartmentModel,
    departmentUpdate: IDepartmentUpdate
  ) => Promise<any>;

  getAllDepartment: (this: IDepartmentModel) => Promise<IDepartmentModel>;

  getDepartmentByOrgId: (this: IDepartmentModel, id: string) => Promise<IDepartmentModel>;

  getAllDepartmentByOrganizationId: (
    this: IDepartmentModel,
    id: string,
    page: number,
    page_size: number
  ) => Promise<IDepartmentDocument>;
  createSuperAdminDepartment: (this: IDepartmentModel, department: any) => Promise<IDepartmentDocument>;
}
