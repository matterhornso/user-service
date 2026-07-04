import * as express from 'express';
import { AuthService } from "../../interfaces/services/Auth.service";

export function expressAuthentication(
  request: express.Request,
  securityName: string,
  scopes?: string[]
): Promise<any> {
  return new Promise(async (resolve, reject) => {
    if (securityName != "jwt") return reject(new Error("No token provided"));

    const authHeader = request.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return reject(new Error("No token provided"));
    }

    let authService = new AuthService();
    let userInfo = await authService.verifyToken(token);
    if (!userInfo || !userInfo.data) {
      return reject("jwt, no user info found");
    }

    request.headers["_user_uuid"] = userInfo.data.uuid;
    resolve({ valid: true, _user_uuid: userInfo.data.uuid, jwtToken: token });
  }).catch(function (err) {
    console.log("Authentication Error!, ", err)
  });
}