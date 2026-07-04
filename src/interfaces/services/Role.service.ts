import * as SuperAgent from "superagent"
import logger from '../../infrastructure/logger/logger';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
process.env.NODE_TLS_ACCEPT_UNTRUSTED_CERTIFICATES_THIS_IS_INSECURE = '1'

let ROLE_SERVICE_URL = process.env.ROLE_SERVICE_URL

logger.debug("RoleService ROLE_SERVICE_URL " + ROLE_SERVICE_URL);

export class RoleService {
  constructor() { }

  isPermissionGranted(jwtToken: string, isOwnerOrMember: boolean, action: string, userRoles: string[], resource: string): any {
    return new Promise((resolve, reject) => {
      if (isOwnerOrMember == undefined) reject(new Error('isOwnerOrMember missing'));
      if (!action) reject(new Error('action missing'));
      if (!userRoles || userRoles.length == 0) reject(new Error('userRoles missing'));
      if (!resource) reject(new Error('resource missing'));

      SuperAgent
        .get(ROLE_SERVICE_URL + '/api/v1/permission/isPermissionGranted')
        .set('Authorization', 'Bearer ' + jwtToken)
        .query({
          userRoles,
          isOwnerOrMember,
          action,
          resource
        })
        .end((err, res) => {
          if (err) {
            return reject(new Error(err));
          }
          if (!res || !res.body) return reject(new Error('An error occurred with the user service.'));
          resolve(res.body);
        });
    }).catch(function (err) {
      console.log("RoleService Error!, ", err);
    });
  }

  getPermission(jwtToken: string, isOwnerOrMember: boolean, action: string, userRoles: string[], resource: string): any {
    return new Promise((resolve, reject) => {
      if (isOwnerOrMember == undefined) reject(new Error('isOwnerOrMember missing'));
      if (!action) reject(new Error('action missing'));
      if (!userRoles || userRoles.length == 0) reject(new Error('userRoles missing'));
      if (!resource) reject(new Error('resource missing'));

      SuperAgent
        .get(ROLE_SERVICE_URL + '/api/v1/permission/getPermission')
        .set('Authorization', 'Bearer ' + jwtToken)
        .query({
          userRoles,
          isOwnerOrMember,
          action,
          resource
        })
        .end((err, res) => {
          if (err) {
            return reject(new Error(err));
          }
          if (!res || !res.body) return reject(new Error('An error occurred with the user service.'));
          resolve(res.body);
        });
    }).catch(function (err) {
      console.log("RoleService Error!, ", err);
    });
  }
  findPermissionByActionAndResource(action: string, resource: string): any {
    return new Promise((resolve, reject) => {
      if (!action) reject(new Error('action missing'));
      if (!resource) reject(new Error('resource missing'));

      SuperAgent
        .get(ROLE_SERVICE_URL + '/api/v1/permission/findPermissionByActionAndResource')
        .query({
          action,
          resource
        })
        .end((err, res) => {
          if (err) {
            return reject(new Error(err));
          }
          if (!res || !res.body) return reject(new Error('An error occurred with the user service.'));
          resolve(res.body);
        });
    }).catch(function (err) {
      console.log("RoleService Error!, ", err);
    });
  }
  createPermissionInBulk(permissions: any): any {
    return new Promise((resolve, reject) => {
      console.log("createPermissionInBulk", permissions)
      console.log(ROLE_SERVICE_URL + '/api/v1/permission/createPermissionBulk');
      SuperAgent
        .post(ROLE_SERVICE_URL + '/api/v1/permission/createPermissionBulk')
        .send({
          new_permission: permissions
        })
        .end((err, res) => {
          if (err) {
            return reject(new Error(err));
          }
          if (!res || !res.body) return reject(new Error('An error occurred with the user service.'));
          resolve(res.body);
        });
    }).catch(function (err) {
      console.log("RoleService Error!, ", err);
    });
  }
  createRoleBulk(role: any): any {
    return new Promise((resolve, reject) => {
      SuperAgent
        .post(ROLE_SERVICE_URL + '/api/v1/role/createRoleBulk')
        .send({
          role: role
        })
        .end((err, res) => {
          if (err) {
            return reject(new Error(err));
          }
          if (!res || !res.body) return reject(new Error('An error occurred with the user service.'));
          resolve(res.body);
        });
    }).catch(function (err) {
      console.log("RoleService Error!, ", err);
    });
  }
}