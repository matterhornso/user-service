import { Schema } from "mongoose";
import { findOneOrCreateForSuperAdmin, checkForUserDepartment, getUserDetails, getUserDetailsByEmail, resetPassword, validPassword, getUsersById, getUsers, getUsersByDeptId, findOneOrCreate, findUserById, validateUser, changePassword, findOneUpdate, getUserByEmailPassword, getUserDepartmentByUUID } from "./users.statics";

const UserSchema = new Schema<any>({
  uuid: {
    type: String,
    required: true,
    unique: true
  },
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  departmentId: {
    type: Schema.Types.ObjectId,
    ref: 'department'
  },
  password: {
    type: String
  },
  shineKey: {
    type: String,
    required: true
  },
  shineName: {
    type: String,
    required: true
  },
  shinePrivateKey: {
    type: String,
    required: true
  },
  passwordHash: {
    type: String
  },
  passwordSalt: {
    type: String
  },


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

UserSchema.statics.findOneOrCreate = findOneOrCreate;
UserSchema.statics.findUserById = findUserById;
UserSchema.statics.getUsersById = getUsersById;
UserSchema.statics.validateUser = validateUser;
UserSchema.statics.validPassword = validPassword;
UserSchema.statics.changePassword = changePassword;
UserSchema.statics.resetPassword = resetPassword;
UserSchema.statics.findOneUpdate = findOneUpdate;
UserSchema.statics.getUsers = getUsers;
UserSchema.statics.getUserDetails = getUserDetails;
UserSchema.statics.getUserDetailsByEmail = getUserDetailsByEmail;
UserSchema.statics.getUsersByDeptId = getUsersByDeptId;
UserSchema.statics.checkForUserDepartment = checkForUserDepartment;
UserSchema.statics.getUserByEmailPassword = getUserByEmailPassword;
UserSchema.statics.getUserDepartmentByUUID = getUserDepartmentByUUID;
UserSchema.statics.findOneOrCreateForSuperAdmin = findOneOrCreateForSuperAdmin;


export default UserSchema;
