import { UpdateUser } from "../../../domain/index";
import { IUserRepository } from "../../repositories/IUserRepository";

export class UpdateUserInfo {
  private userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  execute(user: UpdateUser) {
    return this.userRepository.updateUserInfo(user);
  }
}