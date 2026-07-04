import { IUserRepository } from "../../repositories/IUserRepository";

export class GetUser {
  private userRepository: IUserRepository

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository
  }

  execute(id: string) {
    return this.userRepository.findUser(id)
  }
  getUserDetails(id: string) {
    return this.userRepository.getUserDetails(id)
  }

  getUserDetailsByEmail(email: string) {
    return this.userRepository.getUserDetailsByEmail(email)
  }

  getUserByEmailPassword(email: string, password: string) {
    return this.userRepository.getUserByEmailPassword(email, password);
  }

  getUserDepartmentByUUID(uuid: string) {
    return this.userRepository.getUserDepartmentByUUID(uuid);
  }
  getUsers() {
    return this.userRepository.getUsers();
  }
  getUsersById(id: string) {
    return this.userRepository.getUsersById(id);
  }
  checkForUserDepartment(uuid: string, departmentId: string) {
    return this.userRepository.checkForUserDepartment(uuid, departmentId);
  }
  validateUser(email: string, uuid: string) {
    return this.userRepository.validateUser(email, uuid);
  }
  getUsersByDeptId(ids: any) {
    return this.userRepository.getUsersByDeptId(ids);
  }
}