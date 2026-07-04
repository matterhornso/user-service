import { User, CreateUser, UpdateUser } from '../../domain/index'
import { IUserRepository } from '../../application/repositories/IUserRepository'
import { IDBConnection } from './IDBConnection'

export class UserRepository extends IUserRepository {








  private connection: IDBConnection

  constructor(connection: IDBConnection) {
    super()
    this.connection = connection
  }

  async createUser(user: CreateUser): Promise<User> {
    // save to db
    let result = await this.connection.saveUser(user);
    // user.id = result.insertId;
    return result;
  }

  async getUserByEmailPassword(email: string, password: string): Promise<any> {
    let result = await this.connection.getUserByEmailPassword(email, password);
    return result;
  }

  async findUser(id: string): Promise<any> {
    let queryResults = await this.connection.findUser(id);
    return queryResults;
  }
  async getUserDetails(uid: string): Promise<any> {
    let queryResults = await this.connection.getUserDetails(uid);
    return queryResults;
  }

  async getUserDetailsByEmail(email: string): Promise<any> {
    let queryResults = await this.connection.getUserDetailsByEmail(email);
    return queryResults;
  }

  async getUsers(): Promise<any> {
    let queryResults = await this.connection.getUsers();
    return queryResults;
  }
  async getUsersById(id: string): Promise<any> {
    let queryResults = await this.connection.getUsersById(id);
    return queryResults;
  }
  async getUsersByDeptId(ids: any): Promise<any> {
    let queryResults = await this.connection.getUsersByDeptId(ids);
    return queryResults
  }

  async updateUserInfo(user: UpdateUser): Promise<any> {
    let queryResults = await this.connection.updateUserInfo(user);
    return queryResults;
  }

  async validateUser(email: string, uuid: string): Promise<any> {
    let queryResults = await this.connection.validateUser({ email, uuid });
    return queryResults;
  }
  async validatePassword(user: any, oldPassword: string): Promise<any> {
    let queryResults = await this.connection.validatePassword(user, oldPassword);
    return queryResults;
  }

  async changePassword(user: any): Promise<any> {
    // save to db
    let result = await this.connection.changePassword(user);
    // user.id = result.insertId;
    return result;
  }
  async resetPassword(user: any, newPassword: string): Promise<any> {
    let queryResults = await this.connection.resetPassword(user, newPassword);
    return queryResults;
  }

  async getUserDepartmentByUUID(uuid: string): Promise<any> {
    let department = await this.connection.getUserDepartmentByUUID(uuid);
    return department;
  }

  async checkForUserDepartment(uuid: string, departmentId: string): Promise<any> {
    let department = await this.connection.checkForUserDepartment(uuid, departmentId);
    return department;
  }
}