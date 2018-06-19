import { DashboardData } from "./dashboard-data";
import { Expense } from "../../expenses/models/expense";

export class Dashboard {
  TotalExpense: Number;
  TotalRevenue: Number;
  Balance: Number;
  TotalRevenuePerCategory: DashboardData;
  TotalExpensePerCategory: DashboardData;
  TotalProjectPerCategory: DashboardData;
  ExpensesCloseToExpiration: Array<Expense>;
}
