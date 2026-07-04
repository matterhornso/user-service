import { promises } from "fs";
import _, { map } from 'underscore';
const ecc = require('eosjs-ecc');

export class Utils {
  constructor() { }

  generateShineName() {
    var result = '';
    var characters = '.12345abcdefghijklmnopqrstuvwxyz';
    var charactersLength = characters.length;
    for (var i = 0; i < 12; i++) {
      result += characters.charAt(_.random(0, 31));
    }
    return result;
  }

  // generate new key pair
  async generateKeyPair() {
    let shine_private_key = await ecc.randomKey();
    let shine_public_key = ecc.privateToPublic(shine_private_key);
    return { shine_private_key, shine_public_key };
  }
}