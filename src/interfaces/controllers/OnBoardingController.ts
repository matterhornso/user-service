import { Body, Controller, Hidden, Post, Request, Route, Security } from "tsoa"
import { DepartmentRepository } from '../database/DepartmentRepository'
import { OrganizationRepository } from "../database/OrganizationRepository"
import { UserRepository } from '../database/UserRepository'
import { Response } from '../response/Response'
import { OnBoarding } from "../utils/OnBoarding"
import { Util } from "../utils/Util"
import { mongoConnection } from './index'
import { IOnBoardingOrgType, IOnBoardingRoleName, ISuperAdminRequest } from "./RequestInterfaces"
@Hidden()
@Route('onboarding')
export class OnBoardingController extends Controller {
  public organizationRepository!: OrganizationRepository;
  public userRepository!: UserRepository;
  public departmentRepository!: DepartmentRepository;

  constructor() {
    super();
    this.userRepository = new UserRepository(mongoConnection);
    this.departmentRepository = new DepartmentRepository(mongoConnection);
    this.organizationRepository = new OrganizationRepository(mongoConnection);

  }
  @Post("create-super-admin")
  async createSuperAdmin(@Body() superAdminRequest: ISuperAdminRequest, @Request() request: any) {
    try {
      let onboarding_res = await new OnBoarding().createSuperAdmin(superAdminRequest.permission)
      return new Response().sendResponseSuccess(onboarding_res, true);
    } catch (Error: any) {
      this.setStatus(500);
      return new Response().sendResponseFailure(Error.message, false);
    }
  }
  @Security("jwt")
  @Post("onBoardingByOrgType")
  async onBoardingByOrgType(@Body() superAdminRequest: IOnBoardingOrgType, @Request() request: any) {
    try {
      let _user: any = await new Util().getUserInfo(request.user, this.userRepository);
      let onboarding_res = await new OnBoarding().onBoardingByOrgType(superAdminRequest, _user)
      return new Response().sendResponseSuccess(onboarding_res, true);
    } catch (Error: any) {
      this.setStatus(500);
      return new Response().sendResponseFailure(Error.message, false);
    }
  }
  @Security("jwt")
  @Post("onBoardingByRole")
  async onBoardingByRole(@Body() on_boarding: IOnBoardingRoleName, @Request() request: any) {
    try {
      let onboarding_res = await new OnBoarding().createPermissionByRoleName(on_boarding.permissions, on_boarding.role_name, on_boarding.departmentId)
      return new Response().sendResponseSuccess(onboarding_res, true);
    } catch (Error: any) {
      this.setStatus(500);
      return new Response().sendResponseFailure(Error.message, false);
    }
  }

}