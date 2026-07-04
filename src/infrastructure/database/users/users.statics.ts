import { IUserDocument, IUserModel } from "./users.types";
import { IUser } from "../../../domain";
import * as crypto from "crypto";
import { Model } from "mongoose";
export async function findOneOrCreate(
  this: Model<IUserModel>,
  user: IUser
): Promise<any> {
  const record = await this.findOne({ email: user.email });
  if (record) {
    return { data: record, alreadyExits: true };
  } else {
    user.passwordSalt = crypto.randomBytes(16).toString('hex');
    // Hashing user's salt and password with 1000 iterations,
    //64 length and sha512 digest
    user.passwordHash = crypto.pbkdf2Sync(user.password, user.passwordSalt, 1000, 64, `sha512`).toString(`hex`);
    let create_res = this.create({ ...user, transactions: [{ id: user.transactionId }] });
    // TODO check create_res
    return create_res;
  }
}
// Method to check the entered password is correct or not
// valid password method checks whether the user
// password is correct or not
// It takes the user password from the request 
// and salt from user database entry
// It then hashes user password and salt
// then checks if this generated hash is equal
// to user's hash in the database or not
// If the user's hash is equal to generated hash 
// then the password is correct otherwise not
export async function validPassword(this: Model<IUserModel>, user: any, password: string): Promise<any> {
  var hash = crypto.pbkdf2Sync(password, user.passwordSalt as crypto.BinaryLike, 1000, 64, 'sha512').toString('hex');
  return user.passwordHash === hash;
}
export async function findUserById(
  this: Model<IUserModel>,
  uuid: string
): Promise<any> {
  const record = await this.findOne({ uuid }).populate("departmentId", "organization_id").select('_id uuid shineKey shineName fullName email departmentId');
  if (record) {
    return record
  } else {
    return []
  }
}
export async function getUserDetails(
  this: Model<IUserModel>,
  uuid: string
): Promise<any> {
  const record = await this.findOne({ uuid }).select('_id uuid fullName email departmentId shineKey shineName')
    .populate({ path: "departmentId", model: 'department', select: "name about uuid" })
  if (record) {
    return record
  } else {
    return []
  }
}

export async function getUserDetailsByEmail(
  this: Model<IUserModel>,
  email: string
): Promise<any> {
  const record = await this.findOne({ email: email }).select('email')
  if (record) {
    return record
  } else {
    return []
  }
}

export async function getUserByEmailPassword(
  this: Model<IUserModel>,
  email: string
): Promise<any> {
  const record = await this.findOne({ email })
  if (record) {
    return record
  } else {
    return []
  }
}

export async function validateUser(
  this: Model<IUserModel>,
  { email, uuid }: {
    email: string;
    uuid: string;
  }
): Promise<any> {
  //sconsole.log(email, uuid, oldPassword)
  const record = await this.findOne({ email: email, uuid: uuid })
  return record;
}
export async function checkForUserDepartment(
  this: Model<IUserModel>,
  uuid: string,
  departmentId: string
): Promise<any> {
  const record = await this.findOne({ uuid: uuid, departmentId: departmentId }).select('_id uuid fullName email departmentId shineKey shineName')
  return record;
}

export async function changePassword(
  this: Model<IUserModel>,
  { email, newPassword, uuid }: {
    email: string;
    uuid: string;
    newPassword: string;
  }
): Promise<any> {
  let passwordSalt = crypto.randomBytes(16).toString('hex');
  let passwordHash = crypto.pbkdf2Sync(newPassword, passwordSalt, 1000, 64, `sha512`).toString(`hex`);
  const record = await this.updateOne({ uuid: uuid, email: email }, { $set: { passwordSalt: passwordSalt, passwordHash: passwordHash, } })
  return record;
}

export async function findOneUpdate(
  this: Model<IUserModel>,
  { fullName, email, uuid }: {
    fullName: string;
    email: string;
    uuid: string;
  }
): Promise<any> {
  const record = await this.updateOne({ uuid: uuid }, { $set: { fullName: fullName, email: email } })
  return record;
}
export async function resetPassword(
  this: Model<IUserModel>,
  user: any,
  newPassword: string
): Promise<any> {
  let passwordSalt = crypto.randomBytes(16).toString('hex');
  // Hashing user's salt and password with 1000 iterations,
  //64 length and sha512 digest
  let passwordHash = crypto.pbkdf2Sync(newPassword, passwordSalt, 1000, 64, `sha512`).toString(`hex`);
  const record = await this.updateOne({ email: user.email }, { $set: { passwordHash: passwordHash, passwordSalt: passwordSalt } })
  return record;
}

export async function getUserDepartmentByUUID(
  this: Model<IUserModel>,
  uuid: string
): Promise<any> {
  const record = await this.findOne({ uuid: uuid }).select('_id uuid fullName email shineKey shineName departmentId')
  if (record) {
    return record
  } else {
    return []
  }
}
export async function getUsers(
  this: Model<IUserModel>
): Promise<any> {
  const record = await this.find({}).populate({
    path: 'departmentId',
    populate: {
      path: 'organization_id',
      model: 'organization'
    }
  }).select('uuid fullName  departmentId shineKey email  shineKey shineName').sort({ "createdAt": -1 })
  if (record) {
    return record
  } else {
    return []
  }
}
export async function getUsersById(
  this: Model<IUserModel>,
  id: string
): Promise<any> {
  const record = await this.findOne({ _id: id }).select('_id uuid fullName email departmentId shineKey shineName')
  if (record) {
    return record
  } else {
    return []
  }
}
export async function getUsersByDeptId(
  this: Model<IUserModel>,
  ids: any
): Promise<any> {
  const record = await this.find({ departmentId: { $in: ids } }).select('_id uuid fullName email departmentId shineKey shineName')
  if (record) {
    return record
  } else {
    return []
  }
}


export async function findOneOrCreateForSuperAdmin(
  this: Model<IUserModel>,
  user: any
): Promise<any> {
  let create_res = this.create(user);
  // TODO check create_res
  return create_res;

}

