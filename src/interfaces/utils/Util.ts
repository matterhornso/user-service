import { Get as GetDepartment } from '../../application/usecases/department/GetDepartment'
import { GetUser } from '../../application/usecases/user/GetUser'
import { IDepartment } from "../../domain/department/DepartmentInterface"
import { IUser } from "../../domain/user/UserInterface"
import { DepartmentRepository } from '../database/DepartmentRepository'
import { UserRepository } from '../database/UserRepository'
import { RoleService } from '../services/Role.service'
import logger from '../../infrastructure/logger/logger';

export class Util {

  constructor() { }

  async getDepartmentInfo(user: any, userRepository: UserRepository, departmentRepository: DepartmentRepository): Promise<any> {
    return new Promise(async (resolve, reject) => {
      if (!user) return reject(new Error("user not found"));

      let _user_uuid = user._user_uuid || user.uuid;

      if (!_user_uuid) return reject(new Error("user_uuid not found"));

      const getUser = new GetUser(userRepository);
      let userInfo: IUser = await getUser.getUserDepartmentByUUID(_user_uuid);

      // TODO other checks
      if (!userInfo || !userInfo.departmentId) return reject(new Error("user info not found!"));

      let departmentID: string = userInfo.departmentId.toString();

      const getDepartment = new GetDepartment(departmentRepository);
      let department: IDepartment = await getDepartment.findDepartmentByID(departmentID);

      // if (!department || !department.roles || department.roles.length == 0 || !department.organization_id) return reject(new Error("department info not found!"));
      if (!department) return reject(new Error("department info not found!"));

      // return resolve({ roles: department.roles, organization_id: department.organization_id });
      return resolve(department);
    });
  }

  async getUserInfo(user: any, userRepository: UserRepository): Promise<any> {
    return new Promise(async (resolve, reject) => {
      if (!user) return reject(new Error("user not found"));

      let _user_uuid = user._user_uuid || user.uuid;

      if (!_user_uuid) return reject(new Error("user_uuid not found"));

      const getUser = new GetUser(userRepository);

      let userInfo: IUser = await getUser.execute(_user_uuid);


      // TODO other checks
      if (!userInfo) return reject(new Error("user info not found!"));

      // return resolve({ roles: department.roles, organization_id: department.organization_id });
      return resolve(userInfo);
    });
  }


  async hasPermission(user: any, isOwnerOrMember: boolean, action: string, roles: string[], resource: string, userRepository: UserRepository, departmentRepository: DepartmentRepository): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      let jwtToken = user.jwtToken;
      if (!jwtToken) return reject(new Error("jwtToken not found"));

      let userPermissionResponse = await new RoleService().isPermissionGranted(jwtToken, isOwnerOrMember, action, roles, resource);
      console.log("userPermissionResponse", userPermissionResponse)
      if (!userPermissionResponse || !userPermissionResponse.data) return reject(new Error("permission not found"));
      let granted: boolean = userPermissionResponse.data;
      if (granted == true) return resolve(true);
      return resolve(false);
    });
  }

  async getPermission(user: any, isOwnerOrMember: boolean, action: string, roles: string[], resource: string, userRepository: UserRepository, departmentRepository: DepartmentRepository): Promise<any> {
    return new Promise(async (resolve, reject) => {
      let jwtToken = user.jwtToken;
      if (!jwtToken) return reject(new Error("jwtToken not found"));

      let userPermissionResponse = await new RoleService().getPermission(jwtToken, isOwnerOrMember, action, roles, resource);

      if (!userPermissionResponse || !userPermissionResponse.data) return reject(new Error("permission not found"));

      let granted: boolean = userPermissionResponse.data.granted;

      if (granted == true) return resolve(userPermissionResponse.data);

      return resolve(null);
    });
  }
}