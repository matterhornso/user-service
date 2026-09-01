import { Body, Controller, Example, Get, Post, Query, Request, Route, Security } from "tsoa"
import { UGetOrganization } from '../../application/usecases/organization/UGetOrganization'
import { ChangeUserPassword } from '../../application/usecases/user/ChangeUserPassword'
import { CreateUser } from '../../application/usecases/user/CreateUser'
import { GetUser } from '../../application/usecases/user/GetUser'
import { UpdateUserInfo } from '../../application/usecases/user/UpdateUser'
import { User } from '../../domain/index'
import { DepartmentRepository } from '../database/DepartmentRepository'
import { OrganizationRepository } from "../database/OrganizationRepository"
import { UserRepository } from '../database/UserRepository'
import { Response } from '../response/Response'
import { AuthService } from '../services/Auth.service'
import { NotificationService } from '../services/Notification.service'
import { Util } from "../utils/Util"
import { ActivityType, mongoConnection } from './index'
import { IChangePasswordRequest, ICreateUserRequest, IForgotPasswordRequest, IResetPasswordRequest, IUpdateUserRequest } from './RequestInterfaces'



@Route('users')
export class UserController extends Controller {
  private userResource: string = "user";
  public organizationRepository!: OrganizationRepository;
  public userRepository!: UserRepository;
  public departmentRepository!: DepartmentRepository;

  constructor() {
    super();
    this.userRepository = new UserRepository(mongoConnection);
    this.departmentRepository = new DepartmentRepository(mongoConnection);
    this.organizationRepository = new OrganizationRepository(mongoConnection);
  }

  /**
   * Create a user
   * @param user This is a user creation request description
   */
  @Example({
    "success": true,
    "error": [],
    "data": {
      "dateOfEntry": "2020-06-03T21:34:55.995Z",
      "lastUpdated": "2020-06-03T21:34:55.995Z",
      "_id": "5ed8182161002641da343d0a",
      "fullName": "sangram singh",
      "email": "sangram56@gmail.com",
      "departmentId": "5f62dd2bbf46fa2f691d0337",
      "creator": "5f62dd2bbf46fa2f691d031a",
      "uuid": "5a69cc6e-5573-4610-99db-ec6e811a45ab",
      "__v": 0
    }
  })
  @Security("jwt")
  @Post("createUser")
  async createUser(@Body() user: ICreateUserRequest, @Request() request: any) {
    try {
      if (!user.fullName) {
        this.setStatus(400);
        return new Response().sendResponseFailure("no fullName found", false);
      }
      if (!user.email) {
        this.setStatus(400);
        return new Response().sendResponseFailure("no email found", false);
      }
      if (!user.departmentId) {
        this.setStatus(400);
        return new Response().sendResponseFailure("no departmentId found", false);
      }
      if (!user.password) {
        this.setStatus(400);
        return new Response().sendResponseFailure("no password found", false);
      }
      if (!user.shineName) {
        this.setStatus(400);
        return new Response().sendResponseFailure("no shineName found", false);
      }
      if (!user.shineKey) {
        this.setStatus(400);
        return new Response().sendResponseFailure("no shineKey found", false);
      }

      let _user: any = await new Util().getUserInfo(request.user, this.userRepository);
      let user_shine_name = _user.shineName;
      let user_public_key = _user.shineKey;

      let _department: any = await new Util().getDepartmentInfo(request.user, this.userRepository, this.departmentRepository);

      let action: string = ActivityType.CREATE;

      let isOwnerOrMember: boolean = true;
      let resource: string = user.departmentId + ":" + this.userResource;

      if (_department.id.toString() != user.departmentId) {
        resource = "user";
        isOwnerOrMember = false;
      }

      let hasPermission: boolean = await new Util().hasPermission(request.user, isOwnerOrMember, action, _department.roles, resource, this.userRepository, this.departmentRepository);
      if (hasPermission != true) {
        this.setStatus(400);
        return new Response().sendResponseFailure("User Not Authorized", false);
      }

      const getOrganization = new UGetOrganization(this.organizationRepository);
      let org_res = await getOrganization.findOrganizationByID(
        _department.organization_id
      );
      if (org_res.type !== 'admin') {
        return new Response().sendResponseFailure("User Not Authorized", false);
      }
      const createUser = new CreateUser(this.userRepository, this.departmentRepository);
      let result = await new User().create({ ...user, user_shine_name, user_public_key }, createUser);
      return new Response().sendResponseSuccess(result, true);
    } catch (Error: any) {
      this.setStatus(500);
      return new Response().sendResponseFailure(Error.message, false);
    }
  }

  /**
   * Retrieves the details of an existing user.
   * Supply the unique user ID (UUID) from either and receive corresponding user details.
   * @param uuid The user's identifier
   */
  @Example({
    "success": true,
    "error": [],
    "data": {
      "dateOfEntry": "2020-06-03T21:34:55.995Z",
      "lastUpdated": "2020-06-03T21:34:55.995Z",
      "_id": "5ed8182161002641da343d0a",
      "fullName": "sangram",
      "email": "sangram56@gmail.com",
      "departmentId": "1",
      "creator": "sam",
      "uuid": "5a69cc6e-5573-4610-99db-ec6e811a45ab",
      "__v": 0
    }
  })
  @Security("jwt")
  @Get('user/{uuid}')
  async findUser(uuid: string, @Request() request: any) {
    try {
      const getUser = new GetUser(this.userRepository);
      let _department: any = await new Util().getDepartmentInfo(request.user, this.userRepository, this.departmentRepository);
      let validateUserForOwnPermission = await getUser.checkForUserDepartment(uuid, _department._id)
      if (validateUserForOwnPermission) {
        let result = await getUser.execute(uuid);
        if (result) {
          let response = await new UGetOrganization(this.organizationRepository).findOrganizationByID(result.departmentId.organization_id)
          let type = response.type ? response.type : null
          let temp_result = JSON.parse(JSON.stringify(result))
          return new Response().sendResponseSuccess({ ...temp_result, type }, true)
        } else {
          return new Response().sendResponseSuccess([], true)
        }
      } else {
        let action: string = ActivityType.READ;
        let isOwnerOrMember: boolean = false;
        let resource: string = this.userResource;
        // TODO check own permission *****
        let hasPermission: boolean = await new Util().hasPermission(request.user, isOwnerOrMember, action, _department.roles, resource, this.userRepository, this.departmentRepository);

        if (hasPermission != true) {
          this.setStatus(400);
          return new Response().sendResponseFailure("User Not Authorized", false);
        }
        let result = await getUser.execute(uuid);
        if (result) {
          let response = await new UGetOrganization(this.organizationRepository).findOrganizationByID(result.departmentId.organization_id)
          let type = response.type ? response.type : null
          let temp_result = JSON.parse(JSON.stringify(result))
          return new Response().sendResponseSuccess({ ...temp_result, type }, true)
        } else {
          return new Response().sendResponseSuccess([], true)
        }

      }
    } catch (error: any) {
      return new Response().sendResponseSuccess(error.message, false)
    }
  }
  /**
   * Retrieves the details of an existing user.
   * Supply the unique user ID (UUID) from either and receive corresponding user details.
   * @param uuid The user's identifier
   */
  @Example({
    "success": true,
    "error": [],
    "data": {
      "dateOfEntry": "2020-06-03T21:34:55.995Z",
      "lastUpdated": "2020-06-03T21:34:55.995Z",
      "_id": "5ed8182161002641da343d0a",
      "fullName": "sangram",
      "email": "sangram56@gmail.com",
      "departmentId": "1",
      "creator": "sam",
      "uuid": "5a69cc6e-5573-4610-99db-ec6e811a45ab",
      "__v": 0
    }
  })
  @Security("jwt")
  @Get('getUserDetails/{uuid}')
  async getUserDetails(uuid: string, @Request() request: any) {
    try {
      const getUser = new GetUser(this.userRepository);
      let _department: any = await new Util().getDepartmentInfo(request.user, this.userRepository, this.departmentRepository);
      let validateUserForOwnPermission = await getUser.checkForUserDepartment(uuid, _department._id)
      if (validateUserForOwnPermission) {
        let result = await getUser.getUserDetails(uuid);
        return new Response().sendResponseSuccess(result, true)
      } else {
        let action: string = ActivityType.READ;
        let isOwnerOrMember: boolean = false;
        let resource: string = this.userResource;
        // TODO check own permission *****
        let hasPermission: boolean = await new Util().hasPermission(request.user, isOwnerOrMember, action, _department.roles, resource, this.userRepository, this.departmentRepository);

        if (hasPermission != true) {
          this.setStatus(400);
          return new Response().sendResponseFailure("User Not Authorized", false);
        }
        let result = await getUser.getUserDetails(uuid);
        return new Response().sendResponseSuccess(result, true)
      }
    } catch (error: any) {
      return new Response().sendResponseSuccess(error.message, false)
    }
  }

  @Security("jwt")
  @Get('getUserDetailsByEmail/{email}')
  async getUserDetailsByEmail(email: string, @Request() request: any) {
    try {
      const getUser = new GetUser(this.userRepository);
      let _department: any = await new Util().getDepartmentInfo(request.user, this.userRepository, this.departmentRepository);
      let action: string = ActivityType.READ;
      let isOwnerOrMember: boolean = false;
      let resource: string = this.userResource;
      // TODO check own permission *****
      let hasPermission: boolean = await new Util().hasPermission(request.user, isOwnerOrMember, action, _department.roles, resource, this.userRepository, this.departmentRepository);

      if (hasPermission != true) {
        this.setStatus(400);
        return new Response().sendResponseFailure("User Not Authorized", false);
      }
      let result = await getUser.getUserDetailsByEmail(email);
      return new Response().sendResponseSuccess(result, true)
    } catch (error: any) {
      return new Response().sendResponseSuccess(error.message, false)
    }
  }

  /**
     * Get all users.
     
     */
  @Security("jwt")
  @Get('getAllUsers')
  async getAllUsers(@Request() request: any) {
    try {
      const getOrganization = new UGetOrganization(this.organizationRepository);
      const getUser = new GetUser(this.userRepository);
      let _department: any = await new Util().getDepartmentInfo(request.user, this.userRepository, this.departmentRepository);

      let org_res = await getOrganization.findOrganizationByID(
        _department.organization_id
      );
      if (org_res.type !== 'admin') {
        return new Response().sendResponseFailure("User Not Authorized", false);
      }
      let result = await getUser.getUsers();
      return new Response().sendResponseSuccess(result, true)
    } catch (error: any) {
      return new Response().sendResponseSuccess(error.message, false)
    }
  }
  /**
     *getUsersById.
      * @param id The user's identifier
     */
  @Security("jwt")
  @Get('getUsersById')
  async getUsersById(@Query() id: string, @Request() request: any) {
    try {
      const getUser = new GetUser(this.userRepository);
      let result = await getUser.getUsersById(id);
      return new Response().sendResponseSuccess(result, true)
    } catch (error: any) {
      return new Response().sendResponseSuccess(error.message, false)
    }
  }

  /**
   * Retrieves the details by email and password. 
   * @param email
   * @param password
   */
  @Example({
    "success": true,
    "error": [],
    "data": {
      "dateOfEntry": "2020-06-03T21:34:55.995Z",
      "lastUpdated": "2020-06-03T21:34:55.995Z",
      "_id": "5ed8182161002641da343d0a",
      "fullName": "sangram",
      "email": "sangram56@gmail.com",
      "departmentId": "1",
      "creator": "sam",
      "uuid": "5a69cc6e-5573-4610-99db-ec6e811a45ab",
      "__v": 0
    }
  })
  @Get('getUserByEmailPassword')
  async getUserByEmailPassword(@Query() email: string, @Query() password: string) {
    try {
      const user = new GetUser(this.userRepository);
      let result = await user.getUserByEmailPassword(email, password);
      // Project to a safe field whitelist before returning over HTTP. This
      // endpoint previously returned the full user record — including
      // password/passwordHash/passwordSalt/shineKey/shinePrivateKey — by email
      // alone, a P0 credential-disclosure leak (see SECURITY-FINDINGS.md).
      // Internal forgot/reset flows use the GetUser use-case directly (not this
      // HTTP route), so they still get the full record; only the wire response
      // is trimmed. The sole HTTP consumer (auth-service login) needs just
      // uuid + departmentId.
      const safe = (u: any) => {
        if (!u) return u;
        const o = typeof u.toObject === 'function' ? u.toObject() : u;
        const { _id, uuid, email, fullName, departmentId, creator, dateOfEntry, lastUpdated } = o;
        return { _id, uuid, email, fullName, departmentId, creator, dateOfEntry, lastUpdated };
      };
      const projected = Array.isArray(result) ? result.map(safe) : safe(result);
      return new Response().sendResponseSuccess(projected, true);
    } catch (error: any) {
      return new Response().sendResponseSuccess(error.message, false)
    }
  }

  /**
   * Get user roles by uuid
   * @param user_uuid
   */
  @Example({
    "success": true,
    "error": [],
    "data": {
    }
  })
  @Security('jwt')
  @Get('getUserRolesByUUID')
  async getUserRolesByUUID(@Query() user_uuid: string, @Request() request: any) {
    try {
      // TODO check permission

      let _department: any = await new Util().getDepartmentInfo(request.user, this.userRepository, this.departmentRepository);

      let roles: any = _department.roles;

      if (!roles) {
        this.setStatus(400);
        return new Response().sendResponseFailure("roles not found!", false);
      }

      return new Response().sendResponseSuccess(roles, true);
    } catch (error: any) {
      return new Response().sendResponseSuccess(error.message, false)
    }
  }

  /**
   * Get user roles by uuid
   * @param user_uuid
   */
  @Example({
    "success": true,
    "error": [],
    "data": {
    }
  })
  @Security('jwt')
  @Get('getUserDepartment')
  async getUserDepartment(@Query() user_uuid: string, @Request() request: any) {
    try {
      // TODO check permission

      let _department: any = await new Util().getDepartmentInfo(request.user, this.userRepository, this.departmentRepository);

      if (!_department) {
        this.setStatus(400);
        return new Response().sendResponseFailure("department not found!", false);
      }

      return new Response().sendResponseSuccess(_department, true);
    } catch (error: any) {
      return new Response().sendResponseSuccess(error.message, false)
    }
  }

  /**
   * changePassword
   */
  @Example({
    "success": true,
    "error": [],
    "data": {
    }
  })
  @Security('jwt')
  @Post('changePassword')
  async changePassword(@Body() user: IChangePasswordRequest, @Request() request: any) {
    try {
      // TODO check permission
      if (!user.email) {
        this.setStatus(400);
        return new Response().sendResponseFailure("no email found", false);
      }
      if (!user.oldPassword) {
        this.setStatus(400);
        return new Response().sendResponseFailure("old password not found", false);
      }
      if (!user.newPassword) {
        this.setStatus(400);
        return new Response().sendResponseFailure("new password not found", false);
      }
      if (!user.uuid) {
        this.setStatus(400);
        return new Response().sendResponseFailure("no uuid found", false);
      }
      if (!user.id) {
        this.setStatus(400);
        return new Response().sendResponseFailure("no id found", false);
      }
      if (!user.captcha) {
        this.setStatus(400);
        return new Response().sendResponseFailure("no captcha found", false);
      }

      let verify_res = await new AuthService().verifyCaptcha(user.captcha, user.id);
      if (!verify_res.success) return new Response().sendResponseFailure("not valid", false);
      const getUser = new GetUser(this.userRepository);
      let user_res = await getUser.validateUser(user.email, user.uuid)
      if (!user_res) throw new Error('email id or uuid not found! ');
      const changePasswordUseCase = new ChangeUserPassword(this.userRepository)
      let validPassword = await changePasswordUseCase.validatePassword(user_res, user.oldPassword)
      if (!validPassword) throw new Error('old password incorrect ! ');
      let result = await new User().changePassword(user, changePasswordUseCase);
      return new Response().sendResponseSuccess(result, true);
    } catch (Error: any) {
      this.setStatus(500);
      return new Response().sendResponseFailure(Error.message, false);
    }
  }


  /**
  * Reset password
  */
  @Example({
    "success": true,
    "error": [],
    "data": {
    }
  })
  @Security('jwt')
  @Post('resetPassword')
  async resetPassword(@Body() user: IResetPasswordRequest, @Request() request: any) {
    try {
      // TODO check permission
      if (!user.email) {
        this.setStatus(400);
        return new Response().sendResponseFailure("no email found", false);
      }
      if (!user.newPassword) {
        this.setStatus(400);
        return new Response().sendResponseFailure("new password not found", false);
      }
      if (!user.token) {
        this.setStatus(400);
        return new Response().sendResponseFailure("token not found", false);
      }
      if (!user.id) {
        this.setStatus(400);
        return new Response().sendResponseFailure("no id found", false);
      }
      if (!user.captcha) {
        this.setStatus(400);
        return new Response().sendResponseFailure("no captcha found", false);
      }
      let verify_res = await new AuthService().verifyCaptcha(user.captcha, user.id);
      if (verify_res.success) {
        let token_res = await new AuthService().verifyToken(user.token)
        if (!token_res.data) throw new Error('jwt token not found or expire ');
        // Enforce that this is a reset-purpose token AND that it was issued for
        // the exact account being reset. Without this, any valid reset token
        // (or a normal login token) could reset an arbitrary account by
        // supplying a different email in the request body. The token's `uuid`
        // is bound to the requesting email at generation (see auth-service
        // generateJwtToken).
        if (token_res.data.type !== 'reset' || token_res.data.uuid !== user.email) {
          this.setStatus(403);
          return new Response().sendResponseFailure("reset token is not valid for this account", false);
        }
        const getUser = new GetUser(this.userRepository);
        let user_res = await getUser.getUserByEmailPassword(user.email, '')
        const changePasswordUseCase = new ChangeUserPassword(this.userRepository)
        let resetPasswordRes = await changePasswordUseCase.resetPassword(user_res, user.newPassword)
        await new AuthService().destroyJwtToken(user.token)
        return new Response().sendResponseSuccess(resetPasswordRes, true);

      } else {
        return new Response().sendResponseFailure("not valid", false);
      }


    } catch (Error: any) {
      this.setStatus(500);
      return new Response().sendResponseFailure(Error.message, false);
    }
  }

  /**
 * forgot password
 */
  @Example({
    "success": true,
    "error": [],
    "data": {
    }
  })
  @Post('forgotPassword')
  async forgotPassword(@Body() user: IForgotPasswordRequest, @Request() request: any) {
    try {
      if (!user.email) {
        this.setStatus(400);
        return new Response().sendResponseFailure("no email found", false);
      }
      if (!user.id) {
        this.setStatus(400);
        return new Response().sendResponseFailure("no id found", false);
      }
      if (!user.captcha) {
        this.setStatus(400);
        return new Response().sendResponseFailure("no captcha found", false);
      }

      let verify_res = await new AuthService().verifyCaptcha(user.captcha, user.id);
      if (verify_res.success) {
        const getUser = new GetUser(this.userRepository);
        let user_res = await getUser.getUserByEmailPassword(user.email, '')
        if (user_res.length == 0) return new Response().sendResponseSuccess("email id not found", false);
        if (user_res) {
          let jwtToken = await new AuthService().generateJwtToken(user.email)
          console.log('jwtToken', jwtToken)
          let extra_data = { type: 'forgotPassword', email: user.email }
          let messageBody = process.env.RESET_MAIL_NOTIFY_URL + "/reset-password?token=" + jwtToken.data.jwtToken + "&email=" + user.email
          await new NotificationService().sendPushNotification(JSON.stringify([user.email]), "forgotPassword", '', 'web', jwtToken.data.jwtToken, extra_data, 'Reset your password', messageBody)
          return new Response().sendResponseSuccess("mail sent", true);
        } else {
          return new Response().sendResponseSuccess("email id not found", false);
        }
      } else {
        return new Response().sendResponseFailure("not valid", false);
      }


    } catch (Error: any) {
      this.setStatus(500);
      return new Response().sendResponseFailure(Error.message, false);
    }
  }

  /**
   * Create a user
   * @param req This is a user creation request description
   */
  @Example({
    "success": true,
    "error": [],
    "data": {
    }
  })
  @Security('jwt')
  @Post('updateUserInfo')
  async updateUserInfo(@Body() user: IUpdateUserRequest, @Request() request: any) {
    try {
      if (!user.fullName) {
        this.setStatus(400);
        return new Response().sendResponseFailure("no fullName found", false);
      }
      if (!user.email) {
        this.setStatus(400);
        return new Response().sendResponseFailure("no email found", false);
      }
      if (!user.uuid) {
        this.setStatus(400);
        return new Response().sendResponseFailure("no uuid found", false);
      }
      const getOrganization = new UGetOrganization(this.organizationRepository);
      let _department: any = await new Util().getDepartmentInfo(request.user, this.userRepository, this.departmentRepository);

      let org_res = await getOrganization.findOrganizationByID(
        _department.organization_id
      );
      if (org_res.type !== 'admin') {
        return new Response().sendResponseFailure("User Not Authorized", false);
      }
      const useCase = new UpdateUserInfo(this.userRepository);
      let result = await new User().updateUserInfo(user, useCase);
      return new Response().sendResponseSuccess(result, true);
    } catch (Error: any) {
      this.setStatus(500);
      return new Response().sendResponseFailure(Error.message, false);
    }
  }
}