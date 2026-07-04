import { CreateOrganization } from "../../../domain/index";
import { IOrganizationRepository } from "../../repositories/IOrganizationRepository";

export class UCreateOrganization {
  private organizationRepository: IOrganizationRepository;

  constructor(organizationRepository: IOrganizationRepository) {
    this.organizationRepository = organizationRepository;
  }

  execute(organization: CreateOrganization) {
    // TODO validate all fields
    return this.organizationRepository.createOrganization(organization);
  }
}