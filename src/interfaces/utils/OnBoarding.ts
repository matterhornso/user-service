import { OrganizationModel } from '../../infrastructure/database/organization/organization.model'
import { DepartmentModel } from '../../infrastructure/database/department/department.model'
import { UserModel } from '../../infrastructure/database/users/users.model'
import { v4 as uuidv4 } from 'uuid';
import { Utils } from '../../domain/Utils';
import { RoleService } from '../services/Role.service';
import CryptoJS from 'crypto-js';
import * as crypto from "crypto";
import { MongoConnection } from "../../infrastructure/MongoConnection"

export class OnBoarding {
  private mongoConnection: any
  constructor() {
    this.mongoConnection = new MongoConnection();
    // this.createSuperAdmin(this.ADMIN_PERMISSION);
    // this.onBoardingByOrgType({ type: "ISSUER", permissions: this.ISSUER_PERMISSION }, {
    //   shineKey: "EOS6Hbzn3DGYUooZBgEbtYUQgzRaThWiy3WaDj32EL2hktjy1BHvh",
    //   shineName: "x4iqmd4mqbl3"
    // })
    // this.onBoardingByOrgType({ type: "VERIFIER", permissions: this.VERIFIER_PERMISSION }, {
    //   shineKey: "EOS6Hbzn3DGYUooZBgEbtYUQgzRaThWiy3WaDj32EL2hktjy1BHvh",
    //   shineName: "x4iqmd4mqbl3"
    // })
    // this.onBoardingByOrgType({ type: "BUYER", permissions: this.BUYER_PERMISSION }, {
    //   shineKey: "EOS6Hbzn3DGYUooZBgEbtYUQgzRaThWiy3WaDj32EL2hktjy1BHvh",
    //   shineName: "x4iqmd4mqbl3"
    // })
  }

  async createSuperAdmin(permissions: any) {
    return new Promise(async (resolve, reject) => {
      let org_res: any = await this.createOrganization();
      if (org_res.status == false) resolve({ status: false, Error: 'error while creating organization' })
      let dept_res: any = await this.createDepartment(org_res.data.id)
      if (dept_res.status == false) resolve({ status: false, Error: 'error while creating department' })
      let user_res: any = await this.createUser(dept_res.data.id, null, '12345')
      if (user_res.status == false) resolve({ status: false, Error: 'error while creating user' })
      let permission_res: any = await this.createPermissionAndRole(permissions)
      if (permission_res.status == false) resolve({ status: false, Error: 'error while creating permission' })
      console.log("---onboarding complete for shine super admin")
      resolve({ status: true, data: 'onboarding complete for shine super admin' })
    })

  }
  async onBoardingByOrgType(superAdminRequest: any, _user: any) {
    return new Promise(async (resolve, reject) => {
      let org_res: any = await this.createOrganization(_user, superAdminRequest.type)
      if (org_res.status == false) resolve({ status: false, Error: 'error while creating organization' })
      let dept_res: any = await this.createDepartment(org_res.data._id, superAdminRequest.type, _user, org_res.data.shine_name)
      if (dept_res.status == false) resolve({ status: false, Error: 'error while creating department' })
      let user_res: any = await this.createUser(dept_res.data.id, superAdminRequest.type, '12345')
      if (user_res.status == false) resolve({ status: false, Error: 'error while creating user' })
      let permission_res: any = await this.createPermissionAndRole(superAdminRequest.permissions, superAdminRequest.type, dept_res.data.id,)
      if (permission_res.status == false) resolve({ status: false, Error: 'error while creating permission' })
      console.log("---onboarding complete for Organization " + superAdminRequest.type)
      resolve({ status: true, data: "---onboarding complete for Organization " + superAdminRequest.type })
    })
  }
  //create org
  async createOrganization(_user: any = null, type: any = null) {
    return new Promise(async (resolve, reject) => {
      if (_user) {
        let org_data = {
          uuid: uuidv4(),
          name: type + " organization",
          about: type + ' about',
          active: true,
          type: type,
          shine_name: new Utils().generateShineName(),
          user_shine_name: _user.shineName,
          user_public_key: _user.shineKey
        }
        let org_res = await this.mongoConnection.createOrganization(org_data)
        if (!org_res) resolve({ status: false, Error: 'error while creating org' })
        resolve({ status: true, data: org_res })
      } else {
        let org_data = {
          uuid: uuidv4(),
          name: "super-admin",
          about: 'shine super admin',
          active: true,
          type: 'super-admin',
          shine_name: new Utils().generateShineName()
        }
        let org_res = await OrganizationModel.createSuperAdminOrganization(org_data);
        if (!org_res) resolve({ status: false, Error: 'error while creating org' })
        resolve({ status: true, data: org_res })
      }

    })
  }

  //create department
  async createDepartment(organization_id: string, type: any = null, _user: any = null, organization_shine_name: any = null) {
    return new Promise(async (resolve, reject) => {
      let { shine_private_key, shine_public_key }: any = await new Utils().generateKeyPair();
      if (type) {
        let role = type + "_role";
        let dept_data = {
          organization_id: organization_id,
          uuid: uuidv4(),
          name: type + " department",
          about: type + " department about",
          shine_name: new Utils().generateShineName(),
          roles: [role],
          shine_private_key: shine_private_key,
          shine_public_key: shine_public_key,
          user_shine_name: _user.shineName,
          user_public_key: _user.shineKey,
          organization_shine_name: organization_shine_name,
          active: true
        }
        let dept_res = await this.mongoConnection.createDepartment(dept_data)
        if (!dept_res) resolve({ status: false, Error: 'error while creating department' })
        resolve({ status: true, data: dept_res })
      } else {
        let dept_data = {
          organization_id: organization_id,
          uuid: uuidv4(),
          name: "super admin department",
          about: 'shine super admin department',
          shine_name: new Utils().generateShineName(),
          roles: ['shine-super-admin'],
          shine_private_key: shine_private_key,
          shine_public_key: shine_public_key,
          active: true
        }
        let dept_res = await DepartmentModel.createSuperAdminDepartment(dept_data);
        if (!dept_res) resolve({ status: false, Error: 'error while creating department' })
        resolve({ status: true, data: dept_res })
      }

    })
  }

  //create department
  async createPermissionAndRole(permissions: any, type: any = null, departmentId: any = null) {
    return new Promise(async (resolve, reject) => {
      if (type) {
        let not_common_permission = permissions.filter((key: any) => key.common == false)
        let common_permission = permissions.filter((key: any) => key.common == true)
        for (let index = 0; index < not_common_permission.length; index++) {
          const element = not_common_permission[index];
          if (element.appendDeptId) {
            not_common_permission[index].resource = departmentId + ":" + not_common_permission[index].resource
          }
        }
        let permission = await new RoleService().createPermissionInBulk(not_common_permission)
        //console.log("res_permissions", permission)
        let res_permissions = permission.data.map((key: any) => key._id)
        for (let index = 0; index < common_permission.length; index++) {
          const element = common_permission[index];
          let permission_res = await new RoleService().findPermissionByActionAndResource(element.action, element.resource)
          console.log('permission_res', permission_res)
          if (permission_res.status == false) resolve({ status: false, Error: 'error while getting permissions' })
          res_permissions.push(permission_res.data._id)
        }
        console.log('res_permissions', res_permissions)
        let role_name = type + "_role";
        let role = await new RoleService().createRoleBulk({
          archived: false,
          permissions: res_permissions,
          name: role_name,
          description: role_name + " description"
        })
        if (role.status === false) resolve({ status: false, Error: 'error while creating role' })
        resolve({ status: true, data: role })
      } else {
        let permission = await new RoleService().createPermissionInBulk(permissions)
        console.log("res_permissions", permission)
        if (permission.status === false) resolve({ status: false, Error: 'error while creating permissions' })
        let res_permissions = permission.data.map((key: any) => key._id)
        console.log('format permission', res_permissions)
        let role = await new RoleService().createRoleBulk({
          archived: false,
          permissions: res_permissions,
          name: 'shine-super-admin',
          description: "shine super admin role"
        })
        if (role.status === false) resolve({ status: false, Error: 'error while creating role' })
        resolve({ status: true, data: role })
      }

    })
  }
  //create permission
  async createPermissionByRoleName(permissions: any, name: string, departmentId: any = null) {
    return new Promise(async (resolve, reject) => {
      let not_common_permission = permissions.filter((key: any) => key.common == false)
      let common_permission = permissions.filter((key: any) => key.common == true)
      for (let index = 0; index < not_common_permission.length; index++) {
        const element = not_common_permission[index];
        if (element.appendDeptId) {
          not_common_permission[index].resource = departmentId + ":" + not_common_permission[index].resource
        }
      }
      let permission = await new RoleService().createPermissionInBulk(not_common_permission)
      let res_permissions = permission.data.map((key: any) => key._id)
      for (let index = 0; index < common_permission.length; index++) {
        const element = common_permission[index];
        let permission_res = await new RoleService().findPermissionByActionAndResource(element.action, element.resource)
        if (permission_res.status == false) resolve({ status: false, Error: 'error while getting permissions' })
        res_permissions.push(permission_res.data._id)
      }
      let role_name = name;
      let role = await new RoleService().createRoleBulk({
        archived: false,
        permissions: res_permissions,
        name: role_name,
        description: role_name + " description"
      })
      if (role.status === false) resolve({ status: false, Error: 'error while creating role' })
      resolve({ status: true, data: role })
    })
  }

  async createUser(departmentId: string, type: any = null, new_password: string) {
    return new Promise(async (resolve, reject) => {
      if (type) {
        let password = new_password
        let { shine_private_key, shine_public_key }: any = await new Utils().generateKeyPair();
        let md5Password = CryptoJS.MD5(password).toString()
        let passwordSalt = crypto.randomBytes(16).toString('hex');
        let passwordHash = crypto.pbkdf2Sync(md5Password, passwordSalt, 1000, 64, `sha512`).toString(`hex`);
        let user_data = {
          uuid: uuidv4(),
          fullName: type + "user",
          email: "shine@" + type + ".com",
          departmentId: departmentId,
          shineKey: shine_public_key,
          shineName: new Utils().generateShineName(),
          shinePrivateKey: shine_private_key,
          passwordSalt: passwordSalt,
          passwordHash: passwordHash
        }
        let user_res = await UserModel.findOneOrCreateForSuperAdmin(user_data)
        console.log("user created")
        resolve(user_res)
      } else {
        let password = new_password
        let { shine_private_key, shine_public_key }: any = await new Utils().generateKeyPair();
        let md5Password = CryptoJS.MD5(password).toString()
        let passwordSalt = crypto.randomBytes(16).toString('hex');
        let passwordHash = crypto.pbkdf2Sync(md5Password, passwordSalt, 1000, 64, `sha512`).toString(`hex`);
        let user_data = {
          uuid: uuidv4(),
          fullName: "shineAdmin",
          email: "shine@admin.com",
          departmentId: departmentId,
          shineKey: shine_public_key,
          shineName: new Utils().generateShineName(),
          shinePrivateKey: shine_private_key,
          passwordSalt: passwordSalt,
          passwordHash: passwordHash
        }
        let user_res = await UserModel.findOneOrCreateForSuperAdmin(user_data)
        console.log("user created")
        resolve(user_res)
      }

    })
  }

  async parsePermission(permission: any) {
    console.log('parsePermission', permission.permissions)
    let not_common_permission = permission.permissions.filter((key: any) => key.common == false)
    //console.log('common_permission', common_permission)
  }



  //permissions
  //admin permission
  ADMIN_PERMISSION = [
    {
      "resource": "organization",
      "action": "create:any",
      "attributes": '["uuid", "name", "about", "active", "type", "shine_name", "user_shine_name", "user_encrypted_data", "user_public_key", "transactionId", "transactionStatus"]'
    },
    {
      "resource": "organization",
      "action": "update:any",
      "attributes": '["uuid", "name", "about", "active", "type", "shine_name", "user_shine_name", "user_encrypted_data", "user_public_key", "transactionId", "transactionStatus"]'
    },
    {
      "resource": "organization",
      "action": "read:any",
      "attributes": '["uuid", "name", "about", "active", "type", "shine_name", "user_shine_name", "user_encrypted_data", "user_public_key", "transactionId", "transactionStatus"]'
    },
    {
      "resource": "department",
      "action": "create:any",
      "attributes": '["uuid", "name", "about", "organization_id", "active", "roles", "organization_shine_name", "shine_name", "shine_public_key", "shine_private_key", "user_shine_name", "user_encrypted_data", "user_public_key", "user_signature"]'
    },
    {
      "resource": "department",
      "action": "update:any",
      "attributes": '["uuid", "name", "about", "organization_id", "active", "roles", "organization_shine_name", "shine_name", "shine_public_key", "shine_private_key", "user_shine_name", "user_encrypted_data", "user_public_key", "user_signature"]'
    },
    {
      "resource": "department",
      "action": "read:any",
      "attributes": '["uuid", "name", "about", "organization_id", "active", "roles", "organization_shine_name", "shine_name", "shine_public_key", "shine_private_key", "user_shine_name", "user_encrypted_data", "user_public_key", "user_signature"]'
    },
    {
      "resource": "rolepermission",
      "action": "create:any",
      "attributes": '["resource", "action", "attributes"]'

    },
    {
      "resource": "rolepermission",
      "action": "update:any",
      "attributes": '["resource", "action", "attributes"]'
    },
    {
      "resource": "rolepermission",
      "action": "read:any",
      "attributes": '["resource", "action", "attributes"]'
    },
    {
      "resource": "role",
      "action": "create:any",
      "attributes": '["name", "description", "archived", "permissions"]'
    },
    {
      "resource": "role",
      "action": "update:any",
      "attributes": '["name", "description", "archived", "permissions"]'
    },
    {
      "resource": "role",
      "action": "read:any",
      "attributes": '["name", "description", "archived", "permissions",]'
    },

    {
      "resource": "user",
      "action": "update:any",
      "attributes": '["uuid", "fullName", "email", "departmentId", "password", "shineName", "department_shine_name", "user_shine_name", "user_encrypted_data", "user_public_key", "user_signature", "shinePrivateKey"]'
    },
    {
      "resource": "user",
      "action": "read:any",
      "attributes": '["uuid", "fullName", "email", "departmentId", "password", "shineName", "department_shine_name", "user_shine_name", "user_encrypted_data", "user_public_key", "user_signature", "shinePrivateKey"]'
    },
    {
      "resource": "user",
      "action": "create:any",
      "attributes": '["uuid", "fullName", "email", "departmentId", "password", "shineName", "department_shine_name", "user_shine_name", "user_encrypted_data", "user_public_key", "user_signature", "shinePrivateKey"]'
    },
    {
      "resource": "blockchainPermission",
      "action": "create:any",
      "attributes": '["*"]'
    }
  ]

  //ISSUER_PERMISSION
  ISSUER_PERMISSION = [
    {
      "resource": "project",
      "appendDeptId": true,
      "action": "create:own",
      "attributes": '["*"]',
      "common": true
    },
    {
      "resource": "project",
      "appendDeptId": true,
      "action": "update:own",
      "attributes": '["*"]',
      "common": false
    },
    {
      "resource": "project",
      "appendDeptId": true,
      "action": "read:own",
      "attributes": '["*"]',
      "common": false
    },
    {
      "resource": "project",
      "appendDeptId": true,
      "action": "delete:own",
      "attributes": '["*"]',
      "common": false
    },
    {
      "resource": "user",
      "appendDeptId": true,
      "action": "create:own",
      "attributes": '["*"]',
      "common": false
    },
    {
      "resource": "user",
      "appendDeptId": true,
      "action": "update:own",
      "attributes": '["*"]',
      "common": false
    },
    {
      "resource": "user",
      "appendDeptId": true,
      "action": "delete:own",
      "attributes": '["*"]',
      "common": false
    },
    {
      "resource": "user",
      "appendDeptId": true,
      "action": "read:own",
      "attributes": '["*"]',
      "common": false
    },
    {
      "resource": "order",
      "appendDeptId": false,
      "action": "read:any",
      "attributes": '["*"]',
      "common": false
    },
  ]

  //VERIFIER_PERMISSION
  VERIFIER_PERMISSION = [
    {
      "resource": "project",
      "appendDeptId": false,
      "action": "read:any",
      "attributes": '["*"]',
      "common": false
    },
    {
      "resource": "project",
      "appendDeptId": false,
      "action": "update:any",
      "attributes": '["*"]',
      "common": false
    },
    {
      "resource": "user",
      "appendDeptId": true,
      "action": "create:own",
      "attributes": '["*"]',
      "common": false
    },
    {
      "resource": "user",
      "appendDeptId": true,
      "action": "update:own",
      "attributes": '["*"]',
      "common": false
    },
    {
      "resource": "user",
      "appendDeptId": true,
      "action": "delete:own",
      "attributes": '["*"]',
      "common": false
    },
    {
      "resource": "user",
      "appendDeptId": true,
      "action": "read:own",
      "attributes": '["*"]',
      "common": false
    },
    {
      "resource": "issuer",
      "appendDeptId": false,
      "action": "read:any",
      "attributes": '["*"]',
      "common": false
    }
  ]
  //VERIFIER_PERMISSION
  BUYER_PERMISSION = [
    {
      "resource": "project",
      "appendDeptId": false,
      "action": "read:any",
      "attributes": '["*"]',
      "common": true
    },
    {
      "resource": "order",
      "appendDeptId": true,
      "action": "create:own",
      "attributes": '["*"]',
      "common": false
    },
    {
      "resource": "order",
      "appendDeptId": true,
      "action": "update:own",
      "attributes": '["*"]',
      "common": false
    },
    {
      "resource": "order",
      "appendDeptId": true,
      "action": "delete:own",
      "attributes": '["*"]',
      "common": false
    },
    {
      "resource": "order",
      "appendDeptId": true,
      "action": "read:own",
      "attributes": '["*"]',
      "common": false
    },
    {
      "resource": "user",
      "appendDeptId": true,
      "action": "create:own",
      "attributes": '["*"]',
      "common": false
    },
    {
      "resource": "user",
      "appendDeptId": true,
      "action": "update:own",
      "attributes": '["*"]',
      "common": false
    },
    {
      "resource": "user",
      "appendDeptId": true,
      "action": "delete:own",
      "attributes": '["*"]',
      "common": false
    },
    {
      "resource": "user",
      "appendDeptId": true,
      "action": "read:own",
      "attributes": '["*"]',
      "common": false
    },
    {
      "resource": "issuer",
      "appendDeptId": false,
      "action": "read:any",
      "attributes": '["*"]',
      "common": true
    }
  ]
}

new OnBoarding();


//On-boarding super admin
