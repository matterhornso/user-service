import { IDepartmentUpdate } from './DepartmentInterface';

export class UpdateDepartment implements IDepartmentUpdate {
  uuid!: string;
  name?: string;
  about?: string;
  active?: boolean;
  roles?: string[];

  constructor(department: IDepartmentUpdate) {
    if (!department.uuid) throw new Error('uuid missing');

    this.uuid = department.uuid;

    if (department.name) this.name = department.name;
    if (department.about) this.about = department.about;
    if (department.active) this.about = department.about;

    // TODO cross check roles name with db

    if (department.roles && department.roles.length > 0) this.roles = department.roles;
    else this.roles = [];
  }
}