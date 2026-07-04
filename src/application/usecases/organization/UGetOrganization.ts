import { IOrganizationRepository } from "../../repositories/IOrganizationRepository";

export class UGetOrganization {
  private organizationRepository: IOrganizationRepository;

  constructor(organizationRepository: IOrganizationRepository) {
    this.organizationRepository = organizationRepository;
  }

  findOrganizationByUUID(uuid: string) {
    return this.organizationRepository.findOrganizationByUUID(uuid);
  }

  findOrganizationByID(id: string) {
    return this.organizationRepository.findOrganizationByID(id);
  }

  findOrganizationByName(name: string) {
    return this.organizationRepository.findOrganizationByName(name);
  }

  getAllOrganization(page?: number, page_size?: number) {
    return this.organizationRepository.getAllOrganization(page, page_size);
  }
  getAllOrganizationByType(type: string) {
    return this.organizationRepository.getAllOrganizationByType(type);
  }
}