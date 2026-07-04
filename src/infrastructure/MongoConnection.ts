import mongoose from "mongoose";
import logger from "./logger/logger";

import { IDBConnection } from "../interfaces/database/IDBConnection";
import { UserModel } from "./database/users/users.model";
import { OrganizationModel } from "./database/organization/organization.model";
import { DepartmentModel } from "./database/department/department.model";
import { BCService } from "../interfaces/services/Blockchain.service";
import { EncryptionService } from "../interfaces/services/Encryption.service";
import {
  IOrganization,
  IOrganizationUpdate,
  IDepartment,
  IDepartmentUpdate,
  IUser,
} from "../domain/index";

export class MongoConnection extends IDBConnection {
  constructor() {
    super();
    let mongo_url: string;

    if (process.env.MONGODB_URI) {
      mongo_url =
        process.env.MONGODB_URI +
        "/" +
        process.env.DB_NAME +
        "?authSource=admin"; // replicaSet=staging-rs0
    } else if (process.env.ENVIRONMENT?.toString().includes("dev")) {
      // mongo_url = process.env.MONGODB_HOST + ":" + process.env.MONGODB_PORT + "/" + process.env.DB_NAME;
      mongo_url =
        "mongodb://" +
        process.env.DB_USER +
        ":" +
        process.env.DB_PASS +
        "@" +
        process.env.MONGODB_HOST +
        ":" +
        process.env.MONGODB_PORT +
        "/" +
        process.env.DB_NAME +
        "?authSource=admin";
    } else if (process.env.ENVIRONMENT?.toString().includes("test")) {
      mongo_url = process.env.MONGODB_HOST + "/" + process.env.DB_NAME;
    } else {
      mongo_url =
        "mongodb://" +
        process.env.DB_USER +
        ":" +
        process.env.DB_PASS +
        "@" +
        process.env.MONGODB_HOST +
        ":" +
        process.env.MONGODB_PORT +
        "/" +
        process.env.DB_NAME +
        "?authSource=admin";
    }

    mongoose
      .connect(mongo_url)
      .then(() => {
        logger.debug(
          "MongoDB connection successful at " +
          new Date() +
          " , url " +
          mongo_url
        );
      })
      .catch((err: string) => {
        console.log(
          "MongoDB connection error. Please make sure MongoDB is running. " +
          err
        );
      });
    return;
  }

  // ********* USER ********* //

  async saveUser(user: IUser) {
    let encryptionService = new EncryptionService();
    let keys = ["EOS61Lx8BPJ7Yb6HtzJ1ikBnbEsnMys7SUEbBXyGmbv9CrcDPUNhg"]; // TODO get all departments key who we need to give access
    let encryptedData = await encryptionService.encryptData(user, keys);
    let bcService = new BCService();
    let transaction_id = await bcService.createUser(user, encryptedData);
    if (!transaction_id)
      return new Error(
        "An error occurred while sending tx to blockchain, tx id missing!"
      );

    user.transactionId = transaction_id;
    return await UserModel.findOneOrCreate(user);
  }
  async findUser(query: any) {
    let user = await UserModel.findUserById(query);
    return user;
  }
  async resetPassword(user: any, newPassword: string) {
    let users = await UserModel.resetPassword(user, newPassword);
    return users;
  }
  async getUserByEmailPassword(email: string, password: string) {
    let user = await UserModel.getUserByEmailPassword(email);
    if (password == "") return user;
    if (user) {
      let validatePassword = await UserModel.validPassword(user, password);
      if (validatePassword) return user;
      if (!validatePassword) throw new Error("password incorrect");
    } else {
      throw new Error("user not found");
    }
  }
  async validatePassword(user: any, oldPassword: string) {
    return await UserModel.validPassword(user, oldPassword);
  }
  async changePassword(query: any) {
    let changePasswordResponse = await UserModel.changePassword(query);
    if (changePasswordResponse) {
      return changePasswordResponse;
    } else {
      throw new Error("something went wrong !!");
    }
  }

  async validateUser(query: any) {
    let user = await UserModel.validateUser(query);
    return user;
  }
  async checkForUserDepartment(uuid: string, departmentId: string) {
    let user = await UserModel.checkForUserDepartment(uuid, departmentId);
    return user;
  }
  async updateUserInfo(query: any) {
    let user = await UserModel.findOneUpdate(query);
    return user;
  }
  async getUserDetails(query: any) {
    let user = await UserModel.getUserDetails(query);
    return user;
  }
  async getUserDetailsByEmail(query: any) {
    let user = await UserModel.getUserDetailsByEmail(query);
    return user;
  }
  async getUserDepartmentByUUID(query: any) {
    let user = await UserModel.getUserDepartmentByUUID(query);
    return user;
  }
  async getUsers() {
    let user = await UserModel.getUsers();
    return user;
  }
  async getUsersById(id: string) {
    let user = await UserModel.getUsersById(id);
    return user;
  }
  async getUsersByDeptId(ids: any) {
    let user = await UserModel.getUsersByDeptId(ids);
    return user;
  }

  // ********* USER ********* //

  // ********* ORGANIZATION ********* //

  async createOrganization(org: any) {
    // console.log("createOrganization", org)
    // let encryptionService = new EncryptionService();
    // let keys = ["EOS61Lx8BPJ7Yb6HtzJ1ikBnbEsnMys7SUEbBXyGmbv9CrcDPUNhg"]; // TODO get all departments key who we need to give access
    // let encryptedData = await encryptionService.encryptData(org, keys);
    // let bcService = new BCService();
    // let transaction_id = await bcService.createOrg(org, encryptedData);
    // if (!transaction_id)
    //   return new Error(
    //     "An error occurred while sending tx to blockchain, tx id missing!"
    //   );
    // org.transactionId = transaction_id;

    return await OrganizationModel.createOrganization(org);
  }

  async findOrganizationByUUID(uuid: string) {
    return await OrganizationModel.findOrganizationByUUID(uuid);
  }

  async findOrganizationByID(id: string) {
    return await OrganizationModel.findOrganizationByID(id);
  }

  async findOrganizationByName(name: string) {
    return await OrganizationModel.findOrganizationByName(name);
  }

  async updateOrganizationByUUID(query: any) {
    return await OrganizationModel.updateOrganizationByUUID(query);
  }

  async getAllOrganization(page: number, page_size: number) {
    return await OrganizationModel.getAllOrganization(page, page_size);
  }

  async getAllOrganizationByType(type: string) {
    return await OrganizationModel.getAllOrganizationByType(type);
  }

  // ********* ORGANIZATION ********* //

  // ********* DEPARTMENT ********* //

  async createDepartment(department: IDepartment) {
    // let encryptionService = new EncryptionService();
    // let keys = ["EOS61Lx8BPJ7Yb6HtzJ1ikBnbEsnMys7SUEbBXyGmbv9CrcDPUNhg"]; // TODO get all departments key who we need to give access
    // let { shine_private_key, ..._department } = { ...department }; // remove shine_private_key
    // let encryptedData = await encryptionService.encryptData(_department, keys);

    // let bcService = new BCService();
    // let transaction_id = await bcService.createDepartment(
    //   department,
    //   encryptedData
    // );

    // if (!transaction_id)
    //   return new Error(
    //     "An error occurred while sending tx to blockchain, tx id missing!"
    //   );

    // department.transactionId = transaction_id;

    return await DepartmentModel.createDepartment(department);
  }

  async findDepartmentByUUID(uuid: string) {
    return await DepartmentModel.findDepartmentByUUID(uuid);
  }

  async findDepartmentByID(id: string) {
    return await DepartmentModel.findDepartmentByID(id);
  }
  async getDepartmentByOrgId(id: string) {
    return await DepartmentModel.getDepartmentByOrgId(id);
  }

  async findDepartmentByName(organization_id: string, name: string) {
    return await DepartmentModel.findDepartmentByName(organization_id, name);
  }

  async findDepartmentByIDs(id: any) {
    return await DepartmentModel.findDepartmentByIDs(id);
  }

  async updateDepartmentByUUID(departmentUpdate: IDepartmentUpdate) {
    return await DepartmentModel.findByUUIDAndUpdate(departmentUpdate);
  }

  async getAllDepartment() {
    return await DepartmentModel.getAllDepartment();
  }

  async getAllDepartmentByOrganizationId(
    id: string,
    page: number,
    page_size: number
  ) {
    return await DepartmentModel.getAllDepartmentByOrganizationId(
      id,
      page,
      page_size
    );
  }

}
