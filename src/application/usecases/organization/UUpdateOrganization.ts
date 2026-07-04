import { UpdateOrganization } from "../../../domain/index";
import { IOrganizationRepository } from "../../repositories/IOrganizationRepository";

export class UUpdateOrganization {
  private organizationRepository: IOrganizationRepository;

  constructor(organizationRepository: IOrganizationRepository) {
    this.organizationRepository = organizationRepository;
  }

  execute(organization: UpdateOrganization) {
    // TODO validate all feils
    return this.organizationRepository.updateOrganizationByUUID(organization);
  }
}