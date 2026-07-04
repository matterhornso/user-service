import { Schema } from "mongoose";
import { getDepartmentByOrgId, createSuperAdminDepartment, createDepartment, findDepartmentByIDs, findByUUIDAndUpdate, findDepartmentByID, findDepartmentByName, findDepartmentByUUID, getAllDepartment, getAllDepartmentByOrganizationId } from "./department.statics";

const DepartmentSchema = new Schema({
  uuid: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  organization_id: {
    type: Schema.Types.ObjectId,
    ref: 'organization',
    required: true
  },
  about: {
    type: String,
    required: true
  },
  shine_name: {
    type: String,
    required: true
  },
  shine_public_key: {
    type: String,
    required: true
  },
  shine_private_key: {
    type: String,
    required: true
  },
  active: {
    type: Boolean,
    default: true
  },
  roles: [{
    type: String
  }],
  transactions: [{
    id: {
      type: String
    },
    status: {
      type: Boolean,
      default: false
    }
  }]
}, { timestamps: true });

DepartmentSchema.statics.createDepartment = createDepartment;
DepartmentSchema.statics.createSuperAdminDepartment = createSuperAdminDepartment;
DepartmentSchema.statics.findByUUIDAndUpdate = findByUUIDAndUpdate;
DepartmentSchema.statics.findDepartmentByID = findDepartmentByID;
DepartmentSchema.statics.findDepartmentByName = findDepartmentByName;
DepartmentSchema.statics.findDepartmentByIDs = findDepartmentByIDs;
DepartmentSchema.statics.findDepartmentByUUID = findDepartmentByUUID;
DepartmentSchema.statics.getAllDepartment = getAllDepartment;
DepartmentSchema.statics.getAllDepartmentByOrganizationId = getAllDepartmentByOrganizationId;
DepartmentSchema.statics.getDepartmentByOrgId = getDepartmentByOrgId;


export default DepartmentSchema;