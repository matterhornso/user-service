import { model } from "mongoose";
import { IDepartmentDocument, IDepartmentModel } from "./department.types";
import DepartmentSchema from "./department.schema";
export const DepartmentModel = model<IDepartmentDocument>("department", DepartmentSchema) as IDepartmentModel;
