import { IDepartmentRepository } from "../../repositories/IDepartmentRepository";

export class Get {
  private departmentRepository: IDepartmentRepository;

  constructor(departmentRepository: IDepartmentRepository) {
    this.departmentRepository = departmentRepository;
  }

  findDepartmentByUUID(uuid: string) {
    return this.departmentRepository.findDepartmentByUUID(uuid);
  }

  findDepartmentByName(organization_id: string, name: string) {
    return this.departmentRepository.findDepartmentByName(organization_id, name);
  }

  findDepartmentByID(id: string) {
    return this.departmentRepository.findDepartmentByID(id);
  }
  getDepartmentByOrgId(id: string) {
    return this.departmentRepository.getDepartmentByOrgId(id);
  }
  findDepartmentByIDs(id: any) {
    return this.departmentRepository.findDepartmentByIDs(id);
  }
  getAllDepartment() {
    return this.departmentRepository.getAllDepartment();
  }
  getAllDepartmentByOrganizationId(
    ids: any,
    page?: number,
    page_size?: number
  ) {
    return this.departmentRepository.getAllDepartmentByOrganizationId(
      ids,
      page,
      page_size
    );
  }
}
