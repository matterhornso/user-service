import { CreateDepartment } from "../../../domain/index";
import { IDepartmentRepository } from "../../repositories/IDepartmentRepository";
import { IOrganizationRepository } from "../../repositories/IOrganizationRepository";

export class Create {
  private departmentRepository: IDepartmentRepository;
  private organizationRepository: IOrganizationRepository;

  constructor(departmentRepository: IDepartmentRepository, organizationRepository: IOrganizationRepository) {
    this.departmentRepository = departmentRepository;
    this.organizationRepository = organizationRepository;
  }

  async execute(department: CreateDepartment) {
    // fetch the organization details
    let _organization: any = await this.organizationRepository.findOrganizationByID(department.organization_id);
    department.organization_shine_name = _organization.shine_name;
    return this.departmentRepository.createDepartment(department);
  }
}