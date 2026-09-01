import {
  Controller,
  Get,
  Route,
  Example,
  Post,
  Body,
  Security,
  Query,
  Request,
} from "tsoa";

import { Department } from "../../domain/index";
import { Create as CreateDepartment } from "../../application/usecases/department/CreateDepartment";
import { Update as UpdateDepartment } from "../../application/usecases/department/UpdateDepartment";
import { Get as GetDepartment } from "../../application/usecases/department/GetDepartment";
import { UGetOrganization } from "../../application/usecases/organization/UGetOrganization";

import { DepartmentRepository } from "../database/DepartmentRepository";
import { OrganizationRepository } from "../database/OrganizationRepository";
import { UserRepository } from "../database/UserRepository";
import {
  ICreateDepartmentRequest,
  IUpdateDepartmentRequest,
  IBlockchainAdminPermRequest,
  IDepartmentIDRequest,
} from "./RequestInterfaces";
import { Response } from "../response/Response";

import { BCService } from "../services/Blockchain.service";

import { mongoConnection, ActivityType } from "./index";
import { Util } from "../utils/Util";
import { GetUser } from "../../application/usecases/user/GetUser";

@Route("department")
export class DepartmentController extends Controller {
  private departmentResource: string = "department";
  private blockchainPermissionResource: string = "blockchainPermission";

  public organizationRepository!: OrganizationRepository;
  public departmentRepository!: DepartmentRepository;
  public userRepository!: UserRepository;

  constructor() {
    super();
    this.organizationRepository = new OrganizationRepository(mongoConnection);
    this.departmentRepository = new DepartmentRepository(mongoConnection);
    this.userRepository = new UserRepository(mongoConnection);
  }

  // if user organization is same as for which he is creating department,
  //  isOwnerOrMember = true, else false.

  /**
   * Create new department
   * @param req department creation request
   */
  @Example({
    success: true,
    error: [],
    data: {},
  })
  @Security("jwt")
  @Post("createDepartment")
  async createDepartment(
    @Body() department: ICreateDepartmentRequest,
    @Request() request: any
  ) {
    try {
      if (!department.name) {
        this.setStatus(400);
        return new Response().sendResponseFailure("name missing", false);
      }

      if (!department.about) {
        this.setStatus(400);
        return new Response().sendResponseFailure("about missing", false);
      }

      if (!department.organization_id) {
        this.setStatus(400);
        return new Response().sendResponseFailure(
          "organization_id missing",
          false
        );
      }

      let _department: any = await new Util().getDepartmentInfo(
        request.user,
        this.userRepository,
        this.departmentRepository
      );
      if (!_department || !_department.organization_id)
        return new Response().sendResponseFailure(
          "error _department.organization_id",
          false
        );

      let _user: any = await new Util().getUserInfo(
        request.user,
        this.userRepository
      );
      let user_shine_name = _user.shineName;
      let user_public_key = _user.shineKey;

      let isOwnerOrMember: boolean = true;
      let action: string = ActivityType.CREATE;
      let resource: string =
        department.organization_id.toString() + ":" + this.departmentResource;

      if (
        _department.organization_id.toString() != department.organization_id
      ) {
        resource = "department";
        isOwnerOrMember = false;
      }

      let hasPermission: boolean = await new Util().hasPermission(
        request.user,
        isOwnerOrMember,
        action,
        _department.roles,
        resource,
        this.userRepository,
        this.departmentRepository
      );
      if (hasPermission != true) {
        this.setStatus(400);
        return new Response().sendResponseFailure("User Not Authorized", false);
      }

      const createDepartment = new CreateDepartment(
        this.departmentRepository,
        this.organizationRepository
      );
      let result = await new Department().create(
        { ...department, user_shine_name, user_public_key },
        createDepartment
      );
      return new Response().sendResponseSuccess(result, true);
    } catch (Error: any) {
      this.setStatus(500);
      return new Response().sendResponseFailure(Error.message, false);
    }
  }

  /**
   * findDepartmentByUUID
   * @param uuid
   */
  @Example({
    success: true,
    error: [],
    data: {},
  })
  @Security("jwt")
  @Get("findDepartmentByUUID")
  async findDepartmentByUUID(@Query() uuid: string, @Request() request: any) {
    try {
      if (!uuid) {
        this.setStatus(400);
        return new Response().sendResponseFailure("uuid missing", false);
      }
      let _department: any = await new Util().getDepartmentInfo(
        request.user,
        this.userRepository,
        this.departmentRepository
      );
      let action: string = ActivityType.READ;
      let isOwnerOrMember: boolean = _department.uuid === uuid ? true : false;
      let resource: string =
        _department.organization_id.toString() + ":" + this.departmentResource;
      let hasPermission: boolean = await new Util().hasPermission(
        request.user,
        isOwnerOrMember,
        action,
        _department.roles,
        resource,
        this.userRepository,
        this.departmentRepository
      );
      if (hasPermission != true) {
        this.setStatus(400);
        return new Response().sendResponseFailure("User Not Authorized", false);
      }

      const getDepartment = new GetDepartment(this.departmentRepository);
      let result = await getDepartment.findDepartmentByUUID(uuid);
      return new Response().sendResponseSuccess(result, true);
    } catch (error: any) {
      return new Response().sendResponseSuccess(error.message, false);
    }
  }

  /**
   * findDepartmentByID
   * @param id
   */
  @Example({
    success: true,
    error: [],
    data: {},
  })
  @Security("jwt")
  @Get("findDepartmentByID")
  async findDepartmentByID(@Query() id: string, @Request() request: any) {
    try {
      if (!id) {
        this.setStatus(400);
        return new Response().sendResponseFailure("id missing", false);
      }

      let _department: any = await new Util().getDepartmentInfo(
        request.user,
        this.userRepository,
        this.departmentRepository
      );
      let isOwnerOrMember: boolean = true;
      let action: string = ActivityType.READ;
      let resource: string =
        _department._id.toString() + ":" + this.departmentResource;
      if (_department._id.toString() !== id) {
        resource = "department";
        isOwnerOrMember = false;
      }
      let hasPermission: boolean = await new Util().hasPermission(
        request.user,
        isOwnerOrMember,
        action,
        _department.roles,
        resource,
        this.userRepository,
        this.departmentRepository
      );

      if (hasPermission != true) {
        this.setStatus(400);
        return new Response().sendResponseFailure("User Not Authorized", false);
      }
      const getDepartment = new GetDepartment(this.departmentRepository);
      let result = await getDepartment.findDepartmentByID(
        _department._id.toString()
      );
      return new Response().sendResponseSuccess(result, true);
    } catch (error: any) {
      return new Response().sendResponseSuccess(error.message, false);
    }
  }

  @Security("jwt")
  @Get("findDepartmentByName")
  async findDepartmentByName(@Query() organization_id: string, @Query() name: string, @Request() request: any) {
    try {
      if (!name && !organization_id) {
        this.setStatus(400);
        return new Response().sendResponseFailure("id or name missing", false);
      }
      const getDepartment = new GetDepartment(this.departmentRepository);
      let result = await getDepartment.findDepartmentByName(
        organization_id, name
      );
      return new Response().sendResponseSuccess(result, true);
    } catch (error: any) {
      return new Response().sendResponseSuccess(error.message, false);
    }
  }

  /**
   * findDepartmentById
   * @param id
   */
  @Example({
    success: true,
    error: [],
    data: {},
  })
  @Security("jwt")
  @Get("findDepartment")
  async findDepartment(@Query() id: string, @Request() request: any) {
    try {
      console.log("id", id);
      if (!id) {
        this.setStatus(400);
        return new Response().sendResponseFailure("id missing", false);
      }
      const getDepartment = new GetDepartment(this.departmentRepository);
      let result = await getDepartment.findDepartmentByID(id.toString());
      return new Response().sendResponseSuccess(result, true);
    } catch (error: any) {
      return new Response().sendResponseSuccess(error.message, false);
    }
  }

  /**
   * findDepartmentByIDs
   */
  @Example({
    success: true,
    error: [],
    data: {},
  })
  @Post("findDepartmentByIDs")
  async findDepartmentByIDs(
    @Body() ids: IDepartmentIDRequest,
    @Request() request: any
  ) {
    try {
      if (!ids) {
        this.setStatus(400);
        return new Response().sendResponseFailure("ids missing", false);
      }
      const getDepartment = new GetDepartment(this.departmentRepository);
      let result = await getDepartment.findDepartmentByIDs(ids);
      return new Response().sendResponseSuccess(result, true);
    } catch (error: any) {
      return new Response().sendResponseSuccess(error.message, false);
    }
  }
  /**
   * updateDepartmentByUUID
   * @param department
   */
  @Example({
    success: true,
    error: [],
    data: {},
  })
  @Security("jwt")
  @Post("updateDepartmentByUUID")
  async updateDepartmentByUUID(
    @Body() department: IUpdateDepartmentRequest,
    @Request() request: any
  ) {
    try {
      if (!department.uuid) {
        this.setStatus(400);
        return new Response().sendResponseFailure(
          "department id is missing!",
          false
        );
      }

      let _department: any = await new Util().getDepartmentInfo(
        request.user,
        this.userRepository,
        this.departmentRepository
      );
      let action: string = ActivityType.UPDATE;
      let isOwnerOrMember: boolean = true;

      let resource: string =
        _department.organization_id.toString() + ":" + this.departmentResource;
      if (_department.uuid != department.uuid) {
        resource = "department";
        isOwnerOrMember = false;
      }

      let hasPermission: boolean = await new Util().hasPermission(
        request.user,
        isOwnerOrMember,
        action,
        _department.roles,
        resource,
        this.userRepository,
        this.departmentRepository
      );
      if (hasPermission != true) {
        this.setStatus(400);
        return new Response().sendResponseFailure("User Not Authorized", false);
      }

      const updateDepartment = new UpdateDepartment(this.departmentRepository);
      let result = await new Department().updateDepartmentByUUID(
        department,
        updateDepartment
      );
      return new Response().sendResponseSuccess(result, true);
    } catch (Error: any) {
      this.setStatus(500);
      return new Response().sendResponseFailure(Error.message, false);
    }
  }

  /**
   * getAllDepartment
   */
  @Example({
    success: true,
    error: [],
    data: {
      success: true,
      error: [],
      data: {},
    },
  })
  @Security("jwt")
  @Get("getAllDepartment")
  async getAllDepartment(@Request() request: any) {
    try {
      const getOrganization = new UGetOrganization(this.organizationRepository);
      const getUser = new GetUser(this.userRepository);
      let _department: any = await new Util().getDepartmentInfo(request.user, this.userRepository, this.departmentRepository);
      let action: string = ActivityType.READ;
      let isOwnerOrMember: boolean = false;
      let resource: string = this.departmentResource;
      let _user: any = await new Util().getUserInfo(request.user, this.userRepository);
      let org_res = await getOrganization.findOrganizationByID(
        _department.organization_id
      );
      if (org_res.type !== 'admin') {
        return new Response().sendResponseFailure("User Not Authorized", false);
      }
      const getDepartment = new GetDepartment(this.departmentRepository);
      let result = await getDepartment.getAllDepartment();
      return new Response().sendResponseSuccess(result, true);
    } catch (error: any) {
      return new Response().sendResponseSuccess(error.message, false);
    }
  }

  /**
   * getAllDepartmentByOrganizationType
   * @param type
   * */
  @Example({
    success: true,
    error: [],
    data: {
      success: true,
      error: [],
      data: {},
    },
  })
  @Security("jwt")
  @Get("getAllDepartmentByOrganizationType")
  async getAllDepartmentByOrganizationType(
    @Query() type: string,
    @Request() request: any,
    @Query() page?: number,
    @Query() page_size?: number
  ) {
    try {
      let _department: any = await new Util().getDepartmentInfo(
        request.user,
        this.userRepository,
        this.departmentRepository
      );
      let action: string = ActivityType.READ;
      let isOwnerOrMember: boolean = false;
      let resource: string = this.departmentResource;

      let hasPermission: boolean = await new Util().hasPermission(
        request.user,
        isOwnerOrMember,
        action,
        _department.roles,
        resource,
        this.userRepository,
        this.departmentRepository
      );

      if (hasPermission != true) {
        this.setStatus(400);
        return new Response().sendResponseFailure("User Not Authorized", false);
      }
      const getOrganization = new UGetOrganization(this.organizationRepository);
      let result1 = await getOrganization.getAllOrganizationByType(type);

      if (result1.length > 0) {
        let ids = [];
        for (let i = 0; i < result1.length; i++) {
          ids.push(result1[i]._id);
        }
        const getDepartment = new GetDepartment(this.departmentRepository);
        let result = await getDepartment.getAllDepartmentByOrganizationId(
          ids,
          page,
          page_size
        );
        return new Response().sendResponseSuccess(result, true);
      } else {
        return new Response().sendResponseFailure(
          "organization not found",
          false
        );
      }
    } catch (error: any) {
      return new Response().sendResponseFailure(error.message, false);
    }
  }

  /**
   * getUsersByOrgType
   *  @param type
   */

  @Get("getUsersByOrgType")
  async getUsersByOrgType(@Query() type: string, @Request() request: any) {
    try {
      const getOrganization = new UGetOrganization(this.organizationRepository);
      let result1 = await getOrganization.getAllOrganizationByType(type);

      if (result1.length > 0) {
        let ids = [];
        for (let i = 0; i < result1.length; i++) {
          ids.push(result1[i]._id);
        }
        const getDepartment = new GetDepartment(this.departmentRepository);
        let result2 = await getDepartment.getAllDepartmentByOrganizationId(ids);
        //console.log('result2', result2)
        if (result2.length > 0) {
          let deptIds = [];
          for (let i = 0; i < result2.length; i++) {
            deptIds.push(result2[i]._id);
          }
          let result3 = await new GetUser(this.userRepository).getUsersByDeptId(
            deptIds
          );
          return new Response().sendResponseSuccess(result3, true);
        }
      } else {
        return new Response().sendResponseFailure(
          "organization not found",
          false
        );
      }
    } catch (error: any) {
      return new Response().sendResponseFailure(error.message, false);
    }
  }
  /**
   * addBlockchainAdminPermissions
   * @param department_shine_name
   * */
  @Example({
    success: true,
    error: [],
    data: {
      success: true,
      error: [],
      data: {},
    },
  })
  @Security("jwt")
  @Post("addBlockchainAdminPermissions")
  async addBlockchainAdminPermissions(
    @Body() dept: IBlockchainAdminPermRequest,
    @Request() request: any
  ) {
    try {
      let _department: any = await new Util().getDepartmentInfo(
        request.user,
        this.userRepository,
        this.departmentRepository
      );
      let action: string = ActivityType.CREATE;
      let isOwnerOrMember: boolean = false;
      let resource: string = this.blockchainPermissionResource;

      let hasPermission: boolean = await new Util().hasPermission(
        request.user,
        isOwnerOrMember,
        action,
        _department.roles,
        resource,
        this.userRepository,
        this.departmentRepository
      );

      if (hasPermission != true) {
        this.setStatus(400);
        return new Response().sendResponseFailure("User Not Authorized", false);
      }

      let bcService = new BCService();
      let transaction_id = await bcService.addBlockchainAdminPermissions(
        dept.department_shine_name
      );

      if (!transaction_id)
        return new Response().sendResponseFailure(
          "An error occurred while sending tx to blockchain!",
          false
        );

      return new Response().sendResponseSuccess(transaction_id, true);
    } catch (error: any) {
      return new Response().sendResponseFailure(error.message, false);
    }
  }

  /**
   * getUsersByOrgType
   *  @param id
   */

  // No @Security("jwt") — this is called mid-login by auth-service's
  // LoginController (before any JWT exists) to resolve the org type for the
  // OTP response. Gating it on jwt makes /auth/login unconditionally fail.
  @Get("getOrgByDepartmentId")
  async getOrgByDepartmentId(@Query() id: string, @Request() request: any) {
    try {
      const getOrganization = new UGetOrganization(this.organizationRepository);
      const getDepartment = new GetDepartment(this.departmentRepository);
      let dept_res = await getDepartment.findDepartmentByID(id);
      let org_res = await getOrganization.findOrganizationByID(
        dept_res.organization_id
      );
      return new Response().sendResponseSuccess(org_res, true);
    } catch (error: any) {
      return new Response().sendResponseFailure(error.message, false);
    }
  }

  /**
   * getDepartmentByOrgId
   *  @param id
   */

  @Security("jwt")
  @Get("getDepartmentByOrgId")
  async getDepartmentByOrgId(@Query() id: string, @Request() request: any) {
    try {
      const getDepartment = new GetDepartment(this.departmentRepository);
      let dept_res = await getDepartment.getDepartmentByOrgId(id);
      return new Response().sendResponseSuccess(dept_res, true);
    } catch (error: any) {
      return new Response().sendResponseFailure(error.message, false);
    }
  }
}
