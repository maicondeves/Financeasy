import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.css']
})
export class ExpensesComponent implements OnInit {
  @Input() projectId: Number;
  @Input() monthWork: Number;
  @Input() yearWork: Number;

  constructor() { }

  ngOnInit() {
  }

}
