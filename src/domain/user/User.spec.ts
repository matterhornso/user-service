import { expect } from 'chai';
import { CreateUser } from './CreateUser';
import { v4 as uuidv4 } from "uuid";
import faker from "faker";

let validData = {
  fullName: 'Oha', shineKey: "EOS8UYm6ZV9FKW9Pq2sJYDEqUrzWK4JYtUSAPqrUfXz44JyUhoTeZ", shineName: faker.name.firstName(), shinePrivateKey: "13232",
  is_admin: true, email: '', uuid: uuidv4(), departmentId: "5f62dd2bbf46fa2f691d0337", creator: 'abcd', password: faker.internet.password(),
  user_shine_name: "", user_encrypted_data: "", user_public_key: "", user_signature: ""
};
// let validData1 = { fullName: 'Oha', shineKey: "EOS8UYm6ZV9FKW9Pq2sJYDEqUrzWK4JYtUSAPqrUfXz44JyUhoTeZ", shineName: faker.name.firstName(), is_admin: false, email: '', uuid: uuidv4(), departmentId: "5f62dd2bbf46fa2f691d0337", creator: 'abcd', password: '12345', signatures: ['signature'], serializedTransaction: [0, 1] };
// let validData2 = { fullName: 'Oha', shineKey: "EOS8UYm6ZV9FKW9Pq2sJYDEqUrzWK4JYtUSAPqrUfXz44JyUhoTeZ", shineName: faker.name.firstName(), is_admin: false, email: 'tetstgtetst.com', uuid: uuidv4(), departmentId: "5f62dd2bbf46fa2f691d0337", creator: 'abcd', password: '12345', signatures: ['signature'], serializedTransaction: [0, 1] };
// let validData3 = { fullName: '', shineKey: "EOS8UYm6ZV9FKW9Pq2sJYDEqUrzWK4JYtUSAPqrUfXz44JyUhoTeZ", shineName: faker.name.firstName(), is_admin: false, email: 'tetst@gtetst.com', uuid: uuidv4(), departmentId: "5f62dd2bbf46fa2f691d0337", creator: 'abcd', password: '12345', signatures: ['signature'], serializedTransaction: [0, 1] };
// let validData4 = { fullName: 'Oha', shineKey: "EOS8UYm6ZV9FKW9Pq2sJYDEqUrzWK4JYtUSAPqrUfXz44JyUhoTeZ", shineName: faker.name.firstName(), is_admin: false, email: 'tetst@gtetst.com', uuid: uuidv4(), departmentId: "5f62dd2bbf46fa2f691d0337", creator: 'abcs', password: '12345', signatures: ['signature'], serializedTransaction: [0, 1] };
// let validData5 = { fullName: 'Oha', shineKey: "EOS8UYm6ZV9FKW9Pq2sJYDEqUrzWK4JYtUSAPqrUfXz44JyUhoTeZ", shineName: faker.name.firstName(), is_admin: false, email: 'tetst@gtetst.com', uuid: uuidv4(), departmentId: "5f62dd2bbf46fa2f691d0337", creator: '', password: '12345', signatures: ['signature'], serializedTransaction: [0, 1] };
// let validData6 = { fullName: '', shineKey: "EOS8UYm6ZV9FKW9Pq2sJYDEqUrzWK4JYtUSAPqrUfXz44JyUhoTeZ", shineName: faker.name.firstName(), is_admin: false, email: 'tetst@gtetst.com', uuid: uuidv4(), departmentId: "5f62dd2bbf46fa2f691d0337", creator: 'abcd', password: '', signatures: ['signature'], serializedTransaction: [0, 1] };
// let validData7 = { fullName: 'Oha', shineKey: "EOS8UYm6ZV9FKW9Pq2sJYDEqUrzWK4JYtUSAPqrUfXz44JyUhoTeZ", shineName: faker.name.firstName(), is_admin: false, email: 'tetst@gtetst.com', uuid: uuidv4(), departmentId: "5f62dd2bbf46fa2f691d0337", creator: 'abcd', password: '12345', signatures: ['signature'], serializedTransaction: [0, 1] };

describe('Test Entity User', () => {
  // it('should set user all value', () => {
  //   const user = new CreateUser(validData);
  //   // validData.uuid = user.uuid;
  //   expect(user).to.deep.equal(validData)
  // });

  it('should validate blank email', () => {
    expect(() => new CreateUser(validData)).to.throw()
  });

  // it('should validate email', () => {
  //   expect(() => new CreateUser(validData2)).to.throw()
  // });

  // it('should validate blank fullName', () => {
  //   expect(() => new CreateUser(validData3)).to.throw()
  // });

  // it('should validate blank departmentId', () => {
  //   expect(() => new CreateUser(validData4)).to.throw()
  // });

  // it('should validate blank creator', () => {
  //   expect(() => new CreateUser(validData5)).to.throw()
  // });

  // it('should validate blank password', () => {
  //   expect(() => new CreateUser(validData6)).to.throw()
  // });
});