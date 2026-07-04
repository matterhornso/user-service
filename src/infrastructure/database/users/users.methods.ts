import { Document } from "mongoose";
import { IUserDocument } from "./users.types";
import * as crypto from "crypto";
// export async function setPassword(this: IUserDocument, password: string): Promise<any> {
//   // Creating a unique salt for a particular user
//   this.salt = crypto.randomBytes(16).toString('hex');
//   console.log('this.salt', this.salt)
//   // Hashing user's salt and password with 1000 iterations,
//   //64 length and sha512 digest
//   this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, `sha512`).toString(`hex`);
//   console.log('this.hash', this.hash)
// }
// // Method to check the entered password is correct or not
// // valid password method checks whether the user
// // password is correct or not
// // It takes the user password from the request 
// // and salt from user database entry
// // It then hashes user password and salt
// // then checks if this generated hash is equal
// // to user's hash in the database or not
// // If the user's hash is equal to generated hash 
// // then the password is correct otherwise not
// export async function validPassword(this: IUserDocument, password: string): Promise<any> {
//   var hash = crypto.pbkdf2Sync(password, this.salt as crypto.BinaryLike, 1000, 64, 'sha512').toString('hex');
//   return this.hash === hash;
// }