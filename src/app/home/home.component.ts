import { DashboardData } from "./models/dashboard-data";
import { Component, OnInit, EventEmitter } from "@angular/core";
import { DashboardService } from "./services/dashboard.service";
import { Dashboard } from "./models/dashboard";
import { ResponseModel } from "../utils/response-model";
import { Router } from "@angular/router";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit {
  colors: any[] = [
    {
      backgroundColor: [
        "#4CAF50",
        "#F44336",
        "#9C27B0",
        "#3F51B5",
        "#00BCD4",
        "#FF9800",
        "#FFEB3B",
        "#795548",
        "#607D8B"
      ]
    }
  ];

  dashboard: Dashboard = {
    TotalExpense: 0,
    TotalRevenue: 0,
    Balance: 0,
    TotalRevenuePerCategory: new DashboardData(),
    TotalExpensePerCategory: new DashboardData(),
    TotalProjectPerCategory: new DashboardData(),
    ExpensesCloseToExpiration: null
  };

  constructor(
    private dashboardService: DashboardService,
    private router: Router
  ) {}

  ngOnInit() {
    this.dashboardService
      .getDashboardData()
      .subscribe((data: ResponseModel) => {
        if (data.StatusCode === 200) {
          Object.assign(this.dashboard, data.Content);
        }
      });
  }

  detailProject(projectId: Number) {
    this.router.navigate(["/project-detail", projectId]);
  }
}
