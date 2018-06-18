import { Customer } from "../../customers/models/customer";
import { Category } from "../../categories/models/category";

export class ProjectDetail {
  Id: number;
  Name: String;
  Description: String;
  Status: Number;
  StartDate: Date;
  ConclusionDate: Date;
  CEP: String;
  StreetAddress: String;
  Complement: String;
  District: String;
  City: String;
  State: String;
  Customer: Customer;
  Category: Category;
}
