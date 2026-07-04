import { UpdateDepartment } from "../../../domain/index";
import { IDepartmentRepository } from "../../repositories/IDepartmentRepository";

export class Update {
  private departmentRepository: IDepartmentRepository;

  constructor(departmentRepository: IDepartmentRepository) {
    this.departmentRepository = departmentRepository;
  }

  execute(department: UpdateDepartment) {
    // TODO validate all fields
    return this.departmentRepository.updateDepartmentByUUID(department);
  }
}