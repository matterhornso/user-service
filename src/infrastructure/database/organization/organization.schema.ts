import { Schema } from "mongoose";
import { createSuperAdminOrganization, createOrganization, updateOrganizationByUUID, findOrganizationByID, findOrganizationByUUID, getAllOrganization, getAllOrganizationByType, findOrganizationByName } from "./organization.statics";

const OrganizationSchema = new Schema({
  uuid: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
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
  active: {
    type: Boolean,
    default: false
  },
  transactions: [{
    id: {
      type: String
    },
    status: {
      type: Boolean,
      default: false
    }
  }],
}, {
  timestamps: true
});

OrganizationSchema.statics.createOrganization = createOrganization;
OrganizationSchema.statics.createSuperAdminOrganization = createSuperAdminOrganization;
OrganizationSchema.statics.updateOrganizationByUUID = updateOrganizationByUUID;
OrganizationSchema.statics.findOrganizationByID = findOrganizationByID;
OrganizationSchema.statics.findOrganizationByName = findOrganizationByName;
OrganizationSchema.statics.findOrganizationByUUID = findOrganizationByUUID;
OrganizationSchema.statics.getAllOrganization = getAllOrganization;
OrganizationSchema.statics.getAllOrganizationByType = getAllOrganizationByType;

export default OrganizationSchema;