import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../guards/auth.service';
import { IUser } from './modules/users/users-interfaces';

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
  ];
  languages: { id: string, show: string }[] = [{ id: 'es', show: 'español' }, { id: 'en', show: 'english' }];

  show = true;
  msg = this.sideNavItems[0].text;

  constructor(public auth: AuthService, private router: Router,
    private translate: TranslateService) {


    /*this.sideNavItems = sideNavItems.filter((item) =>
      this.auth.user.role === 'admin' && this.auth.user.tenantId === 'admin'
        ? item.isAdministration
        : !item.isAdministration
    );*/
  }

  async ngOnInit() {
    let userJson = localStorage.getItem('user');
    let token = localStorage.getItem('token');
    if (userJson != undefined && token != undefined) {
      this.auth.validateToken(token).subscribe({
        next: (response: any) => {
          if (!response.ok) {
            this.logOut();
          }
        },
        error: (err) => {
          console.log('Error en la validacion: ', err);
          this.logOut();
        }
      });
    }
    else {
      this.logOut();
    }
    this.msg = this.sideNavItems[0].text;
    this.translate.use(this.languages[0].id);
    if (this.router.url == '/dashboard/places')
      this.msg = this.sideNavItems[1].text;
    else if (this.router.url == '/dashboard/alarms')
      this.msg = this.sideNavItems[2].text;
    else if (this.router.url == '/dashboard/actions')
      this.msg = this.sideNavItems[3].text;
    this.msg = 'dashboard.' + this.msg;
    if (this.auth.user.roles != 0) {
      if (this.sideNavItems[0].text == 'Usuarios')
        this.sideNavItems.splice(0, 1);
    }
  }

  toggle(): void {
    this.drawer.toggle();
    this.show = !this.show;
  }

  logOut(): void {
    this.auth.user = {} as IUser;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigateByUrl('/auth');
  }

  changeLanguaje($event: any) {
    this.translate.use($event);
    this.auth.setLanguage($event);
    this.reloadComponent(true, '');
  }

  reloadComponent(self: boolean, urlToNavigateTo?: string) {
    //skipLocationChange:true means dont update the url to / when navigating
    const url = self ? this.router.url : urlToNavigateTo;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([`/${url}`]).then(() => {
        //console.log(`After navigation I am on:${this.router.url}`)
      })
    })
  }

}
