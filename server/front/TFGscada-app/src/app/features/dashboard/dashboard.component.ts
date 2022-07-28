import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
//import { AuthService } from '@core/services/auth.service';
//import { IUser } from '@shared/interfaces/users.interfaces';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  @ViewChild('drawer') drawer: any;
  sideNavItems: { icon: string, text: string, link: string }[] = [
    { icon: 'supervised_user_circle', text: 'Usuarios', link: './users' },
    { icon: 'store', text: 'Lugares', link: './places' },
    { icon: 'access_alarms', text: 'Alarmas', link: './alarms' },
    { icon: 'flash_on', text: 'Acciones', link: './actions' },
  ];//sideNavItems;
  show = true;


  constructor(/*private auth: AuthService, private router: Router*/) {
    console.log(this.sideNavItems);
    /*this.sideNavItems = sideNavItems.filter((item) =>
      this.auth.user.role === 'admin' && this.auth.user.tenantId === 'admin'
        ? item.isAdministration
        : !item.isAdministration
    );*/
  }

  ngOnInit(): void { }

  toggle(): void {
    this.drawer.toggle();
    this.show = !this.show;
    console.log(this.sideNavItems);
  }

  logout(): void {
    //this.auth.user = {} as IUser;
    localStorage.removeItem('token');
    //this.router.navigate(['auth']);
  }

}
