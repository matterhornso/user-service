import fetch from "node-fetch";
import { Api, JsonRpc, RpcError } from "eosjs"
import { JsSignatureProvider } from "eosjs/dist/eosjs-jssig"
import WebSocket from 'ws';

export class Blockchain {
  ws: any = null;
  constructor() {
    this.connectToSocket();
  }

  connectToSocket(): any {
    this.ws = new WebSocket(process.env.socket_endpoint || '');
    this.ws.on('open', () => {
      console.log('connected to blockchain!!');
      this.getMessageFromSocket()
    });
  }

  getMessageFromSocket(): any {
    this.ws.on('message', function incoming(temp: any) {
      let data = JSON.parse(temp).payload
      console.log("data", data);
    });
  }

  pushToBlockchain(data: any): any {
    var array = Array.from(data.serializedTransaction)
    this.ws.send(JSON.stringify({
      "type": "push_signed_transaction",
      "payload": {
        signatures: data.signatures,
        serializedTransaction: array
      }
    }));
  }

  addUser(data: any): any {
    return new Promise(async (resolve, reject) => {
      try {
        let param = {
          actions: [{
            account: process.env.CONTRACT_NAME,
            name: 'adduser',
            authorization: [{
              actor: process.env.CONTRACT_NAME,
              permission: 'active',
            }],
            data: {
              creator: process.env.CONTRACT_NAME,
              account_name: data.account_name,
              is_admin: JSON.parse(data.is_admin),
              org_id: parseInt(data.org_id),
              info: data.info
            }
          }]
        }
        const result = await this.configNetWorkForContactCall(data.privateKey).transact(param, {
          blocksBehind: 3,
          expireSeconds: 600,
          sign: true,
          broadcast: false,
        });
        this.pushToBlockchain(result);
        resolve({
          status: true,
          result: "blockchain call done"
        })
      } catch (err) {
        resolve({
          status: false,
          err: err
        })
      }
    })
  }
  configNetWorkForContactCall(privateKey: any) {
    const signatureProvider = new JsSignatureProvider([privateKey]);
    const rpc = new JsonRpc(process.env.endPoint || 'NA', {
      fetch
    });
    const api = new Api({
      rpc,
      signatureProvider,
      textDecoder: new TextDecoder(),
      textEncoder: new TextEncoder()
    });
    return api
  }
}


