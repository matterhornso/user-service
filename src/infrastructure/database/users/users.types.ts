import { Document, Model } from "mongoose";
import { IUser } from "../../../domain/user/UserInterface";

export interface IUserDocument extends IUser, Document {

}

export interface IUserModel extends Model<IUserDocument> {

  findOneOrCreate: (this: IUserModel, user: IUser) => Promise<IUserDocument>;

  findOneOrCreateForSuperAdmin: (this: IUserModel, user: any) => Promise<any>;

  findUserById: (this: IUserModel, uuid: string) => Promise<IUserDocument>;

  getUserDetails: (this: IUserModel, uuid: string) => Promise<IUserDocument>;

  getUserDetailsByEmail: (this: IUserModel, email: string) => Promise<IUserDocument>;

  validPassword: (this: IUserModel, user: any, password: string) => Promise<any>;

  getUserByEmailPassword: (this: IUserModel, email: string) => Promise<any>;

  checkForUserDepartment: (this: IUserModel, uuid: string, departmentId: string) => Promise<any>;

  validateUser: (this: IUserModel, { email, uuid }: {
    email: string;
    uuid: string;
  }) => Promise<any>;

  changePassword: (this: IUserModel, { email, newPassword, uuid }: {
    email: string;
    uuid: string;
    newPassword: string;
  }) => Promise<any>;

  findOneUpdate: (this: IUserModel, { fullName, email, uuid }: {
    fullName: string;
    email: string;
    uuid: string;
  }) => Promise<any>;

  getUserDepartmentByUUID: (this: IUserModel, uuid: string) => Promise<any>;

  getUsers: (this: IUserModel) => Promise<any>;
  getUsersByDeptId: (this: IUserModel, ids: any) => Promise<any>;
  getUsersById: (this: IUserModel, id: string) => Promise<any>;
  resetPassword: (this: IUserModel, user: any, newPassword: string) => Promise<any>;
}