import { IDepartmentModel } from "./department.types";
import { IDepartment, IDepartmentUpdate } from "../../../domain";
import mongoose from "mongoose";
import { Model } from "mongoose";
export async function createDepartment(
  this: Model<IDepartmentModel>,
  department: IDepartment
): Promise<any> {
  let create_res = await this.create({
    ...department,
    transactions: [{ id: department.transactionId }],
  });
  // TODO check create_res
  return create_res;
}

export async function findDepartmentByID(
  this: Model<IDepartmentModel>,
  id: string
): Promise<any> {
  console.log('findDepartmentByID', id)
  const record = await this.findOne({ _id: id })
  if (record) {
    return record;
  } else {
    return [];
  }
}

export async function findDepartmentByName(
  this: Model<IDepartmentModel>,
  organization_id: string,
  name: string
): Promise<any> {
  const record = await this.findOne({ organization_id: organization_id, name: name })
  if (record) {
    return record;
  } else {
    return [];
  }
}
export async function findDepartmentByIDs(
  this: Model<IDepartmentModel>,
  ids: any
): Promise<any> {
  let temp_ids = [];
  for (let index = 0; index < ids.id.length; index++) {
    temp_ids.push(new mongoose.Types.ObjectId(ids.id[index]));
  }
  const record = await this.find({ _id: { $in: temp_ids } }).select("name");
  if (record) {
    return record;
  } else {
    return [];
  }
}

export async function findDepartmentByUUID(
  this: Model<IDepartmentModel>,
  uuid: string
): Promise<any> {
  const record = await this.findOne({ uuid: uuid });
  if (record) {
    return record;
  } else {
    return [];
  }
}

export async function findByUUIDAndUpdate(
  this: Model<IDepartmentModel>,
  departmentUpdate: IDepartmentUpdate
): Promise<any> {
  var set: any = {};
  if (departmentUpdate.name) set.name = departmentUpdate.name;
  if (departmentUpdate.about) set.about = departmentUpdate.about;
  if (departmentUpdate.active) set.active = departmentUpdate.active;
  if (departmentUpdate.roles && departmentUpdate.roles.length > 0)
    set.roles = departmentUpdate.roles;

  const record = await this.updateOne(
    { uuid: departmentUpdate.uuid },
    {
      $set: set,
    }
  );
  return record;
}

export async function getAllDepartment(this: Model<IDepartmentModel>): Promise<any> {
  const record = await this.find({}).sort({ createdAt: -1 }).
  populate({
    path: 'organization_id',
    model: 'organization'
  });
  if (record) {
    return record;
  } else {
    return [];
  }
}
export async function getDepartmentByOrgId(this: Model<IDepartmentModel>, id: string): Promise<any> {
  const record = await this.find({ organization_id: id.toString() }).sort({ createdAt: -1 });
  if (record) {
    return record;
  } else {
    return [];
  }
}
export async function getAllDepartmentByOrganizationId(
  this: Model<IDepartmentModel>,
  ids: any,
  page: number,
  page_size: number
): Promise<any> {
  let pageSize = 0;
  let skip = 0;
  if (page >= 0 && page_size > 0) {
    pageSize = page_size;
    skip = page * page_size;
  }
  const record = await this.find({ organization_id: { $in: ids } })
    .lean()
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(pageSize)
    .sort({ updatedAt: -1 });
  if (record) {
    return record;
  } else {
    return [];
  }
}

//onboaring superadmin
export async function createSuperAdminDepartment(
  this: Model<IDepartmentModel>,
  department: any
): Promise<any> {
  let create_res = await this.create(department);
  // TODO check create_res
  return create_res;
}