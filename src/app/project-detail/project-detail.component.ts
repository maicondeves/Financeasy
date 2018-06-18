import { MzToastService } from 'ng2-materialize';
import { ProjectsService } from './../projects/services/projects.service';
import { RevenueList } from './../revenues/models/revenue-list';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExpenseList } from '../expenses/models/expense-list';
import { ProjectDetail } from '../projects/models/project-detail';
import { ProjectStatus } from '../projects/models/project-status';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.css']
})
export class ProjectDetailComponent implements OnInit {
  projectId: Number;
  projectDetail: ProjectDetail;

  monthWork: number = new Date().getMonth() + 1;
  yearWork: number = new Date().getFullYear();
  yearsOfWork: number[] = [];

  dateMask: Pickadate.DateOptions = {
    format: "dd/mm/yyyy"
  };

  status: ProjectStatus[] = [
    { Id: 1, Description: 'Aguardando Início'},
    { Id: 2, Description: 'Em Andamento'},
    { Id: 3, Description: 'Concluído'}
  ];

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private projectService: ProjectsService
  ) { }

  ngOnInit() {
    this.projectId = Number.parseInt(this.route.snapshot.paramMap.get('id'));
    this.projectDetail = this.getProjectDetail();
    this.createYearSelect();
  }

  createYearSelect() {
    let yearAux = this.yearWork - 6;
    this.yearsOfWork = [];
    for (let index = 0; index < 6; index++) {
      yearAux++;
      this.yearsOfWork.push(yearAux);
    }
    yearAux = this.yearWork;
    for (let index = 0; index < 5; index++) {
      yearAux++;
      this.yearsOfWork.push(yearAux);
    }
  }

  getProjectDetail() {
    return this.projectService.getProjectDetail(this.projectId);
  }

  getStatusDescription(statusId: Number) {
    return this.status.find(x => x.Id === statusId).Description;
  }
}
