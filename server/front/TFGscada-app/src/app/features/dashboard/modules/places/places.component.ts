import { Component, OnInit } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-places',
  templateUrl: './places.component.html',
  styleUrls: ['./places.component.scss']
})
export class PlacesComponent implements OnInit {

  constructor(matTab: MatTabsModule) { }

  ngOnInit(): void {
  }

}
