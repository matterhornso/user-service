import { expect } from 'chai';
import { UserRepository } from '../../../interfaces/database/UserRepository';
import { DepartmentRepository } from '../../../interfaces/database/DepartmentRepository';
import { GetUser } from './GetUser';
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
  fullName: faker.name.firstName(), shineKey: "EOS8UYm6ZV9FKW9Pq2sJYDEqUrzWK4JYtUSAPqrUfXz44JyUhoTeZ", shineName: faker.name.firstName(),
  is_admin: false, email: faker.internet.email(), uuid: uuidv4(),
  departmentId: "5f62dd2bbf46fa2f691d0337", creator: 'abcd', password: faker.internet.password(),
  user_shine_name: "", user_encrypted_data: "", user_public_key: "", user_signature: ""
}
let dummyData1 = { uuid: '25cad909-b268-1111-856f-9bf85e0faa98' }

describe('Test class GetUser', () => {
  // it('find user by Id', async () => {
  //   const userRepository = new UserRepository(mongoConnection);
  //   const departmentRepository = new DepartmentRepository(mongoConnection);
  //   const createUser = new CreateUser(userRepository, departmentRepository);
  //   let create_res = await createUser.execute(dummyData);
  //   expect(create_res.uuid).to.equal(dummyData.uuid)

  //   const getUser = new GetUser(userRepository);
  //   let get_res = await getUser.execute(dummyData.uuid);
  //   expect(get_res.uuid).to.equal(dummyData.uuid)
  // });

  // it('find user by  wrong Id ', async () => {
  //   const userRepository = new UserRepository(mongoConnection);
  //   const getUser = new GetUser(userRepository);
  //   let res = await getUser.execute(dummyData1.uuid);
  //   expect(res).to.eql([])
  // });
});