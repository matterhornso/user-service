import { ChangePassword } from "../../../domain/index";
import { IUserRepository } from "../../repositories/IUserRepository";
export class ChangeUserPassword {
  private userRepository: IUserRepository;
  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }
  execute(user: ChangePassword) {
    return this.userRepository.changePassword(user);
  }

  validatePassword(user: any, oldPassword: string) {
    return this.userRepository.validatePassword(user, oldPassword);
  }
  resetPassword(user: any, newPassword: string) {
    return this.userRepository.resetPassword(user, newPassword);
  }

}