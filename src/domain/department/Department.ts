import { CreateDepartment, UpdateDepartment } from '../index';
import { IDepartment, IDepartmentUpdate } from './DepartmentInterface';
import { Utils } from '../../domain/Utils';

export class Department {

  constructor() { };

  async create(department: IDepartment, usecase: any) {
    let { shine_private_key, shine_public_key }: any = await new Utils().generateKeyPair();
    let createdepartment = new CreateDepartment({ ...department, shine_private_key, shine_public_key });
    return usecase.execute(createdepartment);
  }

  updateDepartmentByUUID(department: IDepartmentUpdate, usecase: any) {
    let updatedepartment = new UpdateDepartment(department);
    return usecase.execute(updatedepartment)
  }
}