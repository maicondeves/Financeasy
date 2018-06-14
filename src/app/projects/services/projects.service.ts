import { ResponseModel } from './../../utils/response-model';
import { ProjectList } from './../models/project-list';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Project } from '../models/project';
import { ProjectPut } from '../models/project-put';
import { ProjectPost } from '../models/project-post';
import { ProjectDetail } from '../models/project-detail';

@Injectable()
export class ProjectsService {
  private readonly rootUrl = 'http://api.financeasy.com.br';

  constructor(
    private http: HttpClient
  ) { }

  getAll(): ProjectList[] {
    const token = localStorage.getItem('token');
    const reqHeaders = new HttpHeaders({
      'Content-Type' : 'application/json',
      'Authorization' : 'Basic ' + token
    });

    const projectsList = new Array<ProjectList>();
    this.http.get(this.rootUrl + '/projects', { headers : reqHeaders }).subscribe(
      (data: ResponseModel) => {
        if (data.StatusCode === 200) {
          Object.assign(projectsList, data.Content);
        }
      }
    );

    return projectsList;
  }

  getById(id: Number): Project {
    const token = localStorage.getItem('token');
    const reqHeaders = new HttpHeaders({
      'Content-Type' : 'application/json',
      'Authorization' : 'Basic ' + token
    });

    const project = new Project();
    this.http.get(this.rootUrl + '/projects/' + id.toString(), { headers : reqHeaders }).subscribe(
      (data: ResponseModel) => {
        if (data.StatusCode === 200) {
          Object.assign(project, data.Content);
        }
      }
    );

    return project;
  }

  delete(id: Number) {
    const token = localStorage.getItem('token');
    const reqHeaders = new HttpHeaders({
      'Content-Type' : 'application/json',
      'Authorization' : 'Basic ' + token
    });
    return this.http.delete(this.rootUrl + '/projects/' + id.toString(), { headers : reqHeaders });
  }

  update(projectPut: ProjectPut) {
    const token = localStorage.getItem('token');
    const reqHeaders = new HttpHeaders({
      'Content-Type' : 'application/json',
      'Authorization' : 'Basic ' + token
    });
    return this.http.put(this.rootUrl + '/projects/' + projectPut.Id.toString(), projectPut, { headers : reqHeaders });
  }

  insert(projectPost: ProjectPost) {
    const token = localStorage.getItem('token');
    const reqHeaders = new HttpHeaders({
      'Content-Type' : 'application/json',
      'Authorization' : 'Basic ' + token
    });
    return this.http.post(this.rootUrl + '/projects/', projectPost, { headers : reqHeaders });
  }

  getProjectDetail(id: Number): ProjectDetail {
    const token = localStorage.getItem('token');
    const reqHeaders = new HttpHeaders({
      'Content-Type' : 'application/json',
      'Authorization' : 'Basic ' + token
    });

    const projectDetail = new ProjectDetail();
    this.http.get(this.rootUrl + '/projects/' + id.toString(), { headers : reqHeaders }).subscribe(
      (data: ResponseModel) => {
        if (data.StatusCode === 200) {
          Object.assign(projectDetail, data.Content);
        }
      }
    );

    return projectDetail;
  }
}
