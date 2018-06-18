import { Category } from "../../categories/models/category";

export class ExpenseList {
  Id: Number;
  Description: String;
  Status: Number;
  ExpirationDate: Date;
  Amount: Number;
  PaymentAmount: Number;
  PaymentDate: Date;
  Category: Category;
}
