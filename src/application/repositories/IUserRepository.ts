import { User, CreateUser, ChangePassword, UpdateUser } from '../../domain/index';
import { } from '../../domain/index';

export abstract class IUserRepository {
  abstract  createUser(user: CreateUser): Promise<any>
  abstract  findUser(uid: string): Promise<any>
  abstract  getUserDetails(uid: string): Promise<any>
  abstract  getUserDetailsByEmail(email: string): Promise<any>
  abstract  getUsers(): Promise<any>
  abstract  validateUser(email: string, uuid: string): Promise<any>
  abstract  validatePassword(user: any, oldPassword: string): Promise<any>
  abstract  resetPassword(user: any, newPassword: string): Promise<any>
  abstract  getUsersById(id: string): Promise<any>
  abstract  getUsersByDeptId(ids: any): Promise<any>
  abstract  checkForUserDepartment(uuid: string, departmentId: string): Promise<any>
  abstract  changePassword(user: ChangePassword): Promise<any>
  abstract  updateUserInfo(user: UpdateUser): Promise<any>
  abstract  getUserByEmailPassword(email: string, password: string): Promise<any>
  abstract  getUserDepartmentByUUID(uuid: string): Promise<any>
}