import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-revenues',
  templateUrl: './revenues.component.html',
  styleUrls: ['./revenues.component.css']
})
export class RevenuesComponent implements OnInit {
  @Input() projectId: Number;
  @Input() monthWork: Number;
  @Input() yearWork: Number;

  constructor() { }

  ngOnInit() {
  }

}
