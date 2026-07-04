import { expect } from 'chai';
import { UserRepository } from '../../../interfaces/database/UserRepository';
import { DepartmentRepository } from '../../../interfaces/database/DepartmentRepository';
import { CreateUser } from './CreateUser';
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
import faker from "faker";
import path from "path";

dotenv.config({
  path: path.resolve(__dirname, `../../${process.env.ENVIRONMENT}.env`)
});

import { mongoConnection } from '../../../interfaces/controllers/index'

let dummyData = {
  fullName: faker.name.firstName(), shineKey: "EOS8UYm6ZV9FKW9Pq2sJYDEqUrzWK4JYtUSAPqrUfXz44JyUhoTeZ",
  shineName: faker.name.firstName(), is_admin: false, email: faker.internet.email(), uuid: uuidv4(),
  departmentId: "5f62dd2bbf46fa2f691d0337", creator: 'abcd', password: faker.internet.password(),
  user_shine_name: "", user_encrypted_data: "", user_public_key: "", user_signature: ""
}

describe('Test class CreateUser', () => {
  // it('CreateUser-execute', async () => {
  //   const userRepository1 = new UserRepository(mongoConnection);
  //   const departmentRepository1 = new DepartmentRepository(mongoConnection);
  //   const createUser = new CreateUser(userRepository1, departmentRepository1);
  //   let res = await createUser.execute(dummyData);
  //   expect(res.uuid).to.equal(dummyData.uuid)
  // });

  // it('CreateUser-execute-with-exists-email-id', async () => {
  //   const userRepository1 = new UserRepository(mongoConnection);
  //   const departmentRepository1 = new DepartmentRepository(mongoConnection);
  //   const createUser = new CreateUser(userRepository1, departmentRepository1);
  //   let res = await createUser.execute(dummyData);
  //   expect(res.alreadyExits).to.be.true;
  // });

});
