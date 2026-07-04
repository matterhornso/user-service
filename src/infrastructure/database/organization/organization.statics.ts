import { Model } from "mongoose";
import { IOrganization, IOrganizationUpdate } from "../../../domain";
import { IOrganizationModel } from "./organization.types";

export async function createOrganization(
  this: Model<IOrganizationModel>,
  { uuid, name, about, shine_name, active, transactionId, type }: IOrganization
): Promise<any> {
  let create_res = await this.create({ uuid, name, about, shine_name, active, type, transactions: [{ id: transactionId }] });
  // TODO check create_res
  return create_res;
}

export async function findOrganizationByID(
  this: Model<IOrganizationModel>,
  id: string
): Promise<any> {
  const record = await this.findOne({ _id: id })
  if (record) {
    return record
  } else {
    return []
  }
}
export async function findOrganizationByName(
  this: Model<IOrganizationModel>,
  name: string
): Promise<any> {
  const record = await this.findOne({ name: name })
  if (record) {
    return record
  } else {
    return []
  }
}
export async function getAllOrganizationByType(
  this: Model<IOrganizationModel>,
  type: string
): Promise<any> {
  const record = await this.find({ type: type })
  if (record) {
    return record
  } else {
    return []
  }
}

export async function findOrganizationByUUID(
  this: Model<IOrganizationModel>,
  uuid: string
): Promise<any> {
  const record = await this.findOne({ uuid: uuid })
  if (record) {
    return record
  } else {
    return []
  }
}
export async function getAllOrganization(
  this: Model<IOrganizationModel>, page: number,
  page_size: number
): Promise<any> {
  let pageSize = 0;
  let skip = 0;
  if (page >= 0 && page_size > 0) {
    pageSize = page_size;
    skip = page * page_size;
  }
  const noOfRecord = await this.find({}).countDocuments();
  const record = await this.find({}).lean().sort({ "createdAt": -1 })
  .skip(skip)
  .limit(pageSize)
  if (record) {
    return {record, noOfRecord}
  } else {
    return []
  }
}

export async function updateOrganizationByUUID(
  this: Model<IOrganizationModel>,
  { uuid, name, about, active }: {
    uuid: string;
    name: string;
    about: string;
    active: boolean;
  }
): Promise<any> {
  var set: any = {};
  if (name) set.name = name;
  if (about) set.about = about;
  if (active != undefined) set.active = active;

  const record = await this.updateOne({ uuid: uuid }, {
    $set: set
  });
  return record;
}

//create super-admin
export async function createSuperAdminOrganization(
  this: Model<IOrganizationModel>,
  org: any
): Promise<any> {
  let create_res = await this.create(org);
  // TODO check create_res
  return create_res;
}