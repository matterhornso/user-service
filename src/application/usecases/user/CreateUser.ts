import { CreateUser as CreateUserEntity } from "../../../domain/index";
import { IUserRepository } from "../../repositories/IUserRepository";
import { IDepartmentRepository } from "../../repositories/IDepartmentRepository";

export class CreateUser {
  private userRepository: IUserRepository;
  private departmentRepository: IDepartmentRepository;

  constructor(userRepository: IUserRepository, departmentRepository: IDepartmentRepository) {
    this.userRepository = userRepository;
    this.departmentRepository = departmentRepository;
  }

  async execute(user: CreateUserEntity) {
    // TODO uuid must be unique

    // TODO departmentId must be valid

    // TODO creator must be valid and have permission to create user

    // TODO check password strength min requirements

    // TODO check if shineKey is valid shine public key

    // TODO check if shineName is valid shine name and unique

    let _department: any = await this.departmentRepository.findDepartmentByID(user.departmentId);
    user.department_shine_name = _department.shine_name;
    return this.userRepository.createUser(user);
  }
}