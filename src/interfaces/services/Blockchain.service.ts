import * as SuperAgent from "superagent"
const { Api, JsonRpc, RpcError } = require('eosjs');
const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig');
const fetch = require('node-fetch');
const util = require('util');
import { IOrganization, IDepartment, IUser, IDepartmentUpdate } from '../../domain/index';
import { v4 as uuidv4 } from 'uuid';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
process.env.NODE_TLS_ACCEPT_UNTRUSTED_CERTIFICATES_THIS_IS_INSECURE = '1'

let BC_SERVICE_URL = process.env.BC_SERVICE_URL || 'http://localhost:3003';

const signatureProvider = new JsSignatureProvider([process.env.ACTOR_KEY]);
const rpc = new JsonRpc(process.env.SHINE_BLOCKCHAIN, {
  fetch
});

let ORG_CONTRACT_NAME = process.env.ORG_CONTRACT_NAME
let ACTOR = process.env.ACTOR

const api = new Api({
  rpc,
  signatureProvider,
  textDecoder: new util.TextDecoder(),
  textEncoder: new util.TextEncoder()
});

export class BCService {
  constructor() { }

  createOrg(org: IOrganization, encryptedData: any): any {
    return new Promise(async (resolve, reject) => {
      let param = {
        actions: [{
          account: ORG_CONTRACT_NAME,
          name: "addorg",
          authorization: [{
            actor: ACTOR,
            permission: 'active',
          }],
          data: {
            sender: ACTOR,
            org_id: org.shine_name,
            external_id: org.uuid,
            user_encrypted_data: org.user_encrypted_data,
            username: org.user_shine_name,
            user_public_key: org.user_public_key,
            user_signature: "",
            encrypted_data: encryptedData.encrypted_data,
            data_public_key: encryptedData.data_public_key,
            encrypted_access_keys: encryptedData.encrypted_keys
          }
        }]
      };

      const result = await api.transact(param, {
        blocksBehind: 3,
        expireSeconds: 3600,
        sign: true,
        broadcast: false,
      });

      let signatures = result.signatures;
      let serializedTransaction = result.serializedTransaction;

      if (!signatures) reject(new Error('signatures missing'));
      if (!serializedTransaction) reject(new Error('serializedTransaction missing'));

      SuperAgent
        .post(BC_SERVICE_URL + '/shineconnect/api/v1/transaction/sendTransaction')
        .send({
          signatures: signatures,
          serializedTransaction: Array.from(serializedTransaction)
        })
        .end((err, res) => {
          //console.log("err", err, res)
          // Calling the end function will send the request
          if (err) {
            return reject(new Error('An error occurred with the BCService, err: ' + err));
          }
          if (!res || !res.body) return reject(new Error('An error occurred with the BCService, err: ' + err));
          // parse transaction id out of response
          if (res.body.success == true) return resolve(res.body.data.message.transaction_id);
          return reject(new Error('An error occurred while sending tx to blockchain!')); // TODO think
        });
    });
  }

  createDepartment(dept: IDepartment, encryptedData: any): any {
    return new Promise(async (resolve, reject) => {
      console.log('createDepartmentcreateDepartment', dept)
      let param = {
        actions: [{
          account: ORG_CONTRACT_NAME,
          name: "adddept",
          authorization: [{
            actor: ACTOR,
            permission: 'active',
          }],
          data: {
            sender: ACTOR,
            org_id: dept.organization_shine_name,
            new_dept_id: dept.shine_name,
            external_id: dept.uuid,
            user_encrypted_data: dept.user_encrypted_data,
            username: dept.user_shine_name,
            user_public_key: dept.user_public_key,
            user_signature: "",
            encrypted_data: encryptedData.encrypted_data,
            data_public_key: encryptedData.data_public_key,
            encrypted_access_keys: encryptedData.encrypted_keys
          }
        }]
      };
      const result = await api.transact(param, {
        blocksBehind: 3,
        expireSeconds: 3600,
        sign: true,
        broadcast: false,
      });

      let signatures = result.signatures;
      let serializedTransaction = result.serializedTransaction;

      if (!signatures) reject(new Error('signatures missing'));
      if (!serializedTransaction) reject(new Error('serializedTransaction missing'));

      SuperAgent
        .post(BC_SERVICE_URL + '/shineconnect/api/v1/transaction/sendTransaction')
        .send({
          signatures: signatures,
          serializedTransaction: Array.from(serializedTransaction)
        })
        .end((err, res) => {
          // Calling the end function will send the request
          if (err) {
            return reject(new Error('An error occurred with the BCService, err: ' + err));
          }
          if (!res || !res.body) return reject(new Error('An error occurred with the BCService, err: ' + err));
          // parse transaction id out of response
          if (res.body.success == true) return resolve(res.body.data.message.transaction_id);
          return reject(new Error('An error occurred while sending tx to blockchain!')); // TODO think
        });
    });
  }

  createUser(user: IUser, encryptedData: any): any {
    return new Promise(async (resolve, reject) => {
      let param = {
        actions: [{
          account: ORG_CONTRACT_NAME,
          name: "adduser",
          authorization: [{
            actor: ACTOR,
            permission: 'active',
          }],
          data: {
            sender: ACTOR,
            user_id: user.shineName,
            dept_id: user.department_shine_name,
            external_id: user.uuid,
            new_user_public_key: user.shineKey,
            user_encrypted_data: user.user_encrypted_data,
            username: user.user_shine_name,
            user_public_key: user.user_public_key,
            user_signature: "",
            encrypted_data: encryptedData.encrypted_data,
            data_public_key: encryptedData.data_public_key,
            encrypted_access_keys: encryptedData.encrypted_keys
          }
        }]
      };
      const result = await api.transact(param, {
        blocksBehind: 3,
        expireSeconds: 3600,
        sign: true,
        broadcast: false,
      });

      let signatures = result.signatures;
      let serializedTransaction = result.serializedTransaction;

      if (!signatures) reject(new Error('signatures missing'));
      if (!serializedTransaction) reject(new Error('serializedTransaction missing'));

      SuperAgent
        .post(BC_SERVICE_URL + '/shineconnect/api/v1/transaction/sendTransaction')
        .send({
          signatures: signatures,
          serializedTransaction: Array.from(serializedTransaction)
        })
        .end((err, res) => {
          // Calling the end function will send the request
          if (err) {
            return reject(new Error('An error occurred with the BCService, err: ' + err));
          }
          if (!res || !res.body) return reject(new Error('An error occurred with the BCService, err: ' + err));
          // parse transaction id out of response
          if (res.body.success == true) return resolve(res.body.data.message.transaction_id);
          return reject(new Error('An error occurred while sending tx to blockchain!')); // TODO think
        });
    });
  }

  addBlockchainAdminPermissions(department_shine_name: string): any {
    return new Promise(async (resolve, reject) => {
      let permisions = [
        "create_org",
        "update_org_own",
        "update_org_any",
        "create_dept_own",
        "create_dept_any",
        "update_dept_own",
        "update_dept_any",
        "modify_perm_own",
        "modify_perm_any",
        "create_user_own",
        "create_user_any",
        "update_user_own",
        "update_user_any",
        "add_sourcing",
        "update_sourcing",
        "delete_sourcing",
        "create_asset",
        "update_asset",
        "delete_asset",
        "modify_owner"
      ];

      let param = {
        actions: [{
          account: ORG_CONTRACT_NAME,
          name: "modifyperm",
          authorization: [{
            actor: ACTOR,
            permission: 'active',
          }],
          data: {
            sender: ACTOR,
            dept_id: department_shine_name,
            add_permissions: permisions,
            remove_permissions: []
          }
        }]
      };
      // return resolve(uuidv4());
      const result = await api.transact(param, {
        blocksBehind: 3,
        expireSeconds: 3600,
        sign: true,
        broadcast: false,
      });

      let signatures = result.signatures;
      let serializedTransaction = result.serializedTransaction;

      if (!signatures) reject(new Error('signatures missing'));
      if (!serializedTransaction) reject(new Error('serializedTransaction missing'));

      SuperAgent
        .post(BC_SERVICE_URL + '/shineconnect/api/v1/transaction/sendTransaction')
        .send({
          signatures: signatures,
          serializedTransaction: Array.from(serializedTransaction)
        })
        .end((err, res) => {
          // Calling the end function will send the request

          if (err) {
            return reject(new Error('An error occurred with the BCService, err: ' + err));
          }
          if (!res || !res.body) return reject(new Error('An error occurred with the BCService, err: ' + err));
          // parse transaction id out of response
          if (res.body.success == true) return resolve(res.body.data.message.transaction_id);
          return reject(new Error('An error occurred while sending tx to blockchain!')); // TODO think
        });
    });
  }

  sendTransaction(signatures: string[], serializedTransaction: number[]): any {
    return new Promise((resolve, reject) => {
      if (!signatures) reject(new Error('signatures missing'));
      if (!serializedTransaction) reject(new Error('serializedTransaction missing'));

      let trx_data_json = JSON.stringify({
        "type": "push_signed_transaction",
        "payload": {
          signatures: signatures,
          serializedTransaction: Array.from(serializedTransaction)
        }
      });

      SuperAgent
        .post(BC_SERVICE_URL + '/shineconnect/api/v1/transaction/sendTransaction')
        .send({
          signatures: signatures,
          serializedTransaction: Array.from(serializedTransaction)
        })
        .end((err, res) => {
          // Calling the end function will send the request
          if (err) {
            return reject(new Error('An error occurred with the user service, err: ' + err));
          }
          if (!res || !res.body) return reject(new Error('An error occurred with the user service, err: ' + err));
          // parse transaction id out of response
          if (res.body.success == true) return resolve(res.body.data.message.transaction_id);
          return reject(new Error('An error occurred while sending tx to blockchain!')); // TODO think
        });
    });
  }
}
