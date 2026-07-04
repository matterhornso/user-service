import { model } from "mongoose";
import { IOrganizationDocument, IOrganizationModel } from "./organization.types";
import OrganizationSchema from "./organization.schema";

export const OrganizationModel = model<IOrganizationDocument>("organization", OrganizationSchema) as IOrganizationModel;