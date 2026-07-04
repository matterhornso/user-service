import { Request, Controller, Get, Route, Example, Post, Body, Query, Security, Header } from "tsoa"

import { AccessControl } from "accesscontrol"

import { Organization } from '../../domain/index'
import { UCreateOrganization } from '../../application/usecases/organization/UCreateOrganization'
import { UUpdateOrganization } from '../../application/usecases/organization/UUpdateOrganization'
import { UGetOrganization } from '../../application/usecases/organization/UGetOrganization'
import { OrganizationRepository } from '../database/OrganizationRepository'
import { DepartmentRepository } from '../database/DepartmentRepository'
import { UserRepository } from '../database/UserRepository'
import { Response } from '../response/Response'

import { mongoConnection, ActivityType } from './index'
import { ICreateOrganizationRequest, IUpdateOrganizationRequest } from "./RequestInterfaces"

import { Util } from "../utils/Util"

@Route('organization')
export class OrganizationController extends Controller {
  public organizationRepository!: OrganizationRepository;
  public departmentRepository!: DepartmentRepository;
  public userRepository!: UserRepository;
  public ac: AccessControl;

  private organizationResource: string = "organization";

  constructor() {
    super();
    this.organizationRepository = new OrganizationRepository(mongoConnection);
    this.departmentRepository = new DepartmentRepository(mongoConnection);
    this.userRepository = new UserRepository(mongoConnection);
    this.ac = new AccessControl();
  }

  /**
   * Create new organization
   * @param organization organization creation request
   */
  @Example({
    "success": true,
    "error": [],
    "data": {
      "success": true,
      "error": [],
      "data": {
        "active": true,
        "_id": "5f6e0d656cb9dc3e53ff3b99",
        "uuid": "11f37872-6e17-4e06-8e9c-0f747c18a998",
        "name": "nse",
        "about": "stock",
        "createdAt": "2020-09-25T15:31:49.780Z",
        "updatedAt": "2020-09-25T15:31:49.780Z",
        "__v": 0
      }
    }
  })
  @Security("jwt")
  @Post("createOrganization")
  async createOrganization(@Body() organization: ICreateOrganizationRequest, @Request() request: any) {
    try {
      if (!organization.name) {
        this.setStatus(400);
        return new Response().sendResponseFailure("name missing", false);
      }

      if (!organization.type) {
        this.setStatus(400);
        return new Response().sendResponseFailure("type missing", false);
      }

      if (!organization.about) {
        this.setStatus(400);
        return new Response().sendResponseFailure("about missing", false);
      }


      let _department: any = await new Util().getDepartmentInfo(request.user, this.userRepository, this.departmentRepository);

      let _user: any = await new Util().getUserInfo(request.user, this.userRepository);

      let user_shine_name = _user?.shineName;
      let user_public_key = _user?.shineKey;

      // TODO maybe populate _user.departmentId.roles this too, this will reduce DB calls

      let action: string = ActivityType.CREATE;
      let isOwnerOrMember: boolean = false;
      let resource: string = this.organizationResource;

      let hasPermission: boolean = await new Util().hasPermission(request.user, isOwnerOrMember, action, _department.roles, resource, this.userRepository, this.departmentRepository);

      if (hasPermission != true) {
        this.setStatus(400);
        return new Response().sendResponseFailure("User Not Authorized", false);
      }

      const uCreateOrganization = new UCreateOrganization(this.organizationRepository);
      let result = await new Organization().create({ ...organization, user_shine_name, user_public_key }, uCreateOrganization);
      return new Response().sendResponseSuccess(result, true);
    } catch (Error: any) {
      this.setStatus(500);
      return new Response().sendResponseFailure(Error.message, false);
    }
  }

  /**
   * findOrganizationByUUID
   * @param uuid
   */
  @Example({
    "success": true,
    "error": [],
    "data": {
      "success": true,
      "error": [],
      "data": {
        "active": true,
        "_id": "5f6e0d656cb9dc3e53ff3b99",
        "uuid": "11f37872-6e17-4e06-8e9c-0f747c18a998",
        "name": "nse",
        "about": "stock",
        "createdAt": "2020-09-25T15:31:49.780Z",
        "updatedAt": "2020-09-25T15:31:49.780Z",
        "__v": 0
      }
    }
  })
  @Security("jwt")
  @Get('findOrganizationByUUID')
  async findOrganizationByUUID(@Query() uuid: string, @Request() request: any) {
    try {
      if (!uuid) {
        this.setStatus(400);
        return new Response().sendResponseFailure("uuid missing", false);
      }

      let _department: any = await new Util().getDepartmentInfo(request.user, this.userRepository, this.departmentRepository);

      let action: string = ActivityType.READ;
      let isOwnerOrMember: boolean = false; // TODO get organization uuid
      let resource: string = this.organizationResource;

      let _permission: any = await new Util().getPermission(request.user, isOwnerOrMember, action, _department.roles, resource, this.userRepository, this.departmentRepository);

      if (!_permission) return new Response().sendResponseFailure("Error! Permission not found", false);

      if (_permission.granted != true) {
        this.setStatus(400);
        return new Response().sendResponseFailure("User Not Authorized", false);
      }

      const uGetOrganization = new UGetOrganization(this.organizationRepository)
      let result = await uGetOrganization.findOrganizationByUUID(uuid);
      result = AccessControl.filter(JSON.parse(JSON.stringify(result)), _permission.attributes);
      return new Response().sendResponseSuccess(result, true);
    } catch (error: any) {
      return new Response().sendResponseSuccess(error.message, false)
    }
  }

  /**
   * findOrganizationByID
   * @param id
   */
  @Example({
    "success": true,
    "error": [],
    "data": {
      "success": true,
      "error": [],
      "data": {
        "active": true,
        "_id": "5f6e0d656cb9dc3e53ff3b99",
        "uuid": "11f37872-6e17-4e06-8e9c-0f747c18a998",
        "name": "nse",
        "about": "stock",
        "createdAt": "2020-09-25T15:31:49.780Z",
        "updatedAt": "2020-09-25T15:31:49.780Z",
        "__v": 0
      }
    }
  })
  @Security("jwt")
  @Get('findOrganizationByID')
  async findOrganizationByID(@Query() id: string, @Request() request: any) {
    try {
      if (!id) {
        this.setStatus(400);
        return new Response().sendResponseFailure("id missing", false);
      }

      let _department: any = await new Util().getDepartmentInfo(request.user, this.userRepository, this.departmentRepository);

      let action: string = ActivityType.READ;
      let isOwnerOrMember: boolean = (_department.organization_id === id) ? true : false;
      let resource: string = this.organizationResource;

      let hasPermission: boolean = await new Util().hasPermission(request.user, isOwnerOrMember, action, _department.roles, resource, this.userRepository, this.departmentRepository);

      if (hasPermission != true) {
        this.setStatus(400);
        return new Response().sendResponseFailure("User Not Authorized", false);
      }

      const uGetOrganization = new UGetOrganization(this.organizationRepository)
      let result = await uGetOrganization.findOrganizationByID(id);
      return new Response().sendResponseSuccess(result, true);
    } catch (error: any) {
      return new Response().sendResponseSuccess(error.message, false)
    }
  }

  @Example({
    "success": true,
    "error": [],
    "data": {
      "success": true,
      "error": [],
      "data": {
        "active": true,
        "_id": "5f6e0d656cb9dc3e53ff3b99",
        "uuid": "11f37872-6e17-4e06-8e9c-0f747c18a998",
        "name": "nse",
        "about": "stock",
        "createdAt": "2020-09-25T15:31:49.780Z",
        "updatedAt": "2020-09-25T15:31:49.780Z",
        "__v": 0
      }
    }
  })
  @Security("jwt")
  @Get('findOrganizationByName')
  async findOrganizationByName(@Query() name: string, @Request() request: any) {
    try {
      if (!name) {
        this.setStatus(400);
        return new Response().sendResponseFailure("id missing", false);
      }

      let _department: any = await new Util().getDepartmentInfo(request.user, this.userRepository, this.departmentRepository);

      let action: string = ActivityType.READ;
      let isOwnerOrMember: boolean = false;
      let resource: string = this.organizationResource;

      let hasPermission: boolean = await new Util().hasPermission(request.user, isOwnerOrMember, action, _department.roles, resource, this.userRepository, this.departmentRepository);

      if (hasPermission != true) {
        this.setStatus(400);
        return new Response().sendResponseFailure("User Not Authorized", false);
      }

      const uGetOrganization = new UGetOrganization(this.organizationRepository)
      let result = await uGetOrganization.findOrganizationByName(name);
      return new Response().sendResponseSuccess(result, true);
    } catch (error: any) {
      return new Response().sendResponseSuccess(error.message, false)
    }
  }

  /**
  * updateOrganizationByUUID
  * @param organization
  */
  @Example({
    "success": true,
    "error": [],
    "data": {
      "success": true,
      "error": [],
      "data": {
        "active": true,
        "_id": "5f6e0d656cb9dc3e53ff3b99",
        "uuid": "11f37872-6e17-4e06-8e9c-0f747c18a998",
        "name": "nse",
        "about": "stock",
        "createdAt": "2020-09-25T15:31:49.780Z",
        "updatedAt": "2020-09-25T15:31:49.780Z",
        "__v": 0
      }
    }
  })
  @Security("jwt")
  @Post('updateOrganizationByUUID')
  async updateOrganizationByUUID(@Body() organization: IUpdateOrganizationRequest, @Request() request: any) {
    try {
      // let isOwnerOrMember: boolean = false;
      // let action: string = ActivityType.UPDATE;

      // let hasPermission: boolean = await new Util().hasPermission(request.user, isOwnerOrMember, action, this.organizationResource, this.userRepository, this.departmentRepository);

      // if (hasPermission != true) {
      //   this.setStatus(400);
      //   return new Response().sendResponseFailure("User Not Authorized", false);
      // }

      if (!organization.uuid) {
        this.setStatus(400);
        return new Response().sendResponseFailure("organization id is missing!", false);
      }

      let _department: any = await new Util().getDepartmentInfo(request.user, this.userRepository, this.departmentRepository);

      let action: string = ActivityType.READ;
      let isOwnerOrMember: boolean = false; // TODO get organization uuid
      let resource: string = this.organizationResource;

      let hasPermission: boolean = await new Util().hasPermission(request.user, isOwnerOrMember, action, _department.roles, resource, this.userRepository, this.departmentRepository);

      if (hasPermission != true) {
        this.setStatus(400);
        return new Response().sendResponseFailure("User Not Authorized", false);
      }

      const uUpdateOrganization = new UUpdateOrganization(this.organizationRepository)
      let result = await new Organization().updateOrganizationByUUID(organization, uUpdateOrganization);
      return new Response().sendResponseSuccess(result, true);
    } catch (Error: any) {
      this.setStatus(500);
      return new Response().sendResponseFailure(Error.message, false);
    }
  }


  /**
  * getAllOrganization
  */
  @Security("jwt")
  @Get('getAllOrganization')
  async getAllOrganization(@Request() request: any, @Query() page?: number, @Query() page_size?: number) {
    try {
      let _department: any = await new Util().getDepartmentInfo(request.user, this.userRepository, this.departmentRepository);
      let action: string = ActivityType.READ;
      let isOwnerOrMember: boolean = false;
      let resource: string = this.organizationResource;
      console.log("resource", resource)
      let hasPermission: boolean = await new Util().hasPermission(request.user, isOwnerOrMember, action, _department.roles, resource, this.userRepository, this.departmentRepository);

      if (hasPermission != true) {
        this.setStatus(400);
        return new Response().sendResponseFailure("User Not Authorized", false);
      }
      const uGetOrganization = new UGetOrganization(this.organizationRepository)
      let result = await uGetOrganization.getAllOrganization(page, page_size);
      return new Response().sendResponseSuccess(result, true);
    } catch (error: any) {
      return new Response().sendResponseSuccess(error.message, false)
    }
  }


}