export abstract class IDBConnection {
  abstract saveUser(query: any): any;
  abstract findUser(query: any): any;
  abstract getUserDetails(query: any): any;
  abstract getUserDetailsByEmail(query: any): any;
  abstract getUsers(): any;
  abstract getUsersById(id: string): any;
  abstract getUsersByDeptId(ids: any): any;
  abstract getDepartmentByOrgId(ids: any): any;
  abstract checkForUserDepartment(uuid: string, departmentId: string): any;
  abstract changePassword(query: any): any;
  abstract resetPassword(user: any, newPassword: string): any;
  abstract validateUser(query: any): any;
  abstract validatePassword(user: any, oldPassword: string): any;
  abstract updateUserInfo(query: any): any;
  abstract getUserByEmailPassword(email: string, password: string): any;
  abstract getUserDepartmentByUUID(uuid: string): any;

  abstract createOrganization(query: any): any;
  abstract findOrganizationByUUID(uuid: string): any;
  abstract findOrganizationByID(id: string): any;
  abstract findOrganizationByName(name: string): any;
  abstract updateOrganizationByUUID(query: any): any;
  abstract getAllOrganization(page: number, page_size: number): any;
  abstract getAllOrganizationByType(type: string): any;

  abstract createDepartment(query: any): any;
  abstract findDepartmentByUUID(uuid: string): any;
  abstract findDepartmentByID(id: string): any;
  abstract findDepartmentByName(organization_id: string, name: string): any;
  abstract findDepartmentByIDs(id: any): any;
  abstract updateDepartmentByUUID(query: any): any;
  abstract getAllDepartment(): any;
  abstract getAllDepartmentByOrganizationId(
    ids: any,
    page: number,
    page_size: number
  ): any;
}
