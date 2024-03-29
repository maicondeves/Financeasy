import { Customer } from "../../customers/models/customer";
import { Category } from "../../categories/models/category";

export class ProjectList {
  Id: Number;
  Name: String;
  StartDate: Date;
  ConclusionDate: Date;
  Customer: Customer;
  Category: Category;
}
