import { Document, Model } from "mongoose";
import { IOrganization, IOrganizationUpdate } from "../../../domain/organization/OrganizationInterface";

export interface IOrganizationDocument extends IOrganization, Document {
}

export interface IOrganizationModel extends Model<IOrganizationDocument> {

  createOrganization: (this: IOrganizationModel, organization: IOrganization) => Promise<IOrganizationDocument>;

  findOrganizationByID: (this: IOrganizationModel, id: string) => Promise<IOrganizationDocument>;

  findOrganizationByName: (this: IOrganizationModel, name: string) => Promise<IOrganizationDocument>;

  getAllOrganizationByType: (this: IOrganizationModel, type: string) => Promise<IOrganizationDocument>;

  getAllOrganization: (this: IOrganizationModel,page: number, page_size: number) => Promise<IOrganizationDocument>;

  findOrganizationByUUID: (this: IOrganizationModel, uuid: string) => Promise<IOrganizationDocument>;

  updateOrganizationByUUID: (this: IOrganizationModel, { uuid, name, about, active }: IOrganizationUpdate) => Promise<any>;

  createSuperAdminOrganization: (this: IOrganizationModel, org: any) => Promise<any>;
}