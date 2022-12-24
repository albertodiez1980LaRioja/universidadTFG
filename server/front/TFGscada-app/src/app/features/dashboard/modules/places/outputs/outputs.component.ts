import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-outputs',
  templateUrl: './outputs.component.html',
  styleUrls: ['./outputs.component.scss']
})
export class OutputsComponent implements OnInit {
  @Input() IdPlace: any = 1;
  constructor() { }

  ngOnInit(): void {
  }

}
