import { Component } from '@angular/core';
import { MenuService } from './services/menu-service';
import {ExportService} from './services/export-service';
import { Platform, MenuController, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { NavController } from '@ionic/angular';
import { AuthService } from './services/auth-service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  providers: [MenuService, ExportService]
})
export class AppComponent {
  user: any = {};
  badge: any = {};
  public appPages = [];
  headerMenuItem = {}
  isEnabledRTL: boolean = false;
  showSidebar: boolean = true;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private menuService: MenuService,
    private exportService: ExportService,
    private navController: NavController,
    private auth: AuthService,
    private menuCtrl: MenuController,
    private alertCtrl: AlertController,
    ) {
    this.isEnabledRTL = localStorage.getItem('isEnabledRTL') == "true";
    this.initializeApp();
    this.appPages = this.menuService.getAllThemes()
    this.headerMenuItem = this.menuService.getDataForTheme(null)
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.overlaysWebView(false);
      this.statusBar.backgroundColorByHexString('#0091D2');
      this.setRTL();
      if(this.auth.loggedIn) {
        console.log('user is Logged In. auth.getUser', this.auth.getUser);
        this.setUser(this.auth.getUser);
        // this.splashScreen.hide();
      } else {
        console.log('user NOT logged in');
        this.navController.navigateRoot(['login']);
        // this.splashScreen.hide();
      }
    });
  }

  setRTL() {
    document.getElementsByTagName('html')[0]
            .setAttribute('dir', this.isEnabledRTL  ? 'rtl': 'ltr');
  }

  setUser (user) {
    this.user = user;
    this.badge = {
      name: user.user_name,
      email: user.user_email,
    }
  }

  openPage(page) {
    if(page.method && page.method !== '') {
      this[page.method]();
    } else {
      this.navController.navigateRoot([page.url], {});
    }
  }

  async logout() {
    console.log('logout called!');
    this.menuCtrl.toggle();
    const alert = await this.alertCtrl.create({
      header: 'Confirm Logout',
      message: 'Are you sure you want to Logout?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Sure!',
          handler: () => {
            console.log('Confirm Okay');
            this.auth.logout();
            this.navController.navigateRoot(['login']);
            this.showSidebar = false;
          }
        }
      ]
    });

    await alert.present();
  }
}
